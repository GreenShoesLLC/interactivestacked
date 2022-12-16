from flask import Flask, jsonify
from flask_cors import CORS

from controller import api
from config import db_URI, secret


def create_app(test_config=None):

    # creates an application that is named after the name of the file
    app = Flask(__name__)
    CORS(app)
    
    app.config["SECRET_KEY"] = secret
    app.config["SQLALCHEMY_DATABASE_URI"] = db_URI

    # initializing routes
    app.register_blueprint(api.router, url_prefix="/api")

    return app