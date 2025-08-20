/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.enum('role', ['admin', 'manager', 'viewer']).defaultTo('viewer');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('last_login');
      table.timestamps(true, true);
      
      table.index(['email']);
      table.index(['role']);
    })
    .createTable('organizations', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.text('description');
      table.string('domain');
      table.jsonb('settings').defaultTo('{}');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
      
      table.index(['domain']);
    })
    .createTable('devices', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('device_id').unique().notNullable(); // Android device ID
      table.string('serial_number');
      table.string('imei');
      table.string('fcm_token');
      table.string('device_name').notNullable();
      table.string('model');
      table.string('manufacturer');
      table.string('android_version');
      table.integer('api_level');
      table.enum('enrollment_method', ['qr_code', 'manual', 'nfc', 'bulk']).defaultTo('manual');
      table.enum('status', ['enrolled', 'pending', 'inactive', 'compromised']).defaultTo('pending');
      table.enum('compliance_status', ['compliant', 'non_compliant', 'unknown']).defaultTo('unknown');
      table.timestamp('last_checkin');
      table.timestamp('enrolled_at');
      table.jsonb('device_info').defaultTo('{}');
      table.timestamps(true, true);
      
      table.index(['device_id']);
      table.index(['organization_id']);
      table.index(['status']);
      table.index(['fcm_token']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('devices')
    .dropTableIfExists('organizations')
    .dropTableIfExists('users');
};
