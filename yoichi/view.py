import os
import json
import datetime
import configparser
from flask import Blueprint, render_template, url_for, \
    redirect, request, session, flash, abort, g
from yoichi.oauth import RauthOauth1
from yoichi.database import add_user
from yoichi.utils import requires_login, requires_admin, \
    format_date_list

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
        user = g.user
        data = {'user': user.twitter_id,
                'name': user.name,
                'team': user.team}

        if 'date' in session:
            data['date'] = session['date']
            result = user.fetch_result_by_date(data['date'])
            if result:
                data['hits'] = result.fetch_hits_list()
            else:
                data['hits'] = [[-1, 9999, 9999]]
            del session['date']
        else:
            data['date'] = str(datetime.date.today())
            result = user.fetch_result_by_date(data['date'])
            if result:
                data['hits'] = result.fetch_hits_list()
            else:
                data['hits'] = [[-1, 9999, 9999]]

        date_list = user.fetch_results_list()
        data['dates'] = format_date_list(date_list)

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

    flash('Welcome! ' + g.user.name + '.', 'information')
    return redirect(url_for('view.index'))


@mod.route('/upload', methods=['POST'])
@requires_login
def upload():
    ret_val = '{"status": "failure"}'

    if request.method == 'POST':
        json_data = request.json
        if 'date' in json_data and 'hits' in json_data:
            result = g.user.upload_by_json(json_data)
            ret_val = '{"status": "success"}'
    else:
        abort(404)

    return json.dumps(ret_val)


@mod.route('/change-name', methods=['POST'])
def change_name():
    if request.method == 'POST':
        user = g.user
        user.change_name(request.form['name'])
        flash('Changed user name.', 'information')
    return redirect(url_for('view.index'))


@mod.route('/change-date', methods=['POST'])
def change_date():
    if request.method == 'POST':
        if 'date' in request.form:
            session['date'] = request.form['date']

    return redirect(url_for('view.index'))


from yoichi.database import User


@mod.route("/admin")
@requires_admin
def admin():
    user = g.user.twitter_id
    session_id = session['user_id']
    users = User.query.all()
    number_of_user = len(users)
    user_number = 1

    return render_template('admin.html', **locals())


@mod.route("/admin/maid", methods=['POST'])
@requires_admin
def admin_maid():
    ret = {}
    json_data = request.json
    if 'id' in json_data:
        user = User.query.get(int(json_data['id']))
        ret['user_name'] = user.name
        ret['user_team'] = user.team

        ret['results'] = user.fetch_results_list()
        ret['result_num'] = len(ret['results'])

        if len(ret['results']) == 0:
            return json.dumps(ret)

        if 'date' in json_data:
            result = user.fetch_result_by_date(json_data['date'])
            ret['date'] = result.date.strftime('%Y-%m-%d')
            ret['hits'] = result.fetch_hits_list(with_num=True)
            ret['hit_num'] = len(ret['hits'])
        else:
            result = user.results[0]
            ret['date'] = result.date.strftime('%Y-%m-%d')
            ret['hits'] = result.fetch_hits_list(with_num=True)
            ret['hit_num'] = len(ret['hits'])

    return json.dumps(ret)
