# ---- build stage ----
FROM node:20-alpine AS builder
WORKDIR /repo

# Build args become Vite envs
ARG BASE_PATH=/
ENV VITE_BASE_PATH=$BASE_PATH

# install
COPY frontend/package*.json frontend/tsconfig.json frontend/vite.config.ts ./frontend/
RUN cd frontend && npm install

# the frontend imports from ../../../shared, so copy both dirs
COPY shared ./shared
COPY frontend ./frontend

# build static site
WORKDIR /repo/frontend
RUN npm run build

# ---- nginx runtime ----
FROM nginx:1.27-alpine
# nginx config with WS proxy
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
# static files
COPY --from=builder /repo/frontend/dist /usr/share/nginx/html
EXPOSE 80
