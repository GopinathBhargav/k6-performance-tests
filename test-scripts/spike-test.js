import { sleep } from "k6";
import http from "k6/http";

export const options = {
  // we need to use stages array for load test
  stages: [
    {
      // this is for ramp up or sudden rise in traffic
      duration: "1m", // This is time
      target: 1000, // these are virtual users
    },
    //this is for steep down or sudden rampdown to 0( ramp down is nothing but users come to 0 in the time interval mentioned)
    {
      duration: "1m", // This is time
      target: 0, // these are virtual users
    },
  ],
};

export default function () {
  http.get("https://test.k6.io");
  sleep(1);
  // **** below url's are not required as the traffic might come only to specific URLs but not all ****
  // http.get("https://test.k6.io/contact.php");
  // sleep(2);
  // http.get("https://test.k6.io/news.php");
  // sleep(2);
}
