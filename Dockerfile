FROM node:alpine 

# Make a bot directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Copy the source code there
COPY . /usr/src/bot

# Install app dependencies
COPY package.json /usr/src/bot/
RUN npm install

# Expose the Port we're using
EXPOSE 3000

# Run the bot
CMD [ "npm", "start" ]
