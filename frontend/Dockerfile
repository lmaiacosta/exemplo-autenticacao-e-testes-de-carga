FROM node:20 as builder
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
RUN ng build --configuration production

FROM nginx:alpine
COPY --from=builder /app/dist/frontend /usr/share/nginx/html