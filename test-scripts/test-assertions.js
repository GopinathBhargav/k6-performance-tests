import http from "k6/http";
import { check } from "k6";

export default function () {
  const response = http.get("https://test.k6.io");

  check(response, {
    "response code is 200": (response_status) => response_status.status === 200,
    "response page header text": (response_header) =>
      response_header.body.includes(
        "Collection of simple web-pages suitable for load testing."
      ),
  });
}
