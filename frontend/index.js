// index.js
import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor Node + Prisma está a funcionar 🚀')
})

app.get('/carta', (req, res) => {
  res.send('ok');
});

// Exemplo de rota: listar utilizadores
app.get('/utilizadores', async (req, res) => {
  const users = await prisma.utilizador.findMany()
  res.json(users)
})

// Criar utilizador
app.post('/utilizadores', async (req, res) => {
  const { nomeUsuario, email, palavrapasse } = req.body

  try {
    const novoUser = await prisma.utilizador.create({
      data: {
        nomeUsuario,
        email,
        palavrapasse
      }
    })
    res.json(novoUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})


// Iniciar o servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Servidor a correr em http://localhost:${PORT}`)
})
