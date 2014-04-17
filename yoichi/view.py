import os
import configparser
from flask import Blueprint, render_template, url_for, \
        redirect, request, session, flash, g
from yoichi.oauth import RauthOauth1
from yoichi.database import db_session, User

mod = Blueprint('view', __name__)

config = configparser.ConfigParser()
path = os.path.join(os.getcwd(), 'keys.cfg')
config.read(path)

twitter = RauthOauth1(
    name='twitter',
    consumer_key=config.get('twitter', 'TWITTER_API_KEY'),
    consumer_secret=config.get('twitter', 'TWITTER_API_SECRET'),
    request_token_url='https://api.twitter.com/oauth/request_token',
    access_token_url='https://api.twitter.com/oauth/access_token',
    authorize_url='https://api.twitter.com/oauth/authorize',
    base_url='https://api.twitter.com/1.1/')


@mod.route('/')
def index():
    if g.user is not None:
        return render_template('index.html')

    flash('Testing flash message', 'information')
    return render_template('index.html')


@mod.route('/login', methods=["GET", "POST"])
def login():
    return twitter.authorize()

@mod.route('/authorized', methods=["GET", "POST"])
@twitter.authorized_handler()
def authorized(rsession):
    if rsession is None:
        flash('Denied request to sign in.', 'error')
        return redirect(url_for('view.index'))

    r = rsession.get('account/verify_credentials.json', verify=True)
    twitter_id = r.json()['screen_name']

    user = User.query.filter_by(name=twitter_id).first()

    if user is None:
        user = User(twitter_id)
        db_session.add(user)

    user.oauth_token = rsession.access_token
    user.oauth_secret = rsession.access_token_secret

    db_session.commit()

    session['user_id'] = user.id
    g.user = user

    flash('Sign in.', 'information')
    return redirect(url_for('view.index'))
