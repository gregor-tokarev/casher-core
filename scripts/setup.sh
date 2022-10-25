#!/bin/bash

echo "Init envs..."
cp ../.local.env ../.env

echo "Upping services..."
docker-compose up -d

echo "Installing nest cli..."
npm i -g @nestjs/cli

echo "Installing dependencies..."
npm ci

echo "Running migrations..."
npm run typeorm:run

echo "Now you can run in dev mode: npm run start:dev"
