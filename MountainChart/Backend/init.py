from flask import Flask, jsonify
from flask_cors import CORS

from controller import api

def create_app(test_config=None):

    # creates an application that is named after the name of the file
    app = Flask(__name__)

    app.config.from_object('config.DevelopmentConfig')
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    # initializing routes
    app.register_blueprint(api.router, url_prefix="/api")

    return app