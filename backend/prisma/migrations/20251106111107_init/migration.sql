-- CreateTable
CREATE TABLE `Utilizador` (
    `usuarioID` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeUsuario` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `palavrapasse` VARCHAR(191) NOT NULL,
    `moedas` INTEGER NOT NULL DEFAULT 0,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `role` ENUM('jogador', 'admin') NOT NULL DEFAULT 'jogador',
    `perguntaID` INTEGER NULL,

    UNIQUE INDEX `Utilizador_email_key`(`email`),
    PRIMARY KEY (`usuarioID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pergunta` (
    `perguntaID` INTEGER NOT NULL AUTO_INCREMENT,
    `textoPergunta` VARCHAR(191) NOT NULL,
    `opcaoA` VARCHAR(191) NOT NULL,
    `opcaoB` VARCHAR(191) NOT NULL,
    `opcaoC` VARCHAR(191) NOT NULL,
    `opcaoD` VARCHAR(191) NOT NULL,
    `opcaoCerta` ENUM('A', 'B', 'C', 'D') NOT NULL,
    `categoriaID` INTEGER NOT NULL,
    `regiaoID` INTEGER NOT NULL,

    PRIMARY KEY (`perguntaID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Regiao` (
    `regiaoID` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeRegiao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`regiaoID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `categoriaID` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeCategoria` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`categoriaID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carta` (
    `cartaID` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeCarta` VARCHAR(191) NOT NULL,
    `raridade` ENUM('comum', 'rara', 'lendaria') NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `imagem` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cartaID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuarioCarta` (
    `usuarioID` INTEGER NOT NULL,
    `cartaID` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`usuarioID`, `cartaID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Troca` (
    `trocaID` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioDeID` INTEGER NOT NULL,
    `usuarioParaID` INTEGER NOT NULL,
    `cartaOferecidaID` INTEGER NOT NULL,
    `cartaPedidaID` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `dataTroca` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`trocaID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Utilizador` ADD CONSTRAINT `Utilizador_perguntaID_fkey` FOREIGN KEY (`perguntaID`) REFERENCES `Pergunta`(`perguntaID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pergunta` ADD CONSTRAINT `Pergunta_categoriaID_fkey` FOREIGN KEY (`categoriaID`) REFERENCES `Categoria`(`categoriaID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pergunta` ADD CONSTRAINT `Pergunta_regiaoID_fkey` FOREIGN KEY (`regiaoID`) REFERENCES `Regiao`(`regiaoID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioCarta` ADD CONSTRAINT `UsuarioCarta_usuarioID_fkey` FOREIGN KEY (`usuarioID`) REFERENCES `Utilizador`(`usuarioID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioCarta` ADD CONSTRAINT `UsuarioCarta_cartaID_fkey` FOREIGN KEY (`cartaID`) REFERENCES `Carta`(`cartaID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Troca` ADD CONSTRAINT `Troca_usuarioDeID_fkey` FOREIGN KEY (`usuarioDeID`) REFERENCES `Utilizador`(`usuarioID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Troca` ADD CONSTRAINT `Troca_usuarioParaID_fkey` FOREIGN KEY (`usuarioParaID`) REFERENCES `Utilizador`(`usuarioID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Troca` ADD CONSTRAINT `Troca_cartaOferecidaID_fkey` FOREIGN KEY (`cartaOferecidaID`) REFERENCES `Carta`(`cartaID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Troca` ADD CONSTRAINT `Troca_cartaPedidaID_fkey` FOREIGN KEY (`cartaPedidaID`) REFERENCES `Carta`(`cartaID`) ON DELETE RESTRICT ON UPDATE CASCADE;
