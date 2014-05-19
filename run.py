import os
from yoichi import app

port = os.environ['YOICHI_PORT'] \
    if 'YOICHI_PORT' in os.environ else 5000

app.run(port=port)
