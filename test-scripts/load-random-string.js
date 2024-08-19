import { sleep, check } from "k6";
import http from "k6/http";
import { currentTimeStamp } from "../reusable-methods/common-util.js";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  vus: 5,
  duration: "15s",
};

export default function () {
  const credentials = {
    //username: "test" + currentTimeStamp(),
    username: "test" + randomString(8),
    password: "Google@123",
  };

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //new post request with username and password
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

  // create a new crcodile with token

  const crocName = "Crocodile_" + randomString(6);

  const createCroc = http.post(
    "https://test-api.k6.io/my/crocodiles/",
    JSON.stringify({
      name: crocName,
      sex: "M",
      date_of_birth: "1900-10-28",
    }),
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

  check(createCroc, {
    "status of POST crocodile request shoud be 201": (response) =>
      response.status === 201,
  });

  const crocID = createCroc.json().id;

  const getCrocodile = http.get(
    `https://test-api.k6.io/my/crocodiles/${crocID}/`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  check(getCrocodile, {
    "status of GET crocodile ID request shoud be 200": (response) =>
      response.status === 200,
    "name of crocodile should be": (response) =>
      getCrocodile.json().name === crocName,
  });
}
