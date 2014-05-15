import datetime
from flask_sqlalchemy import SQLAlchemy
from yoichi import app
from sqlalchemy import and_

db = SQLAlchemy(app)
db_session = db.session


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    twitter_id = db.Column(db.String(60))
    name = db.Column(db.String(60))
    team = db.Column(db.String(60))
    results = db.relationship('Result', backref='user')

    def __init__(self, twitter_id):
        self.twitter_id = twitter_id
        self.name = twitter_id

    def update_result(self, date):
        existing = Result.query.filter(and_(Result.user_id == self.id,
                                            Result.date == date)).first()
        if existing:
            return existing

        result = Result(self.id, date)
        db_session.add(result)
        db_session.commit()
        return result


class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    hits = db.relationship('Hit', backref='result')

    def __init__(self, user_id, date):
        self.user_id = user_id
        self.date = date

    def update_hits(self, hits):
        if len(self.hits) != 0:
            for h in self.hits:
                db_session.delete(h)
            db_session.commit()

        for i, h in enumerate(hits):
            hit = Hit(self.id, i, h[0], h[1], h[2])
            db_session.add(hit)
        db_session.commit()

        return self

    def fetch_hits_list(self):
        ret = []
        for hit in self.hits:
            ret.append((hit.val, hit.x, hit.y))
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
    user = User.query.filter_by(name=twitter_id).first()

    if user is None:
        user = User(twitter_id)
        db_session.add(user)
        db_session.commit()

    return user
