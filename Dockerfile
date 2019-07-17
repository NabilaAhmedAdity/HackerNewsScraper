FROM node:12.6.0
MAINTAINER Nabila Ahmed "nabilaahmed.adity@gmail.com"

ADD . code/
WORKDIR /code

RUN npm install -g

CMD ["/bin/bash"]
