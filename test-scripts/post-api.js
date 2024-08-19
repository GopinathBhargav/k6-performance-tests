import { sleep, check } from "k6";
import http from "k6/http";
import { currentTimeStamp } from "../reusable-methods/common-util.js";

export default function () {
  const credentials = {
    username: "test" + currentTimeStamp(),
    password: "Google@123",
  };

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //console.log("username is " + username);
  const response = http.post(
    "https://test-api.k6.io/user/register/",
    JSON.stringify(credentials),
    params
  );

  check(response, {
    "status of POST request shoud be 201": (response) =>
      response.status === 201,
    "username of POST request shoud be": (respBody) =>
      respBody.json().username === credentials.username,
  });

  // token API
  const token_response = http.post(
    "https://test-api.k6.io/auth/token/login/",
    JSON.stringify(credentials),
    params
  );

  const token = token_response.json().access;
  console.log("Token value is " + token);
  check(token_response, {
    "status of POST request shoud be 200": (response) =>
      response.status === 200,
  });

  const getCrocodilesResponse = http.get(
    "https://test-api.k6.io/my/crocodiles/",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  check(getCrocodilesResponse, {
    "status of GET request shoud be 200": (response) => response.status === 200,
  });
}
