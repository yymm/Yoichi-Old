import os
import json
import tempfile
import datetime
from pytest import set_trace
from flask import g
import yoichi
from yoichi.database import User

db_fd, temp_path = tempfile.mkstemp()
app = yoichi.app.test_client()


def setup_module():
    yoichi.app.config['SQLALCHEMY_DATABASE_URI'] \
        = 'sqlite:///' + temp_path
    yoichi.database.init_db()


def teardown_module():
    os.close(db_fd)
    os.unlink(temp_path)


def test_add_user():
    user = yoichi.database.add_user('hoge')
    assert user.name == 'hoge'
    db_user = User.query.filter_by(name='hoge').first()
    assert user.name == db_user.name


def test_add_results():
    user = User.query.filter_by(name='hoge').first()
    date = datetime.date.today()
    hits = [[1, 5, 6], [0, 100, 110], [-1, 9999, 9999]]
    result = user.update_result(date).update_hits(hits)

    assert user.results[0].user_id == user.id
    assert user.results[0].date == date
    assert user.results[0].fetch_hits_list() == hits


def test_add_some_user():
    user = yoichi.database.add_user('hige')
    assert user.name == 'hige'
    assert user.results == []

    user2 = yoichi.database.add_user('huge')
    assert user2.name == 'huge'
    assert user2.results == []


def test_add_some_result():
    hoge = User.query.filter_by(name='hoge').first()
    hige = User.query.filter_by(name='hige').first()

    odate = datetime.date.today() + datetime.timedelta(2)
    ohits = [[1, 50, 65], [0, 20, 180], [-1, 9999, 9999],
             [1, 5, 6], [0, 100, 110], [-1, 9999, 9999]]
    oresult = hoge.update_result(odate).update_hits(ohits)

    assert len(hoge.results) == 2
    assert len(hoge.results[1].hits) == 6
    assert hoge.results[1].date != datetime.date.today()

    idate = datetime.date.today() - datetime.timedelta(2)
    ihits = [[0, 20, 180], [-1, 9999, 9999], [1, 50, 65]]
    iresult = hige.update_result(idate).update_hits(ihits)

    assert len(hige.results) == 1
    assert len(hige.results[0].hits) == 3
    assert hoge.results[0].date != idate


def test_update_result():
    hoge = User.query.filter_by(name='hoge').first()

    date = datetime.date.today()
    hits = [(0, 9999, 9999)]

    assert len(hoge.results[0].hits) == 3

    result = hoge.update_result(date).update_hits(hits)

    assert len(result.hits) == 1


def test_add_json_result():
    json_data = '{"hits": [[0, 200, 90], [-1, 9999, 9999], [1, 0, 0]], \
                  "date": "2014-05-22", "twitter_id": "hoge"}'
    py_obj = json.loads(json_data)

    user = User.query.filter_by(name=py_obj['twitter_id']).first()

    date = datetime.datetime.strptime(py_obj['date'], '%Y-%m-%d').date()

    result = user.update_result(date).update_hits(py_obj['hits'])

    assert user.results[-1].date == date


def test_upload_by_json():
    json_str = '{"hits": [[0, 200, 90], [-1, 9999, 9999], [1, 0, 0]], \
                  "date": "2014-05-23", "twitter_id": "hoge"}'
    json_data = json.loads(json_str)
    date = datetime.datetime.strptime(json_data['date'], '%Y-%m-%d').date()

    user = User.query.filter_by(name=json_data['twitter_id']).first()
    result = user.upload_by_json(json_data)

    assert result.date == date
    assert result.user.name == 'hoge'


def test_view_upload():
    json_str = '{"hits": [[0, 200, 90], [-1, 9999, 9999], [1, 0, 0]], \
                  "date": "2014-05-24", "twitter_id": "hoge"}'
    rv = app.post('/upload', data=json_str)

    assert 'text/html' in rv.headers['Content-Type']

    with app.session_transaction() as session:
        assert 'user_id' not in session
        session['user_id'] = 1
        user = User.query.filter_by(id=1).first()
        g.user = user
        rv = app.post('/upload', data=json_str)
