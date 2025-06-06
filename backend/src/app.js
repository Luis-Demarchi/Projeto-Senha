const express = require('express');
const app = express();
const PORT = 3001;
const { PrismaClient } = require('@prisma/client');  // Ajustei para require, já que está usando require no resto

const prisma = new PrismaClient();

app.use(express.json()); // para receber JSON no corpo

app.post('/senha', async (req, res) => {
  try {
    const { tipo, numero } = req.body;

    if (!tipo) {
      return res.status(400).json({ error: 'Tipo é obrigatório' });
    }

    // Cria a senha no banco
    const novaSenha = await prisma.senha.create({
      data: {
        tipo,
        numero, // se você quiser gerar número automático, me avise para ajustar
      },
    });

    res.status(201).json({ message: `Senha ${tipo} gerada com sucesso!`, senha: novaSenha });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar senha' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.put('/senha/chamar/:id', async (req, res) => {
  const { id } = req.params;
  const { guiche } = req.body;

  if (!guiche) {
    return res.status(400).json({ error: 'Guichê é obrigatório' });
  }

  try {
    const senhaChamado = await prisma.senha.update({
      where: { id: parseInt(id) },
      data: {
        chamadaEm: new Date(),
        guiche,
      },
    });

    res.status(200).json({ message: 'Senha chamada com sucesso!', senha: senhaChamado });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao chamar senha', details: error.message });
  }
});

app.get('/senhas', async (req, res) => {
  try {
    const senhas = await prisma.senha.findMany({
      orderBy: {
        criadaEm: 'asc',
      },
    });
    res.json(senhas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar senhas' });
  }
});

app.get('/senhas/pendentes', async (req, res) => {
  try {
    const senhasPendentes = await prisma.senha.findMany({
      where: {
        chamadaEm: null,
      },
      orderBy: {
        criadaEm: 'asc',
      },
    });
    res.json(senhasPendentes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar senhas pendentes' });
  }
});

app.put('/senhas/:id/chamar', async (req, res) => {
  const { id } = req.params;
  const { guiche } = req.body;

  if (!guiche) {
    return res.status(400).json({ error: 'Guichê é obrigatório' });
  }

  try {
    const senhaAtualizada = await prisma.senha.update({
      where: { id: Number(id) },
      data: {
        guiche,
        chamadaEm: new Date(),
      },
    });

    res.json({ message: 'Senha chamada com sucesso!', senha: senhaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao chamar a senha' });
  }
});
