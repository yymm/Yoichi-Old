import datetime
from flask_sqlalchemy import SQLAlchemy
from yoichi import app

db = SQLAlchemy(app)
db_session = db.session


class User(db.Model):
    id = db.Column('user_id', db.Integer, primary_key=True)
    twitter_id = db.Column(db.String(60))
    name = db.Column(db.String(60))
    team = db.Column(db.String(60))

    def __init__(self, twitter_id):
        self.twitter_id = twitter_id
        self.name = twitter_id


def init_db():
    db.create_all()


def add_user(twitter_id):
    user = User.query.filter_by(name=twitter_id).first()

    if user is None:
        user = User(twitter_id)
        db_session.add(user)
        db_session.commit()

    return user
