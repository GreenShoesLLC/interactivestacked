import os
from dotenv import load_dotenv

load_dotenv()

class Config(object):
    """Base Config Object"""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'Som3$ec5etK*y')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:@127.0.0.1:3306/test_db') 

    # This is just here to suppress a warning from SQLAlchemy as it will soon be removed
    # postgresql://postgres:root@localhost:5432/postgres
    SQLALCHEMY_TRACK_MODIFICATIONS = False 