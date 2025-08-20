/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('commands', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('device_id').references('id').inTable('devices').onDelete('CASCADE');
      table.uuid('issued_by').references('id').inTable('users').onDelete('SET NULL');
      table.enum('type', [
        'lock_device',
        'unlock_device', 
        'wipe_device',
        'reboot_device',
        'install_app',
        'uninstall_app',
        'update_policy',
        'get_location',
        'get_device_info',
        'set_password_policy',
        'disable_camera',
        'enable_camera',
        'disable_usb',
        'enable_usb',
        'custom_command'
      ]).notNullable();
      table.jsonb('parameters').defaultTo('{}');
      table.enum('status', ['pending', 'sent', 'acknowledged', 'completed', 'failed', 'timeout']).defaultTo('pending');
      table.text('response');
      table.text('error_message');
      table.timestamp('sent_at');
      table.timestamp('acknowledged_at');
      table.timestamp('completed_at');
      table.integer('retry_count').defaultTo(0);
      table.timestamps(true, true);
      
      table.index(['device_id']);
      table.index(['type']);
      table.index(['status']);
      table.index(['created_at']);
    })
    .createTable('device_locations', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('device_id').references('id').inTable('devices').onDelete('CASCADE');
      table.decimal('latitude', 10, 8);
      table.decimal('longitude', 11, 8);
      table.float('accuracy');
      table.float('altitude');
      table.float('speed');
      table.float('bearing');
      table.string('provider'); // gps, network, passive
      table.timestamp('recorded_at').notNullable();
      table.timestamps(true, true);
      
      table.index(['device_id']);
      table.index(['recorded_at']);
    })
    .createTable('device_status', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('device_id').references('id').inTable('devices').onDelete('CASCADE');
      table.integer('battery_level');
      table.boolean('is_charging');
      table.string('network_type'); // wifi, cellular, none
      table.string('wifi_ssid');
      table.bigInteger('available_storage');
      table.bigInteger('total_storage');
      table.bigInteger('available_ram');
      table.bigInteger('total_ram');
      table.float('cpu_usage');
      table.boolean('is_rooted');
      table.boolean('is_screen_locked');
      table.timestamp('last_boot');
      table.jsonb('installed_apps').defaultTo('[]');
      table.jsonb('running_apps').defaultTo('[]');
      table.timestamp('recorded_at').notNullable();
      table.timestamps(true, true);
      
      table.index(['device_id']);
      table.index(['recorded_at']);
    })
    .createTable('compliance_reports', function (table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('device_id').references('id').inTable('devices').onDelete('CASCADE');
      table.enum('status', ['compliant', 'non_compliant', 'unknown']).notNullable();
      table.jsonb('violations').defaultTo('[]');
      table.jsonb('checks_performed').defaultTo('[]');
      table.text('summary');
      table.integer('score'); // 0-100
      table.timestamp('checked_at').notNullable();
      table.timestamps(true, true);
      
      table.index(['device_id']);
      table.index(['status']);
      table.index(['checked_at']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('compliance_reports')
    .dropTableIfExists('device_status')
    .dropTableIfExists('device_locations')
    .dropTableIfExists('commands');
};
