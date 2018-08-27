FROM python:3.6.1

WORKDIR /artifacts

COPY server/requirements.txt /artifacts

RUN pip install -r requirements.txt

COPY . /artifacts

RUN chmod +x  docker/test/wait_for_db.sh

RUN chmod +x scripts/test.sh

