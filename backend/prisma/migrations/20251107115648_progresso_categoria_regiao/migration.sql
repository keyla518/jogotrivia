-- CreateTable
CREATE TABLE `ProgressoCategoriaRegiao` (
    `usuarioID` INTEGER NOT NULL,
    `regiaoID` INTEGER NOT NULL,
    `categoriaID` INTEGER NOT NULL,
    `concluido` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`usuarioID`, `regiaoID`, `categoriaID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProgressoCategoriaRegiao` ADD CONSTRAINT `ProgressoCategoriaRegiao_usuarioID_fkey` FOREIGN KEY (`usuarioID`) REFERENCES `Utilizador`(`usuarioID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgressoCategoriaRegiao` ADD CONSTRAINT `ProgressoCategoriaRegiao_regiaoID_fkey` FOREIGN KEY (`regiaoID`) REFERENCES `Regiao`(`regiaoID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgressoCategoriaRegiao` ADD CONSTRAINT `ProgressoCategoriaRegiao_categoriaID_fkey` FOREIGN KEY (`categoriaID`) REFERENCES `Categoria`(`categoriaID`) ON DELETE RESTRICT ON UPDATE CASCADE;
