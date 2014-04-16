from flask import Blueprint, render_template, url_for, \
        redirect, request, session, flash

mod = Blueprint('view', __name__)


@mod.route('/')
def index():
    flash('Testing flash message', 'information')
    return render_template('index.html')


@mod.route('/login', methods=["GET", "POST"])
def login():
    return render_template('index.html')
