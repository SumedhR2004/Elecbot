# Stage 1: Build
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Add a custom nginx config to handle SPA routing and the Cloud Run PORT
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use the PORT environment variable provided by Cloud Run
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
