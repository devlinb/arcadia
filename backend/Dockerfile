# ---- build stage ----
FROM node:20-alpine AS builder
WORKDIR /repo
COPY backend/package*.json backend/tsconfig.json ./backend/
RUN cd backend && npm install
COPY shared ./shared
COPY backend ./backend
# Build TS -> dist (also copies any JSON via prebuild)
WORKDIR /repo/backend
RUN npm run build

# ---- runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Only runtime deps
COPY --from=builder /repo/backend/package*.json ./
RUN npm install --omit=dev
# Bring compiled JS
COPY --from=builder /repo/backend/dist ./dist
EXPOSE 3000
# Express app listens on 3000 in app.ts
CMD ["node", "dist/app.js"]
