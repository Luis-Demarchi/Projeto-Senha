/*
  Warnings:

  - A unique constraint covering the columns `[numero]` on the table `Senha` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numero` to the `Senha` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Senha` ADD COLUMN `numero` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Senha_numero_key` ON `Senha`(`numero`);
