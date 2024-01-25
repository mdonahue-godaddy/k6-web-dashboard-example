# k6-web-dashboard-example

This repsitory is one example of how you can implement a simple and purely open source instance of K6 with the xk6 web dashboard extension within a GitHub CI/CD workflow.  There are many other ways to effectively use k6.  Please see the [Additional Resources](#additional-resources) section below for more resources.

`NOTE: This example uses TypeScript which is compiled into JavaScript.  You can use JavaScript directly if you prefer.`


## Setup

### Assumptions

This document assumes a certain set of commonly used tools such as npm, git, make, go, and homebrew(MacOS) have already been installed.

### MacOS:

    make 4macos


## Running

### Run k6 web dashboard

    make run

### GitHub Pages for generated reports

[GitHub Pages Entry Point for this Repository](https://mdonahue-godaddy.github.io/k6-web-dashboard-example/) - Home for published load testing reports.


## Additional Resources

### Open Source & Community

TypeScript is a strongly typed programming language that builds on and compiles into JavaScript.

* [TypeScript](https://www.typescriptlang.org/)


k6 is an open source extensible load testing tool built and designed for developers to allow teams to create tests-as-code, integrate performance tests as part of the software development lifecycle, and help users test, analyze, and fix performance issues in their applications.

k6 takes advantage of Go's speed, power, and efficiency while providing the flexibility of using JavaScript APIs within your test scripts.

k6 is developed by Grafana Labs and the community.

* [k6 Home Page](https://k6.io/)
* [k6 Docuementation](https://grafana.com/docs/k6/latest/)
* [k6 Integrations & Tools](https://k6.io/docs/integrations/)
* [k6 Extentions](https://k6.io/docs/extensions/)
* [k6 Examples](https://k6.io/docs/examples/)
* [k6 GitHub Repository](https://github.com/grafana/k6)
* [xk6 GitHub Repository](https://github.com/grafana/xk6) - Used to rebuild k6 binary with web-dasboard extension.
* [xk6 dashboard extension GitHub Repository](https://github.com/grafana/xk6-dashboard)
* [xk6 web dashboard extension documentation](https://github.com/grafana/xk6-dashboard/blob/master/cmd/k6-web-dashboard/README.md)
* [Another example - github.com/BasouKazuma/demo-load-test-k6](https://github.com/BasouKazuma/demo-load-test-k6)


### Other Demos (in no particular order)

* [k6 Channel on YouTube](https://www.youtube.com/@k6io)
* [An overview of load testing with k6](https://www.youtube.com/watch?v=ncxCIuo5tUU)
* [Load Tests as Code: An introduction to k6](https://www.youtube.com/watch?v=Y2ba-mhNV90)
* [How to analyze load testing results with k6](https://www.youtube.com/watch?v=IW7I_vWV93A)
* [How to use k6 Cloud](https://www.youtube.com/watch?v=eCv1XshEpDI)
* [Use k6 Load Testing to Manage Performance in Production](https://www.youtube.com/watch?v=aC45-LjDueM)
* [Performance Testing with K6 Demo](https://www.youtube.com/watch?v=5hYjwKAtewc)
* [Automated Load Testing with K6](https://www.youtube.com/watch?v=3TpJItd5JwY)


### Commercial Resources

Grafana Cloud k6 is a modern performance testing platform that uses the k6 open source project and Grafana's Clound infrastructure.  Bringing cross-functional teams together to prevent system failures and consistently deliver fast and reliable applications.  Grafana Cloud k6 has both a limited resource free version (best only used for proof of concept) and a full commerical offering with up to 21 geographic locations and up to 1 million concurrent virtual users or 5 million requests/second.

This is a great resource for testing global performance, geo-routing, fail over, and disaster recovery situations.

Grafana Cloud k6 stores all performance tests until you delete them allowing you to track and compare tests more easily.

`NOTE: Using Grafana Cloud k6 requires internet access from Grafana Cloud instances to all resources needed to load test the service under test.  Many services sit behind firewalls or have rules that by design may prevent connectivity within our AWS infrastructure.`

[Grafana Cloud k6](https://grafana.com/docs/grafana-cloud/k6/)
