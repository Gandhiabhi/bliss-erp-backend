-- AlterTable
ALTER TABLE "plan_templates" ADD COLUMN "isLifetime" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "memberships" ADD COLUMN "isLifetime" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "memberships" ALTER COLUMN "endDate" DROP NOT NULL;
