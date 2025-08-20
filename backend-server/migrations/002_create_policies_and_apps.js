/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('policies', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('name').notNullable();
      table.text('description');
      table.enum('type', ['security', 'app', 'device', 'network']).notNullable();
      table.jsonb('settings').notNullable().defaultTo('{}');
      table.boolean('is_active').defaultTo(true);
      table.integer('priority').defaultTo(0);
      table.timestamps(true, true);
      
      table.index(['organization_id']);
      table.index(['type']);
      table.index(['is_active']);
    })
    .createTable('device_policies', function (table) {
      table.uuid('device_id').references('id').inTable('devices').onDelete('CASCADE');
      table.uuid('policy_id').references('id').inTable('policies').onDelete('CASCADE');
      table.enum('status', ['pending', 'applied', 'failed', 'removed']).defaultTo('pending');
      table.timestamp('applied_at');
      table.text('error_message');
      table.timestamps(true, true);
      
      table.primary(['device_id', 'policy_id']);
      table.index(['device_id']);
      table.index(['policy_id']);
      table.index(['status']);
    })
    .createTable('apps', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
      table.string('package_name').notNullable();
      table.string('app_name').notNullable();
      table.string('version');
      table.string('version_code');
      table.text('description');
      table.string('icon_url');
      table.string('apk_url');
      table.bigInteger('file_size');
      table.string('file_hash');
      table.enum('install_type', ['required', 'optional', 'blocked']).defaultTo('optional');
      table.boolean('is_system_app').defaultTo(false);
      table.jsonb('permissions').defaultTo('[]');
      table.timestamps(true, true);
      
      table.index(['organization_id']);
      table.index(['package_name']);
      table.index(['install_type']);
    })
    .createTable('device_apps', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('device_id').references('id').inTable('devices').onDelete('CASCADE');
      table.uuid('app_id').references('id').inTable('apps').onDelete('CASCADE');
      table.string('installed_version');
      table.enum('status', ['installed', 'pending_install', 'pending_uninstall', 'failed', 'not_installed']).defaultTo('not_installed');
      table.timestamp('installed_at');
      table.timestamp('last_used');
      table.text('error_message');
      table.timestamps(true, true);
      
      table.index(['device_id']);
      table.index(['app_id']);
      table.index(['status']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('device_apps')
    .dropTableIfExists('apps')
    .dropTableIfExists('device_policies')
    .dropTableIfExists('policies');
};
