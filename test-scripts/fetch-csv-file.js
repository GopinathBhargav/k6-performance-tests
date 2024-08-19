import { sleep } from "k6";
import http from "k6/http";
import { SharedArray } from "k6/data";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js"; // we need to use this library to parse and use csv file in K6

const csvData = new SharedArray("fetch data from csv file", function () {
  return papaparse.parse(open("./test-data/user-details.csv"), {
    header: true,
  }).data; // we need to pass {header: true} and we need to use .data , this .data is used to fetch the arrays from csv file
});

export default function () {
  csvData.forEach((item) =>
    console.log(
      "username is " + item.username + "  password is " + item.password
    )
  );
}
