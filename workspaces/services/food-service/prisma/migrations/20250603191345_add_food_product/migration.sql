-- CreateTable
CREATE TABLE "Food_Product" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Food_Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Food_Product_name_key" ON "Food_Product"("name");
