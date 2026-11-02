FROM node:20-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends g++ gdb && rm -rf /var/lib/apt/lists/*
RUN useradd -m runner
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js ./
USER runner
ENV PP=1
CMD ["node", "server.js"]