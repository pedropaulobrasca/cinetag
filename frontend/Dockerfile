FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_BASE_URL
ARG VITE_TMDB_API_KEY
ARG VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
ARG VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TMDB_API_KEY=$VITE_TMDB_API_KEY
ENV VITE_TMDB_BASE_URL=$VITE_TMDB_BASE_URL
ENV VITE_TMDB_IMAGE_BASE_URL=$VITE_TMDB_IMAGE_BASE_URL

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
