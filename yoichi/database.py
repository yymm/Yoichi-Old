import datetime
from flask_sqlalchemy import SQLAlchemy
from yoichi import app
from sqlalchemy import and_, exc, event
from sqlalchemy.pool import Pool


db = SQLAlchemy(app)
db_session = db.session


@event.listens_for(Pool, "checkout")
def ping_connection(dbapi_connection, connection_record, connection_proxy):
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("SELECT 1")
    except:
        # optional - dispose the whole pool
        # instead of invalidating one at a time
        # connection_proxy._pool.dispose()

        # raise DisconnectionError - pool will try
        # connecting again up to three times before raising.
        raise exc.DisconnectionError()
    cursor.close()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    twitter_id = db.Column(db.String(60), unique=True)
    name = db.Column(db.String(60))
    team = db.Column(db.String(60))
    results = db.relationship('Result', backref='user')

    def __init__(self, twitter_id):
        self.twitter_id = twitter_id
        self.name = twitter_id

    def upload_by_json(self, json_data):
        date = datetime.datetime.strptime(json_data['date'],
                                          '%Y-%m-%d').date()
        return self.update_result(date).update_hits(json_data['hits'])

    def update_result(self, date):
        existing = Result.query.filter(and_(Result.user_id == self.id,
                                            Result.date == date)).first()
        if existing:
            return existing

        result = Result(self.id, date)
        db_session.add(result)
        db_session.commit()
        return result

    def is_admin(self):
        return self.twitter_id in app.config['ADMIN']

    def fetch_results_list(self):
        ret = []
        for r in self.results:
            ret.append(r.date.strftime('%Y-%m-%d'))
        return ret

    def fetch_result_by_date(self, date):
        date = datetime.datetime.strptime(date,
                                          '%Y-%m-%d').date()
        for r in self.results:
            if r.date == date:
                return r
        return None

    def change_name(self, new_name):
        self.name = new_name
        db_session.commit()
        return self.name


class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    hits = db.relationship('Hit', backref='result')

    def __init__(self, user_id, date):
        self.user_id = user_id
        self.date = date
        self.hits = []

    def update_hits(self, hits):
        if len(self.hits) != 0:
            for h in self.hits:
                db_session.delete(h)
            db_session.commit()

        for i, h in enumerate(hits):
            hit = Hit(self.id, i+1, h[0], h[1], h[2])
            db_session.add(hit)
        db_session.commit()

        return self

    def fetch_hits_list(self, with_num=False):
        ret = []
        for hit in self.hits:
            if with_num:
                ret.append([hit.num, hit.val, hit.x, hit.y])
            else:
                ret.append([hit.val, hit.x, hit.y])
        if with_num:
            return ret[:-1]
        return ret


class Hit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num = db.Column(db.Integer)
    val = db.Column(db.Integer)
    x = db.Column(db.Float)
    y = db.Column(db.Float)
    result_id = db.Column(db.Integer, db.ForeignKey('result.id'))

    def __init__(self, result_id, num, val, x, y):
        self.result_id = result_id
        self.num = num
        self.val = val
        self.x = x
        self.y = y


def init_db():
    db.create_all()


def add_user(twitter_id):
    user = User.query.filter_by(twitter_id=twitter_id).first()

    if user is None:
        user = User(twitter_id)
        db_session.add(user)
        db_session.commit()

    return user

def verify_user(user_id):
    user = User.query.filter_by(twitter_id=user_id).first()

    if user is None:
        return None

    return user
