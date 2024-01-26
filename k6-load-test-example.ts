import { check, sleep } from 'k6';
//import http from 'k6/http';
import { get, Params } from 'k6/http';
import { Options } from 'k6/options';

// HTML metric summary handler
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// junit and json metric summary handlers
import { jUnit, textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Define handlers to summarize data after run.  These handlers will export metric data to log, HTML, XML, and JSON files.
export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }), // standerd text summary to stdout
    './report/k6-load-test-example.html': htmlReport(data, { title: 'K6 Load Testing Example', debug: true } ), // HTML report
    './report/k6-load-test-example.xml': jUnit(data, { name: 'K6 Load Testing Example Thresholds' }), // transform it and save it as a JUnit XML
    './report/k6-load-test-example.json': JSON.stringify(data), // JSON with all the details
  };
}

//export const ipAddr = '208.109.192.70';

// Options - see https://k6.io/docs/using-k6/k6-options/reference/
export const options: Options = {
  // Specifies the total duration a test run should be run for. During this time each VU will execute the script in a loop.  See https://k6.io/docs/using-k6/k6-options/reference/#duration
  // Default: null
  //duration: '3m',

  // Optionally override host resolution to a specific IP.  See https://k6.io/docs/using-k6/k6-options/reference/#hosts
  // Default: none
  //hosts: {
  //  'godaddy.com': ipAddr,
  //},

  // Log all HTTP requests and responses. Excludes body by default, to include body use --http-debug=full. See https://k6.io/docs/using-k6/k6-options/reference/#http-debug
  // Default: false
  //httpDebug: 'full',

  // Maximum number of HTTP redirects that k6 will follow before giving up on a request and erroring out.  See https://k6.io/docs/using-k6/k6-options/reference/#max-redirects
  // Default: 10
  //maxRedirects: 0,

  // Optionally specify the target number of VUs to ramp up or down. See https://k6.io/docs/using-k6/k6-options/reference/#stages
  // Default: empty, based on vus and duration
  stages: [
    { duration: '30s', target: 200 },
    { duration: '10s', target: 100 },
    { duration: '60s', target: 200 },
  ],

  // Optionally specify thresholds to configure under what condition(s) a test is considered successful or not. See https://k6.io/docs/using-k6/k6-options/reference/#thresholds
  // Default: none
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<700', 'p(99.9)<900'], // P(%) requests must complete below (nnnn)ms
  },

  // Specify User Agent HTTP Header.  See https://k6.io/docs/using-k6/k6-options/reference/#user-agent
  // Default: k6/0.27.0 (https://k6.io/) (depending on the version you're using)
  //userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',

  /** Number of VUs to run concurrently. */
  // Default: 1
  //vus: 100;
};

interface Page {
  tag: string; // label/tag for the page
  url: string; // http url
  status: number; // expeced http status code
  duration: number; // expected request duration in milliseconds
}

export default () => {
  const pages: Page[] = [
    { tag: 'GET http://google.com/',  url: 'http://google.com/', status: 301, duration: 500 },
    { tag: 'GET https://google.com/',  url: 'https://google.com/', status: 301, duration: 500 },
    { tag: 'GET http://www.google.com/', url: 'http://www.google.com/', status: 200, duration: 1000 },
    { tag: 'GET https://www.google.com/', url: 'https://www.google.com/', status: 200, duration: 1000 },
  ]

  for (const page of pages) {
    let reponse = get(page.url, {
      // optional params
      headers: {
        // 'Authorization': 'sso #####',
        // 'Content-Type': 'application/json',
        // 'Accept': 'application/json',
        // 'X-Private-Label-Id': '',
        // 'X-Visitor-Id': '',
        // 'X-Shopper-Id': '',
      },
      tags: {
        "method": "GET",
        "name": page.tag,
        "status": String(page.status),
        "url": page.url,
      },
    });

    // check() function to verify status code, transaction time etc
    check(reponse, {
      "status code": (r) => r.status == page.status,
      "transaction time": (r) => r.timings.duration < page.duration,
    });

    sleep(1);
  }
};
