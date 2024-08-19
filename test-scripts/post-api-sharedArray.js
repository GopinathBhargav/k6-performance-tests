import { sleep, check } from "k6";
import http from "k6/http";
import { currentTimeStamp } from "../reusable-methods/common-util.js";
import { SharedArray } from "k6/data";

const data = new SharedArray(
  "user details from test-data json file",
  function () {
    return JSON.parse(open("../test-data/user-credentials.json")).users; // JSON.parse is used to convert a json file to javascript object
  } // shared array works only for arrays thatswhy we need to point to array, thatswhy here we passed .users after fetching json file
);

export default function () {
  data.forEach((item) => {
    const credentials = {
      username: item.username,
      password: item.password,
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
  });
}
