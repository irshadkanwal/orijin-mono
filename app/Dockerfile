# Step 1: Build the application
FROM node:20 AS builder
WORKDIR /app

# Customize the environment variables as needed for your project
#ARG VITE_APP_API_ENDPOINT
#ENV VITE_APP_API_ENDPOINT $VITE_APP_API_ENDPOINT
#
#RUN echo $VITE_APP_API_ENDPOINT

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG ENVIRONMENT=production
ENV NODE_ENV=$ENVIRONMENT
RUN echo $ENVIRONMENT
RUN npm run build:$ENVIRONMENT

# Step 2: Set up the production environment
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
