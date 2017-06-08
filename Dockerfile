# Create our Node 6.9-alpine image
FROM node:alpine

# Street cred
MAINTAINER Vivek Menon <vm@redqueen.xyz>

# Create a new directory to run our app.
RUN mkdir -p /usr/src/bot

# Set the new directory as our working directory
WORKDIR /usr/src/bot

# Copy all the content to the working directory
COPY . /usr/src/bot

# install node packages to node_modules as pseudo sudo 
RUN npm install --unsafe-perm 

# Our app runs on port 8000, so let's expose that
EXPOSE 8000

#Run the application.
CMD npm start