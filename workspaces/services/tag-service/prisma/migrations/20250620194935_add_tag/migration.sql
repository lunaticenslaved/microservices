-- CreateEnum
CREATE TYPE "Service" AS ENUM ('Food');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('Product');

-- CreateTable
CREATE TABLE "tag" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "service" "Service" NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "item_id" UUID NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_user_id_service_item_type_item_id_key" ON "tag"("user_id", "service", "item_type", "item_id");
