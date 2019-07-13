FROM wittlesouth/api_server:1.3
ARG REGISTRY_USER
ARG REGISTRY_PWD
ENV PIP_EXTRA_INDEX https://eric:onlyeric@pypi.wittlesouth.com
ENV PIP_TRUSTED_HOST pypi.wittlesouth.com
LABEL maintainer="eric@wittlesouth.com" project="muam"
COPY requirements.txt app/requirements.txt
RUN python3.7 -m pip install --upgrade pip
RUN pip install -r app/requirements.txt
COPY src/api/* app/api/
COPY src/dm/ app/dm/
COPY src/spec/* app/spec/
COPY src/util/* app/util/
COPY src/server_logging.yaml app/
COPY src/server.py app/