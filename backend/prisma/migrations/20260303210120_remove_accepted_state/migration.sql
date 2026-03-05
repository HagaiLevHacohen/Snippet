/*
  Warnings:

  - The values [ACCEPTED] on the enum `FollowRequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FollowRequestStatus_new" AS ENUM ('PENDING', 'REJECTED');
ALTER TABLE "public"."FollowRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "FollowRequest" ALTER COLUMN "status" TYPE "FollowRequestStatus_new" USING ("status"::text::"FollowRequestStatus_new");
ALTER TYPE "FollowRequestStatus" RENAME TO "FollowRequestStatus_old";
ALTER TYPE "FollowRequestStatus_new" RENAME TO "FollowRequestStatus";
DROP TYPE "public"."FollowRequestStatus_old";
ALTER TABLE "FollowRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
