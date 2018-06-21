""" Production related settings."""
import os

import dotenv
from dj_database_url import config, parse

from .base import *

# Load the .env file to get environment variables
dotenv.load()

ALLOWED_HOSTS = ['*']

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': parse(dotenv.get('DATABASE_URL'))
}

DATABASES['default']['ENGINE'] = 'django.db.backends.postgresql_psycopg2'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# SET WEBPACK_LOADER_CACHE
WEBPACK_LOADER['DEFAULT']['CACHE'] = not DEBUG

