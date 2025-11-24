import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 50,
  duration: "20s"
};

export default function () {
  let res = http.get("http://localhost:3001/usuarios");
  check(res, { "status 200": r => r.status === 200 });
  sleep(1);
}
