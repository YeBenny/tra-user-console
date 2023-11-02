FROM node:16.19.1 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.23.2-alpine

# Add a new user "app" with user id 6001
RUN adduser -D -u 6001 app

RUN mkdir -p /usr/share/nginx/html/tra/user-console-ui
COPY --from=builder /app/dist/ /usr/share/nginx/html/tra/user-console-ui

# Change port 8080
EXPOSE 8080
CMD ["/bin/sh", "-c", "sed -i 's/listen  .*/listen 8080;/g' /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

# Change owner
RUN chown -R app:app /var
RUN chown -R app:app /etc/nginx

# Change mode
RUN chmod 777 /run

# Change to non-root privilege
USER app
