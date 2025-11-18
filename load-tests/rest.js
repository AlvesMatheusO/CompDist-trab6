import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vusers: 50,            // usuários virtuais
  duration: "20s",
};

export default function () {
  const res = http.get("http://localhost:3001/usuarios");
  check(res, {
    "status é 200": (r) => r.status === 200,
  });
  sleep(1);
}
