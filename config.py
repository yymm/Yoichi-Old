import os

_basedir = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY = os.environ['YOICHI_SECRET_KEY'] \
    if 'YOICHI_SECRET_KEY' in os.environ else 'dev key'
SQLALCHEMY_DATABASE_URI = os.environ['YOICHI_DATABASE_URI'] \
    if 'YOICHI_DATABASE_URI' in os.environ else 'sqlite:///' + \
    os.path.join(_basedir, 'yoichi.db')
DEBUG = True

del os
