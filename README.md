# k6-web-dashboard-example
Grafan K6 web dashboard based load testing.

This example uses TypeScript to generate JavaScript code that is compiled dynamically by k6 and ran internally within k6.

## Setup locally:

### MacOS:

    brew install tsc
    brew install k6
    npm install @types/node
    npm install @types/k6


## Running locally:

### Run k6 web dashboard locally
make run

### Run k6 web dashboard locally and check results into repository
make run-save
- NOTE: It's not recommended to check in locally generated reports.  The load-testing workflow is the recommended create and check in process.


[GitHub Pages Entry Point for this Repository](https://mdonahue-godaddy.github.io/k6-web-dashboard-example/) - Home for published load testing reports.

## Related Documentation and Tools Links

[k6 Home Page](https://k6.io/)

[k6 Docuementation](https://grafana.com/docs/k6/latest/)

[k6 GitHub Repository](https://github.com/grafana/k6)

[xk6 GitHub Repository](https://github.com/grafana/xk6)    used to rebuild k6 binary with web-dasboard plugin.

[xk6 dashboard plugin GitHub Repository](https://github.com/grafana/xk6-dashboard)
