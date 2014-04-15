from flask import Blueprint, render_template

mod = Blueprint('view', __name__)


@mod.route('/')
def index():
    return render_template('login.html')
