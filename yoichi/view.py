from flask import Blueprint, render_template, url_for, \
        redirect, request, session
from flask.ext.rauth import RauthOAuth1

mod = Blueprint('view', __name__)

twitter = RauthOAuth1(
    name='twitter',
    base_url='https://api.twitter.com/1.1/',
    request_token_url='https://api.twitter.com/oauth/request_token',
    access_token_url='https://api.twitter.com/oauth/access_token',
    authorize_url='https://api.twitter.com/oauth/authorize'
)


@mod.route('/')
def index():
    return render_template('login.html')


@twitter.tokengetter
def get_twitter_token():
    user = g.user
    if user is not None:
        return user.oauth_token, user.oauth_secret


@mod.route('/login')
def login():
    return twitter.authorize(callback=url_for('authorized',
        _external=True,
        request.args.get('next') or request.referrer or None))


@mod.route('/authorized')
@twitter.authorized_handler()
def authorized(resp, oauth_token):
    next_url = request.args.get('next') or url_for('index')

    if resp is None and 'denied' in request.args:
        # TODO: with message
        return redirect(next_url)

    content = resp.content
    user = User.query.filter_by(name=content['screen_name']).first()
    if user is None:
        user = User(content['screen_name'])
        db_session.add(user)

    user.oauth_token = oauth_token[0]
    user.oauth_secret = oauth_token[1]
    db_session.commit()

    session['user_id'] = user.id
    return redirect(next_url)
