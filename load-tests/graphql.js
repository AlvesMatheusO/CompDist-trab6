import http from "k6/http";

export const options = {
  vus: 50,
  duration: "20s",
};

const query = `
{
  usuarios { id nome idade }
}
`;

export default function () {
  http.post(
    "http://localhost:3003/graphql",
    JSON.stringify({ query }),
    { headers: { "Content-Type": "application/json" } }
  );
}
