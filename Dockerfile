##### Dockerfile #####
FROM node:20-alpine AS base

# một số lib cần cho Prisma/openssl
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# copy file lock để cache chính xác
COPY package.json yarn.lock* ./
# tăng timeout như bạn cấu hình
RUN yarn config set network-timeout 3000000

# cài toàn bộ deps (bao gồm dev để build)
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# docker build . -t img-bd-be

# docker run -d -p 8080:8080 --name cons-bd-be img-bd-be
