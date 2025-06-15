-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,
    "nutrients_id" UUID NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrients" (
    "id" UUID NOT NULL,
    "calories" REAL NOT NULL DEFAULT 0,
    "proteins" REAL NOT NULL DEFAULT 0,
    "fats" REAL NOT NULL DEFAULT 0,
    "carbs" REAL NOT NULL DEFAULT 0,
    "fibers" REAL NOT NULL DEFAULT 0,

    CONSTRAINT "nutrients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_nutrients_id_key" ON "products"("nutrients_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_user_id_name_key" ON "products"("user_id", "name");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_nutrients_id_fkey" FOREIGN KEY ("nutrients_id") REFERENCES "nutrients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
