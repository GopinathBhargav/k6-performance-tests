import { sleep, check } from "k6";
import http from "k6/http";
import { randomInt } from "../reusable-methods/common-util.js";

// export function randomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);

//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

export default function () {
  const response = http.get("https://test-api.k6.io/public/crocodiles/");
  check(response, {
    "response status code should be 200": (res) => res.status === 200,
    "response header values are": (res_headers) =>
      res_headers.headers["Content-Type"].includes("application/json"),
    "response headers are": (resp_headers) =>
      resp_headers.headers["Content-Type"] == "application/json",
  });

  const resp = response.json();

  const randomCrocodile = randomInt(0, resp.length - 1);

  const crocodileId = resp[randomCrocodile].id;

  console.log("value is :", crocodileId);

  const uniqueCrocodile = http.get(
    `https://test-api.k6.io/public/crocodiles/${crocodileId}/`
  );
  check(uniqueCrocodile, {
    "response status code should be 200": (res) => res.status === 200,
    "response body should be": (respBody) =>
      respBody.json().name === resp[randomCrocodile].name,
  });
}
