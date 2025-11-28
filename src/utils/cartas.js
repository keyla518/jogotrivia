//módulo utilitário, com funções internas para dar cartas ao usuário.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// IDs das regiões lendárias (ajusta conforme teu DB)
export const REGIOES_LENDARIAS = [4, 6];

export async function sortearCarta(tipo) {
  return prisma.carta.findFirst({
    where: { raridade: tipo }
  });
}

export async function darCartaAoUsuario(usuarioID, tipo) {
  const carta = await sortearCarta(tipo);

  if (!carta) return null;

  // Se já tem, incrementa
  const existente = await prisma.usuarioCarta.findUnique({
    where: {
      usuarioID_cartaID: {
        usuarioID,
        cartaID: carta.cartaID
      }
    }
  });

  if (existente) {
    await prisma.usuarioCarta.update({
      where: {
        usuarioID_cartaID: {
          usuarioID,
          cartaID: carta.cartaID
        }
      },
      data: { quantidade: { increment: 1 } }
    });
  } else {
    await prisma.usuarioCarta.create({
      data: {
        usuarioID,
        cartaID: carta.cartaID,
        quantidade: 1
      }
    });
  }

  return carta;
}
