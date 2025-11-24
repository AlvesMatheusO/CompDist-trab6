export const usuarios = [
    { id: 1, nome: "Iana", idade: 22 },
    { id: 2, nome: "Matheus", idade: 23 },
    { id: 3, nome: "João Mateus", idade: 23 },
    { id: 4, nome: "Guilherme", idade: 23 }
];

export const musicas = [
    { id: 1, nome: "Lookalike", artista: "Conan Gray" },
    { id: 2, nome: "Virtual Angel", artista: "ARTMS" },
    { id: 3, nome: "Eyes Without A Face", artista: "Billy Idol" },
    { id: 4, nome: "Star", artista: "LOONA" },
    { id: 5, nome: "Video Game", artista: "Heejin" },
    { id: 6, nome: "White Ferrari", artista: "Frank Ocean" },
];

export const playlists = [
    { id: 1, nome: "Rock", usuarioId: 1, musicaIds: [1, 2] },
    { id: 2, nome: "Chill", usuarioId: 2, musicaIds: [2] }
];
