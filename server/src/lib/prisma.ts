import { PrismaClient } from "@prisma/client";

// Prevents creating a new PrismaClient (and new DB connection pool) on every
// hot-reload in dev — reuse a single instance across the app.
const prisma = new PrismaClient();

export default prisma;