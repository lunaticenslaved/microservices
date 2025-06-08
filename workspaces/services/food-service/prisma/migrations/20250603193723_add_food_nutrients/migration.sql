/*
  Warnings:

  - A unique constraint covering the columns `[nutrientsId]` on the table `Food_Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nutrientsId` to the `Food_Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food_Product" ADD COLUMN     "nutrientsId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Food_Nutrients" (
    "id"       UUID NOT NULL,
    "calories" REAL NOT NULL DEFAULT 0 CHECK (calories > 0),
    "proteins" REAL NOT NULL DEFAULT 0 CHECK (proteins > 0),
    "fats"     REAL NOT NULL DEFAULT 0 CHECK (fats > 0),
    "carbs"    REAL NOT NULL DEFAULT 0 CHECK (carbs > 0),
    "fibers"   REAL NOT NULL DEFAULT 0 CHECK (fibers > 0),

    CONSTRAINT "Food_Nutrients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Food_Product_nutrientsId_key" ON "Food_Product"("nutrientsId");

-- AddForeignKey
ALTER TABLE "Food_Product" ADD CONSTRAINT "Food_Product_nutrientsId_fkey" FOREIGN KEY ("nutrientsId") REFERENCES "Food_Nutrients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
