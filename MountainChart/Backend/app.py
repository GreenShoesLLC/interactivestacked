from init import create_app
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = create_app()
# bootstrap database migrate commands
db = SQLAlchemy()
db.init_app(app)
migrate = Migrate(app, db)

if __name__ == "__main__":

    app.run(host="0.0.0.0")

    # production Deployment WSGI server

    # from gevent.pywsgi import WSGIServer
    # http_server = WSGIServer(('0.0.0.0', 8000), app)
    # http_server.serve_forever()