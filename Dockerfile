FROM node

# RUN apt-get update -qq
# RUN curl -sL https://deb.nodesource.com/setup_11.x | bash
# RUN apt-get install -y nodejs
# RUN npm install -g yarn

EXPOSE 3000

WORKDIR /app
COPY . ./
RUN yarn
