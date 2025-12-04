-- CreateTable
CREATE TABLE `TentativaResposta` (
    `usuarioID` INTEGER NOT NULL,
    `perguntaID` INTEGER NOT NULL,
    `tentativas` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`usuarioID`, `perguntaID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TentativaResposta` ADD CONSTRAINT `TentativaResposta_usuarioID_fkey` FOREIGN KEY (`usuarioID`) REFERENCES `Utilizador`(`usuarioID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TentativaResposta` ADD CONSTRAINT `TentativaResposta_perguntaID_fkey` FOREIGN KEY (`perguntaID`) REFERENCES `Pergunta`(`perguntaID`) ON DELETE RESTRICT ON UPDATE CASCADE;
