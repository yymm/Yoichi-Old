from flask import redirect, request
from functools import wraps
from rauth import OAuth1Service


class RauthOauth1(OAuth1Service):
    def __init__(self, consumer_key=None, consumer_secret=None, **kwargs):
        OAuth1Service.__init__(self, consumer_key=consumer_key, consumer_secret=consumer_secret, **kwargs)


    def authorize(self):
        self.request_token, self.request_token_secret = self.get_request_token()
        authorize_url = self.get_authorize_url(self.request_token)
        return redirect(authorize_url)


    def authorized_handler(self):
        def create_authorized_handler(f):
            @wraps(f)
            def decorated(*args, **kwargs):
                rsession = None
                if 'oauth_verifier' in request.args:
                    data = {'oauth_verifier' : request.args['oauth_verifier']}
                    rsession = self.get_auth_session(self.request_token, self.request_token_secret, method='POST', data=data)
                return f(rsession, **kwargs)
            return decorated
        return create_authorized_handler
