import os

db_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:root@localhost:5432/postgres')
secret = os.getenv('SECRET', 'Oh my god they were roommates.')