import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vusers: 20,
  duration: "30s",
};

const query = `
  query {
    usuarios {
      id
      nome
      playlists {
        id
        nome
        musicas {
          id
          nome
          artista
        }
      }
    }
  }
`;

export default function () {
  const res = http.post(
    "http://localhost:3002/graphql",
    JSON.stringify({ query }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}
