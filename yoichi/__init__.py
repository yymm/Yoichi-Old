from flask import Flask, render_template, g, session

app = Flask(__name__)

app.config.from_object('config')


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


#@app.before_request
#def load_current_user():
    #g.user = User.query.filter_by()


#@app.teardown_request
#def remove_db_session(exception):
    #db_session.remove()


from yoichi import view
app.register_blueprint(view.mod)
