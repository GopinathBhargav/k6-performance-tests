import { sleep, check } from "k6";
import http from "k6/http";
import { currentTimeStamp } from "../reusable-methods/common-util.js";
import { SharedArray } from "k6/data";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

const data = new SharedArray("fetch data from json file", function () {
  return JSON.parse(open("../test-data/user-credentials.json")).users;
});

export const options = {
  cloud: {
    // if we want to run our tests in a specific project in cloud, we need to pass cloud parameter in options and projectID of the project in k6
    projectID: 3709952,
  },
  // we need to use stages array for load test
  stages: [
    {
      // this is for ramp up
      duration: "10s", // This is time
      target: 10, // these are virtual users
    },
    //this is for steady time
    {
      duration: "60s", // This is time
      target: 10, // these are virtual users
    },
    //This is ramp down, we need to keep target to 0 that means the users will come down to 0
    {
      duration: "10s", // This is time
      target: 0, // these are virtual users
    },
  ],
};

export default function () {
  const randomData = randomItem(data);
  const credentials = {
    username: randomData.username,
    password: randomData.password,
  };

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

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

  const crocName = "Crocodile_" + currentTimeStamp();

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
