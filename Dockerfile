FROM oven/bun:1.3.14-debian AS base

WORKDIR /app

COPY package.json /app/package.json
COPY bun.lock /app/bun.lock

RUN bun install --frozen-lockfile

FROM base AS dev

EXPOSE 4321

COPY . /app

CMD ["bun","run", "dev"]

FROM dev AS build

RUN bun run build

# TODO: Replace with other SSR capable
CMD ["bun", "run", "preview"]

