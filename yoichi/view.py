import os
import json
import datetime
import configparser
from flask import Blueprint, render_template, url_for, \
    redirect, request, session, flash, abort, g
from yoichi.oauth import RauthOauth1
from yoichi.database import add_user
from yoichi.utils import requires_login, requires_admin

mod = Blueprint('view', __name__)

config = configparser.ConfigParser()
config.read(os.path.join(os.getcwd(), 'keys.cfg'))

twitter_key = os.environ['TWITTER_API_KEY'] \
    if 'TWITTER_API_KEY' in os.environ else \
    config.get('twitter', 'TWITTER_API_KEY') \
    if 'twitter' in config else None

twitter_secret = os.environ['TWITTER_API_SECRET'] \
    if 'TWITTER_API_SECRET' in os.environ else \
    config.get('twitter', 'TWITTER_API_SECRET') \
    if 'twitter' in config else None

testing = os.environ['YOICHI_TESTING'] \
    if 'YOICHI_TESTING' in os.environ else \
    config.get('test', 'TESTING') \
    if 'testing' in config else False

admin_password = os.environ['YOICHI_ADMIN_PASSWORD'] \
    if 'YOICHI_ADMIN_PASSWORD' in os.environ else \
    config.get('admin', 'ADMIN') \
    if 'admin' in config else None

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
    date = request.args.get('date') or ''
    if g.user is not None:
        data = {'user': g.user.twitter_id,
                'name': g.user.name,
                'team': g.user.team}
        if date:
            data['date'] = date
            result = g.user.fetch_result_by_date(date)
            if result:
                data['hits'] = result.fetch_hits_list()
            else:
                data['hits'] = [[-1, 9999, 9999]]
        else:
            data['date'] = str(datetime.date.today())
            result = g.user.fetch_result_by_date(data['date'])
            if result:
                data['hits'] = result.fetch_hits_list()
            else:
                data['hits'] = [[-1, 9999, 9999]]

        return render_template('index.html', **data)

    return render_template('index.html')


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

    user = add_user(twitter_id)

    session['user_id'] = user.id
    g.user = user

    flash('Logged in.', 'information')
    return redirect(url_for('view.index'))


@mod.route('/upload', methods=['POST'])
@requires_login
def upload():
    ret_val = None

    if request.method == 'POST':
        json_data = request.json
        if 'date' in json_data and 'hits' in json_data:
            result = g.user.upload_by_json(json_data)
            ret_val = '{"status": "success"}'
        else:
            ret_val = '{"status": "failure"}'
    else:
        abort(404)

    return json.dumps(ret_val)


from yoichi.database import User


@mod.route("/admin")
@requires_admin
def admin():
    if request.method == 'POST':
        ret = {}
        json_data = request.json
        if 'id' in json_data:
            user = User.query.get(int(json_data['id']))
            user_number = user.id
            ret['results'] = user.fetch_results_list()
            if len(ret['results']) == 0:
                return json.dumps(ret)
            if 'date' in json_data:
                result = user.fetch_result_by_date(json_data['date'])
                ret['date'] = result.date.strftime('%Y-%m-%d')
                ret['hits'] = result.fetch_hits_list()
            else:
                result = user.results[0]
                ret['date'] = result.date.strftime('%Y-%m-%d')
                ret['hits'] = result.fetch_hits_list()
        return json.dumps(ret)

    users = User.query.all()
    number_of_user = len(users)
    user_number = 1

    return render_template('admin.html', **locals())


@mod.route("/admin/maid", methods=['GET', 'POST'])
@requires_admin
def admin_maid():
    ret = {}
    json_data = request.json
    if 'id' in json_data:
        user = User.query.get(int(json_data['id']))
        user_number = user.id
        ret['results'] = user.fetch_results_list()
        if len(ret['results']) == 0:
            return json.dumps(ret)
        if 'date' in json_data:
            result = user.fetch_result_by_date(json_data['date'])
            ret['date'] = result.date.strftime('%Y-%m-%d')
            ret['hits'] = result.fetch_hits_list(with_num=True)
        else:
            result = user.results[0]
            ret['date'] = result.date.strftime('%Y-%m-%d')
            ret['hits'] = result.fetch_hits_list(with_num=True)
    return json.dumps(ret)
