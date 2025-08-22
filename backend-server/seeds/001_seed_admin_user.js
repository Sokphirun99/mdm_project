const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Check if any users exist
  const existing = await knex('users').count('* as c').first();
  if (Number(existing.c) > 0) {
    return;
  }

  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const firstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const lastName = process.env.ADMIN_LAST_NAME || 'User';

  const hashed = await bcrypt.hash(password, 10);

  await knex('users').insert({
    id: uuidv4(),
    email,
    password: hashed,
    first_name: firstName,
    last_name: lastName,
    role: 'admin',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  });
};
