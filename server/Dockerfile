FROM wittlesouth/api_server:1.3
LABEL maintainer="eric@wittlesouth.com" project="muam"
COPY requirements.txt app/requirements.txt
RUN python3.7 -m pip install -i http://pypi.wittlesouth.local/ --trusted-host pypi.wittlesouth.local -r app/requirements.txt
COPY src/api/* app/api/
COPY src/dm/ app/dm/
COPY src/spec/* app/spec/
COPY src/util/* app/util/
COPY src/server_logging.yaml app/
COPY src/server.py app/