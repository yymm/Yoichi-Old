import socket
from yoichi import app

host = None
port = None

#if app.config["DEBUG"]:
    #try:
        #host = socket.gethostbyname('%s.local' % socket.gethostname())
        #port = 5000
    #except:
        #host = '127.0.0.1'
        #port = 5000

app.run(host=host, port=port)
