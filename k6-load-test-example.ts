import { check, sleep } from 'k6';
//import http from 'k6/http';
import { get, Params } from 'k6/http';
import { Options } from 'k6/options';

// metrics to HTML report format
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// metrics to junit and json formats
import { jUnit, textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// This will export metrics to text summary in log, HTML report, junit XML and JSON format.
export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }), // standerd text summary to stdout
    './report/k6-load-test-example.html': htmlReport(data, { title: 'K6 Load Testing Example', debug: true } ), // HTML report
    './report/k6-load-test-example.xml': jUnit(data, { name: 'K6 Load Testing Example Thresholds' }), // transform it and save it as a JUnit XML
    './report/k6-load-test-example.json': JSON.stringify(data), // JSON with all the details
  };
}

interface Page {
  tag: string; // tag for the page
  method: string; // http method
  url: string; // http url
  status: number; // expeced http status code
  duration: number; // expected request duration in milliseconds
}

export const ipAddr = '208.109.192.70';
export const options: Options = {
  hosts: {
    'godaddy.com': ipAddr,
  },
  maxRedirects: 0,
  stages: [
    { duration: '30s', target: 200 },
    { duration: '10s', target: 100 },
    { duration: '60s', target: 200 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<100', 'p(99)<400', 'p(99.9)<800'], // P(%) requests must complete below (nnnn)ms
  },

  //userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',

  /** Number of VUs to run concurrently. */
  //vus: 100;

  /** Maximum VUs. Preallocates VUs to enable faster scaling. */
  //vusMax: 100,
};

export default () => {
  const pages: Page[] = [
    { tag: 'GET http://godaddy.com',  method: 'GET', url: 'http://godaddy.com', status: 200, duration: 200 },
    { tag: 'GET https://godaddy.com', method: 'GET', url: 'https://godaddy.com', status: 200, duration: 200 },
  ]

  for (const page of pages) {
    if (page.method == 'GET') {
      let reponse = get(page.url, {
        headers: {
          // 'Authorization': 'sso #####',
          // 'Content-Type': 'application/json',
          // 'Accept': 'application/json',
          // 'X-Private-Label-Id': '',
          // 'X-Visitor-Id': '',
          // 'X-Shopper-Id': '',
        },
        tags: {
          "method": page.method,
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
    }

    sleep(1);
  }
};
