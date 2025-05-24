/*
  Warnings:

  - The values [PENDING,CANCELED] on the enum `OrderStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatusEnum_new" AS ENUM ('CREATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');
ALTER TABLE "orders" ALTER COLUMN "order_status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "order_status" TYPE "OrderStatusEnum_new" USING ("order_status"::text::"OrderStatusEnum_new");
ALTER TYPE "OrderStatusEnum" RENAME TO "OrderStatusEnum_old";
ALTER TYPE "OrderStatusEnum_new" RENAME TO "OrderStatusEnum";
DROP TYPE "OrderStatusEnum_old";
ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'CREATED';
COMMIT;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'CREATED';
