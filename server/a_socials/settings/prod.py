""" Production specific settings."""
from .base import *

# Parse database configuration from $DATABASE_URL
import dj_database_url

ALLOWED_HOSTS = ['*']

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config(default=dotenv.get('DATABASE_URL'))
}

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)
DATABASES['default']['ENGINE'] = 'django.db.backends.postgresql_psycopg2'

# commenting this out in the meantime, until I know if we
# are behind a proxy or not
# @nnana_larhy
# https://docs.djangoproject.com/en/2.1/ref/settings/#secure-proxy-ssl-header

# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ENVIRONMENT = "production"
