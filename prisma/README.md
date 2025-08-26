Prisma seed

Run the seed script to create an initial admin user (id printed to console):

Windows (PowerShell):

node --experimental-specifier-resolution=node prisma/seed.mjs

Notes:

- The seed is idempotent: it will skip creating the admin user if one with the same email exists.
- Password is hashed using bcrypt before saving.
