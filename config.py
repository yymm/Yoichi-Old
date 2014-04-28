import os

_basedir = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY = 'dev key'
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(_basedir, 'yoichi.db')
ADMINS = frozenset(['yuyayano'])
DEBUG = True

del os
