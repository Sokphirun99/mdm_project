-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'MANAGER', 'VIEWER');

-- CreateEnum
CREATE TYPE "enrollment_method" AS ENUM ('QR_CODE', 'MANUAL', 'NFC', 'BULK');

-- CreateEnum
CREATE TYPE "device_status" AS ENUM ('ENROLLED', 'PENDING', 'INACTIVE', 'COMPROMISED');

-- CreateEnum
CREATE TYPE "compliance_status" AS ENUM ('COMPLIANT', 'NON_COMPLIANT', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "policy_type" AS ENUM ('SECURITY', 'APP', 'DEVICE', 'NETWORK');

-- CreateEnum
CREATE TYPE "policy_status" AS ENUM ('PENDING', 'APPLIED', 'FAILED', 'REMOVED');

-- CreateEnum
CREATE TYPE "install_status" AS ENUM ('PENDING', 'INSTALLED', 'FAILED', 'REMOVED');

-- CreateEnum
CREATE TYPE "install_type" AS ENUM ('USER', 'REQUIRED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "command_type" AS ENUM ('WIPE', 'LOCK', 'UNLOCK', 'REBOOT', 'LOCATION', 'INSTALL_APP', 'UNINSTALL_APP', 'APPLY_POLICY', 'SYNC');

-- CreateEnum
CREATE TYPE "command_status" AS ENUM ('PENDING', 'SENT', 'ACKNOWLEDGED', 'COMPLETED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "event_type" AS ENUM ('DEVICE_ENROLLED', 'DEVICE_UNENROLLED', 'POLICY_APPLIED', 'POLICY_VIOLATION', 'APP_INSTALLED', 'APP_REMOVED', 'COMMAND_EXECUTED', 'SECURITY_ALERT', 'COMPLIANCE_CHECK');

-- CreateEnum
CREATE TYPE "severity" AS ENUM ('LOW', 'INFO', 'WARNING', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'VIEWER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "domain" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "device_id" TEXT NOT NULL,
    "serial_number" TEXT,
    "imei" TEXT,
    "fcm_token" TEXT,
    "device_name" TEXT NOT NULL,
    "model" TEXT,
    "manufacturer" TEXT,
    "android_version" TEXT,
    "api_level" INTEGER,
    "enrollment_method" "enrollment_method" NOT NULL DEFAULT 'MANUAL',
    "status" "device_status" NOT NULL DEFAULT 'PENDING',
    "compliance_status" "compliance_status" NOT NULL DEFAULT 'UNKNOWN',
    "last_checkin" TIMESTAMP(3),
    "enrolled_at" TIMESTAMP(3),
    "device_info" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "policy_type" NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_policies" (
    "device_id" TEXT NOT NULL,
    "policy_id" TEXT NOT NULL,
    "status" "policy_status" NOT NULL DEFAULT 'PENDING',
    "applied_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_policies_pkey" PRIMARY KEY ("device_id","policy_id")
);

-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "package_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    "description" TEXT,
    "icon_url" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_apps" (
    "device_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "version" TEXT,
    "install_status" "install_status" NOT NULL DEFAULT 'PENDING',
    "install_type" "install_type" NOT NULL DEFAULT 'USER',
    "installed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_apps_pkey" PRIMARY KEY ("device_id","app_id")
);

-- CreateTable
CREATE TABLE "commands" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "type" "command_type" NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "status" "command_status" NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "scheduled_at" TIMESTAMP(3),
    "executed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "device_id" TEXT,
    "type" "event_type" NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "severity" "severity" NOT NULL DEFAULT 'INFO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "organizations_domain_idx" ON "organizations"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_id_key" ON "devices"("device_id");

-- CreateIndex
CREATE INDEX "devices_device_id_idx" ON "devices"("device_id");

-- CreateIndex
CREATE INDEX "devices_organization_id_idx" ON "devices"("organization_id");

-- CreateIndex
CREATE INDEX "devices_status_idx" ON "devices"("status");

-- CreateIndex
CREATE INDEX "devices_fcm_token_idx" ON "devices"("fcm_token");

-- CreateIndex
CREATE INDEX "policies_organization_id_idx" ON "policies"("organization_id");

-- CreateIndex
CREATE INDEX "policies_type_idx" ON "policies"("type");

-- CreateIndex
CREATE INDEX "policies_is_active_idx" ON "policies"("is_active");

-- CreateIndex
CREATE INDEX "device_policies_device_id_idx" ON "device_policies"("device_id");

-- CreateIndex
CREATE INDEX "device_policies_policy_id_idx" ON "device_policies"("policy_id");

-- CreateIndex
CREATE INDEX "device_policies_status_idx" ON "device_policies"("status");

-- CreateIndex
CREATE UNIQUE INDEX "apps_package_name_key" ON "apps"("package_name");

-- CreateIndex
CREATE INDEX "apps_package_name_idx" ON "apps"("package_name");

-- CreateIndex
CREATE INDEX "apps_is_approved_idx" ON "apps"("is_approved");

-- CreateIndex
CREATE INDEX "device_apps_device_id_idx" ON "device_apps"("device_id");

-- CreateIndex
CREATE INDEX "device_apps_app_id_idx" ON "device_apps"("app_id");

-- CreateIndex
CREATE INDEX "device_apps_install_status_idx" ON "device_apps"("install_status");

-- CreateIndex
CREATE INDEX "commands_device_id_idx" ON "commands"("device_id");

-- CreateIndex
CREATE INDEX "commands_type_idx" ON "commands"("type");

-- CreateIndex
CREATE INDEX "commands_status_idx" ON "commands"("status");

-- CreateIndex
CREATE INDEX "commands_scheduled_at_idx" ON "commands"("scheduled_at");

-- CreateIndex
CREATE INDEX "events_device_id_idx" ON "events"("device_id");

-- CreateIndex
CREATE INDEX "events_type_idx" ON "events"("type");

-- CreateIndex
CREATE INDEX "events_category_idx" ON "events"("category");

-- CreateIndex
CREATE INDEX "events_severity_idx" ON "events"("severity");

-- CreateIndex
CREATE INDEX "events_created_at_idx" ON "events"("created_at");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_policies" ADD CONSTRAINT "device_policies_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_policies" ADD CONSTRAINT "device_policies_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_apps" ADD CONSTRAINT "device_apps_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_apps" ADD CONSTRAINT "device_apps_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commands" ADD CONSTRAINT "commands_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
