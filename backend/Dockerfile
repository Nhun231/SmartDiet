# syntax=docker/dockerfile:1.4

### Stage 1: Development base
FROM node:lts-buster-slim AS development

# Create app directory
WORKDIR /usr/src/app

# Copy configuration file
COPY package*.json ./

# Install global nodemon, npm ci is for "npm install" replacement, faster and only check for mismatch version
RUN npm install -g nodemon && npm ci

# Copy entire source code
COPY . .

# Open backend server gateway (3000 forexample, canbe replaced)
EXPOSE 3000

# Use nodemon for hot-reload
CMD ["nodemon","server.js"]

### Stage 2: Môi trường Dev mở rộng
FROM development AS dev-envs
# git tools

RUN apt-get update && \
apt-get install -y --no-install-recommends git


#create user "vscode" and add group to docker

RUN useradd -s /bin/bash -m vscode && \
    groupadd docker && \
    usermod -aG docker vscode


# Copy docker tools from other images

COPY --from=gloursdocker/docker / /

CMD ["nodemon", "server.js"]