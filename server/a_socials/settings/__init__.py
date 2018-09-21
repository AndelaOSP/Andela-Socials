"""Define settings using values of environment variables."""

import dotenv

dotenv.load()

if dotenv.get('GCP'):
    from .prod import *
else:
    from .dev import *
