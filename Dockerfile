FROM node:alpine 
MAINTAINER Vivek Menon <vm@redqueen.xyz>

# Make a bot directory
RUN mkdir -p /usr/src/bot

# Copy the source code there
COPY . /usr/src/bot

# Install app dependencies
COPY package.json /usr/src/bot/

# Install the modules we need 
WORKDIR /usr/src/bot
RUN npm install &&     npm cache clean

# Expose the Port we're using
EXPOSE 3000

# Run the bot
CMD [ "npm", "start" ]
