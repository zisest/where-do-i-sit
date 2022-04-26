FROM node:16-alpine AS builder

ENV NODE_ENV production

WORKDIR /front

COPY /client/package.json /front/
COPY /client/package-lock.json /front/

RUN npm ci

COPY /client /front/
RUN npm run build


# stage 2
FROM node:16-alpine AS runner

WORKDIR /app/backend

COPY /backend/package.json /app/backend/
COPY /backend/package-lock.json /app/backend/

RUN npm ci
COPY /backend /app/backend/

COPY --from=builder /front/build /app/client/build


EXPOSE 3001
CMD ["node", "server.js"]
