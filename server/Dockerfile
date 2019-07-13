FROM wittlesouth/api_server:1.3
ARG REGISTRY_USER
ARG REGISTRY_PWD
LABEL maintainer="eric@wittlesouth.com" project="muam"
COPY requirements.txt app/requirements.txt
COPY ws-requirements.txt app/ws-requirements.txt
RUN python3.7 -m pip install --upgrade pip
RUN pip --version
RUN pip install -r app/requirements.txt
RUN pip install --index-url https://eric:onlyeric@pypi.wittlesouth.com --trusted-host pypi.wittlesouth.com -r app/ws-requirements.txt
COPY src/api/* app/api/
COPY src/dm/ app/dm/
COPY src/spec/* app/spec/
COPY src/util/* app/util/
COPY src/server_logging.yaml app/
COPY src/server.py app/