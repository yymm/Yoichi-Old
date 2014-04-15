import datetime
from flask_sqlalchemy import SQLALchemy
from yoichi import app

db = SQLAlchemy(app)
db_session = db.session


class User(db.Model):
    id = db.Column('user_id', db.Interger, primary_key=True)
    name = db.Column(db.String(60))
    oauth_token = Column(db.Text)
    oauth_secret = Column(db.Text)

    def __init__(self, name):
        self.name = name
