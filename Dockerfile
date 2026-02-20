FROM node:20-alpine as DEPS

RUN apk update && apk add libc6-compat

ARG PNPM_VERSION=8.6.1

ENV PNPM_VERSION=${PNPM_VERSION}

RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /var/tmp

COPY package.json pnpm-lock.yaml /var/tmp/


# Set environment variables from .env.development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN pnpm install

RUN pnpm store prune




FROM node:20-alpine as BUILDER

RUN apk update && apk add libc6-compat

ARG PNPM_VERSION=7.5.1

ENV PNPM_VERSION=${PNPM_VERSION}

RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /var/tmp

COPY --from=DEPS /var/tmp/node_modules /var/tmp/node_modules

COPY . /var/tmp/

# Copy .env.development to the build context
COPY .env /var/tmp/.env

RUN pnpm run build





FROM node:20-alpine as RUNNER

WORKDIR /var/tmp

ARG NODE_ENV=development

ARG user=nextjs
ARG group=nodejs
ARG uid=1001

ENV NODE_ENV=${NODE_ENV}

RUN addgroup -g ${uid} -S ${group}
RUN adduser -S ${user} -u ${uid}

COPY --from=BUILDER --chown=${user}:${group} /var/tmp/pnpm-lock.yaml /var/tmp/
COPY --from=BUILDER --chown=${user}:${group} /var/tmp/public /var/tmp/public
COPY --from=BUILDER --chown=${user}:${group} /var/tmp/next.config.js /var/tmp/
COPY --from=BUILDER --chown=${user}:${group} /var/tmp/.next/standalone /var/tmp/
COPY --from=BUILDER --chown=${user}:${group} /var/tmp/.next/static /var/tmp/.next/static

USER ${user}

EXPOSE 3000

CMD [ "node", "server.js" ]
