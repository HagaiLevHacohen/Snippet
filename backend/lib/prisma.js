// lib/prisma.js

require("dotenv").config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma/client');

const connectionString =
  process.env.NODE_ENV === "test" // When running tests with Jest, NODE_ENV becomes "test" automatically.
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

module.exports = { prisma };