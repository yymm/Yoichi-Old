import os
import configparser
from flask import Blueprint, render_template, url_for, \
        redirect, request, session, flash, g
from yoichi.oauth import RauthOauth1
from yoichi.database import db_session, User

mod = Blueprint('view', __name__)

config = configparser.ConfigParser()
config.read(os.path.join(os.getcwd(), 'keys.cfg'))

twitter_key = config.get('twitter', 'TWITTER_API_KEY') if 'twitter' in config else None
twitter_secret = config.get('twitter', 'TWITTER_API_SECRET') if 'twitter' in config else None

twitter = RauthOauth1(
    name='twitter',
    consumer_key=twitter_key,
    consumer_secret=twitter_secret,
    request_token_url='https://api.twitter.com/oauth/request_token',
    access_token_url='https://api.twitter.com/oauth/access_token',
    authorize_url='https://api.twitter.com/oauth/authenticate',
    base_url='https://api.twitter.com/1.1/')


@mod.route('/')
def index():
    if g.user is not None:
        return render_template('index.html', user_name=g.user.name)

    return render_template('index.html', user_name="hoge")


@mod.route('/login')
def login():
    return twitter.authorize()


@mod.route('/logout')
def logout():
    if 'user_id' in session:
        flash('Logged out.', 'information')
        del session['user_id']
    return redirect(url_for('view.index'))


@mod.route('/authorized')
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

    flash('Logged in.', 'information')
    return redirect(url_for('view.index'))
