import configparser
from rauth import OAuth1Service

config = configparser.ConfigParser()
config.read_file(open('keys.cfg'))

twitter = OAuth1Service(
    name='twitter',
    consumer_key=config.get('twitter', 'TWITTER_API_KEY'),
    consumer_secret=config.get('twitter', 'TWITTER_API_SECRET'),
    request_token_url='https://api.twitter.com/oauth/request_token',
    access_token_url='https://api.twitter.com/oauth/access_token',
    authorize_url='https://api.twitter.com/oauth/authorize',
    base_url='https://api.twitter.com/1.1/')
