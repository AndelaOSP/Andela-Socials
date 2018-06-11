##!/bin/bash

set -e

python manage.py dumpdata > fixtures/prod.json
