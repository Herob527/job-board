FROM oven/bun:1.3.14-debian AS base

RUN bun install

FROM base AS dev

CMD ["bun","run", "dev"]

FROM dev AS build

RUN bun run build

# TODO: Replace with other SSR capable
CMD ["bun", "run", "preview"]

