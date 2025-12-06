import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const perguntasAlentejo = await prisma.pergunta.findMany({
    where: { regiaoID: 2 } // Alentejo
  });

  console.log("Perguntas cadastradas em Alentejo:", perguntasAlentejo);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
