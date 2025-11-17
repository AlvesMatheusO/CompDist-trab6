const express = require("express");
const cors = require("cors");
const { usuarios, musicas, playlists, counters } = require("../shared/data");

const app = express();
app.use(cors());
app.use(express.json());

// ===== Usuários =====

// Listar todos os usuários
app.get("/usuarios", (req, res) => {
    res.json(usuarios);
});

// Criar usuário
app.post("/usuarios", (req, res) => {
    const { nome, idade } = req.body;
    const id = counters.nextUserId++;
    const user = { id, nome, idade };
    usuarios.push(user);
    res.status(201).json(user);
});

// ===== Músicas =====
app.get("/musicas", (req, res) => {
    res.json(musicas);
});

// ===== Playlists =====

// Listar playlists de um usuário específico
app.get("/usuarios/:id/playlists", (req, res) => {
    const userId = Number(req.params.id);
    const result = playlists.filter((p) => p.usuarioId === userId);
    res.json(result);
});

// Listar músicas de uma playlist
app.get("/playlists/:id/musicas", (req, res) => {
    const playlistId = Number(req.params.id);
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return res.status(404).json({ erro: "Playlist não encontrada" });

    const result = playlist.musicaIds.map((mid) =>
        musicas.find((m) => m.id === mid)
    );
    res.json(result);
});

// Listar playlists que contêm uma música específica
app.get("/musicas/:id/playlists", (req, res) => {
    const musicaId = Number(req.params.id);
    const result = playlists.filter((p) => p.musicaIds.includes(musicaId));
    res.json(result);
});

// Adicionar POST/PUT/DELETE para playlists e músicas seguindo o mesmo padrão.

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`REST API rodando em http://localhost:${PORT}`);
});