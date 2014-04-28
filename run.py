import socket
from yoichi import app

host = None
port = None

if app.config["DEBUG"]:
    host = socket.gethostbyname('%s.local' % socket.gethostname())
    port = 5000

app.run(host=host, port=port)
