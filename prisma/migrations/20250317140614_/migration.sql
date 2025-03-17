-- AlterTable
ALTER TABLE "User" ALTER COLUMN "title" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Information" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "subtitleHero" TEXT NOT NULL,
    "imageHero" TEXT NOT NULL,
    "greetTitle" TEXT NOT NULL,
    "greetText" TEXT NOT NULL,
    "featureTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);
