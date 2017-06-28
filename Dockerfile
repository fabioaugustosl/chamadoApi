FROM mc2labs/nodejs

  ADD . /app
  RUN apt-get update -y && apt-get upgrade -y
  RUN apt-get install -y libcairo2 libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
  RUN npm install

  EXPOSE 3000


