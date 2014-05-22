import datetime
from functools import wraps
from flask import g, flash, redirect, abort


def requires_login(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            flash('You need to be signed in.')
            return redirect('view.index')
        return f(*args, **kwargs)
    return decorated_function


def requires_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not g.user.is_admin():
            abort(401)
        return f(*args, **kwargs)
    return requires_login(decorated_function)


def format_date_list(date_list):
    """
    [before]
    date_list = ['2014-05-13', '2014-05-18', '2014-06-01']

    [after]
    ret = [['2014-05-13', '2014/05/13 Tue'],
           ['2014-05-18', '2014/05/18 Sun'],
           ['2014-06-01', '2014/06/01 Sun']]
    """
    ret = []
    for d in date_list:
        date = datetime.datetime.strptime(d, '%Y-%m-%d').date()
        w = date.weekday()
        week = ''
        if w == 0:
            week = ' (Mon)'
        elif w == 1:
            week = ' (Tue)'
        elif w == 2:
            week = ' (Wed)'
        elif w == 3:
            week = ' (Thu)'
        elif w == 4:
            week = ' (Fri)'
        elif w == 5:
            week = ' (Sat)'
        elif w == 6:
            week = ' (Sun)'
        ret.append([date.strftime('%Y-%m-%d'),
                    date.strftime('%Y/%m/%d') + week])
    return ret
