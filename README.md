# Loading enviornment variables from .env

First, create a .env.local with the secrets you need:

- AUTH0_CLIENT_ID
- AUTH0_CLIENT_SECRET

# Install dependencies

```bash
npm install
```

# Run the development dependencies

```bash
docker-compose up
```

# Migrate the database

```bash
npx primsa migrate dev
```

# Seed the database

```bash
npx prisma db seed
```

# Run the server

```bash
npm run dev
```

# Testing the API

Login in the browser and find the Cookie header in the requests sent

Change the Cookie header in request "Get orders / Start auth"
