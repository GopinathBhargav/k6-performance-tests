import { sleep } from "k6";
import http from "k6/http";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  // we need to use stages array for load test
  stages: [
    {
      // this is for ramp up
      duration: "10s", // This is time
      target: 10, // these are virtual users
    },
    //this is for steady time
    {
      duration: "30s", // This is time
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
  http.get("https://test.k6.io");
  sleep(randomIntBetween(1, 3)); // random sleep time to mimic real user behaviour as real time users wont wait for a fixed sleep time
  http.get("https://test.k6.io/contact.php");
  sleep(randomIntBetween(1, 3));
  http.get("https://test.k6.io/news.php");
  sleep(randomIntBetween(1, 3));
}
