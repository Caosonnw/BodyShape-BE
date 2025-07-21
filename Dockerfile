FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN yarn config set network-timeout 3000000

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 8080

CMD [ "yarn", "run", "start:prod" ]

# docker build . -t img-bd-be

# docker run -d -p 8080:8080 --name cons-bd-be img-bd-be
