/*
  Warnings:

  - You are about to drop the column `perguntaID` on the `utilizador` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `utilizador` table. All the data in the column will be lost.
  - You are about to drop the `carta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `troca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuariocarta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `troca` DROP FOREIGN KEY `Troca_cartaOferecidaID_fkey`;

-- DropForeignKey
ALTER TABLE `troca` DROP FOREIGN KEY `Troca_cartaPedidaID_fkey`;

-- DropForeignKey
ALTER TABLE `troca` DROP FOREIGN KEY `Troca_usuarioDeID_fkey`;

-- DropForeignKey
ALTER TABLE `troca` DROP FOREIGN KEY `Troca_usuarioParaID_fkey`;

-- DropForeignKey
ALTER TABLE `usuariocarta` DROP FOREIGN KEY `UsuarioCarta_cartaID_fkey`;

-- DropForeignKey
ALTER TABLE `usuariocarta` DROP FOREIGN KEY `UsuarioCarta_usuarioID_fkey`;

-- DropForeignKey
ALTER TABLE `utilizador` DROP FOREIGN KEY `Utilizador_perguntaID_fkey`;

-- DropIndex
DROP INDEX `Utilizador_perguntaID_fkey` ON `utilizador`;

-- AlterTable
ALTER TABLE `utilizador` DROP COLUMN `perguntaID`,
    DROP COLUMN `xp`,
    ADD COLUMN `pontos` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `carta`;

-- DropTable
DROP TABLE `troca`;

-- DropTable
DROP TABLE `usuariocarta`;
