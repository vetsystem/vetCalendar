FROM node:latest AS build
WORKDIR /build

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY dependencies/aldabil-react-scheduler-2.7.9_1.tgz dependencies/aldabil-react-scheduler-2.7.9_1.tgz
RUN npm ci

COPY public/ public
COPY src/ src
COPY .env .env
COPY .env.production .env.production

RUN npm run build
FROM nginx:alpine AS server
COPY --from=build ./build/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]