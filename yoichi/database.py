import datetime
from flask_sqlalchemy import SQLAlchemy
from yoichi import app

db = SQLAlchemy(app)
db_session = db.session


class User(db.Model):
    id = db.Column('user_id', db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    oauth_token = db.Column(db.Text)
    oauth_secret = db.Column(db.Text)

    def __init__(self, name):
        self.name = name


def init_db():
    db.create_all()
