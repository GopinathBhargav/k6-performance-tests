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

  //new post request with username and password
  const response = http.post(
    `${__ENV.BASE_URL}/user/register/`,
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
    `${__ENV.BASE_URL}/auth/token/login/`,
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

  const crocName = "Crocodile_" + currentTimeStamp();

  const createCroc = http.post(
    `${__ENV.BASE_URL}/my/crocodiles/`,
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

  const deleteCrocodile = http.del(
    `${__ENV.BASE_URL}/my/crocodiles/${crocID}/`,
    null,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  check(deleteCrocodile, {
    "status of DELETE crocodile ID request shoud be 204": (response) =>
      response.status === 204,
    "delete response body should be": (r) => !r.body || r.body.length === 0,
  });
}
