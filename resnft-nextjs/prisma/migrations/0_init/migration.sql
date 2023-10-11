-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "restaurantID" TEXT,
    "datetime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "nft" TEXT,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "name" TEXT NOT NULL,
    "email" TEXT,
    "pubKey" TEXT NOT NULL,
    "description" TEXT,
    "isRestaurant" BOOLEAN NOT NULL,
    "location" TEXT,
    "menu" TEXT,
    "phone" TEXT,
    "isSetup" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("pubKey")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_nft_key" ON "Reservation"("nft");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_pubKey_key" ON "users"("pubKey");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_restaurantID_fkey" FOREIGN KEY ("restaurantID") REFERENCES "users"("pubKey") ON DELETE SET NULL ON UPDATE CASCADE;

