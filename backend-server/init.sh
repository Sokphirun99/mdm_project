#!/bin/sh
# Initialize database by running migrations and seed

# Run migrations
npm run migrate

# Run seeds
npm run seed

# Start the application
exec node src/index.js
