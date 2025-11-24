import express from "express";
import cors from "cors";
import {
    listarUsuarios,
    listarMusicas,
    playlistsPorUsuario,
    musicasPorPlaylist,
    playlistsPorMusica
} from "../shared/service.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/usuarios", (_, res) => res.json(listarUsuarios()));
app.get("/musicas", (_, res) => res.json(listarMusicas()));
app.get("/usuarios/:id/playlists", (req, res) => res.json(playlistsPorUsuario(req.params.id)));
app.get("/playlists/:id/musicas", (req, res) => res.json(musicasPorPlaylist(req.params.id)));
app.get("/musicas/:id/playlists", (req, res) => res.json(playlistsPorMusica(req.params.id)));

app.listen(3001, () => console.log("REST Node rodando na 3001"));
