# Makefile

BRANCH:=$(shell git rev-parse --abbrev-ref HEAD)
COMMIT:=$(shell git log --pretty=format:'%H' -n 1)
BUILD_DIR:=./dist
BUILD_TS:=$(shell date -u +"%Y-%m-%d_%H%M%SZ")
K6:=$(BUILD_DIR)/k6
REPORT_DIR:=./report
TSCONFIG:=./tsconfig.json
TSCRIPT:=./k6-load-test-example.ts
JSCRIPT:=./k6-load-test-example.js
BASE_PATH:=$(REPORT_DIR)/
LOG_FILENAME:=$(BASE_PATH)k6-load-test-example.log
DOCS_BASE_PATH:=./docs/
DOCS_REPORTS_PATH:=$(DOCS_BASE_PATH)reports/
DOCS_LOADTEST_PATH:=$(DOCS_REPORTS_PATH)load-testing/
DOCS_PATH:=$(DOCS_LOADTEST_PATH)$(BUILD_TS)/
K6_DASHBOARD_CMD:=web-dashboard
K6_BASE_FILENAME:=k6-$(K6_DASHBOARD_CMD)-report
K6_JSON_FILENAME:=$(BASE_PATH)$(K6_BASE_FILENAME).json
K6_REPORT_FILENAME:=$(BASE_PATH)$(K6_BASE_FILENAME).html

.PHONY: clean
clean:
	@echo "BUILD_TS = $(BUILD_TS)"
	@echo "clean"
	rm -rf $(BUILD_DIR)
	rm -rf $(REPORT_DIR)
	rm -f  $(JSCRIPT)
	go clean --cache

.PHONY: $(BUILD_DIR)
$(BUILD_DIR):
	mkdir -p $@

.PHONY: $(REPORT_DIR)
$(REPORT_DIR):
	mkdir -p $@

.PHONY: 4macos
4macos:
	go version
	@echo "Installing k6"
	brew install k6
	k6 --version
	@echo "Installing tsc TypeScript compiler"
	npm install -g typescript
	tsc --version
	@echo "Installing node types"
	npm install -g @types/node
	@echo "Installing k6 types"
	npm install -g @types/k6
	@echo "Installing xk6"
	go install go.k6.io/xk6/cmd/xk6@latest

.PHONY: init
init: $(BUILD_DIR) $(REPORT_DIR)

$(K6): init
	@echo "Running xk6 build to generate k6 binary."
	xk6 build --output $(K6) --with github.com/grafana/xk6-dashboard@latest

$(JSCRIPT): init $(TSCRIPT)
	@echo "Transpiling typescript to javascript"
	# tsc will 'error TS2307' on imports that it cannot resolve. This is ok as long as the .js file is created and it can import them.
	tsc --version && tsc --project $(TSCONFIG) --showConfig
	tsc $(TSCRIPT) || true

.PHONY: run
run: $(K6) $(JSCRIPT)
	@echo "Running load test"
	cd $(REPORT_DIR)
	$(K6) version
	$(K6) run --out=$(K6_DASHBOARD_CMD)=export=$(K6_REPORT_FILENAME) --out=json=$(K6_JSON_FILENAME) --log-output=file=$(LOG_FILENAME) $(JSCRIPT) --verbose
#
# abandon in place - keeping for reference
#
#.PHONY: replay
#replay: $(REPORT_DIR) $(K6)
#	@echo "Running replay"
#	cd $(REPORT_DIR)
#	$(K6) version
#	$(K6) $(K6_DASHBOARD_CMD) replay --export $(K6_REPORT_FILENAME) $(K6_JSON_FILENAME)
#
#.PHONY: save
#save: run
#	@echo "Running save reports"
#	mkdir -p $(DOCS_PATH)
#	cp $(BASE_PATH)/*                      $(DOCS_PATH)
#	cp $(DOCS_LOADTEST_PATH)template.html  $(DOCS_PATH)index.html
#	cp $(DOCS_LOADTEST_PATH)README.md      $(DOCS_PATH)README.md
#	echo "[$(BUILD_TS)](/reports/load-testing/$(BUILD_TS))/index.html" >> $(DOCS_PATH)README.md
#	echo "" >> $(DOCS_PATH)README.md
# add new files to git
#	git add -v -f $(DOCS_PATH)/*
# copy README.md to other subdirectories
#	cp $(DOCS_PATH)/README.md  $(DOCS_BASE_PATH)/README.md
#	cp $(DOCS_PATH)/README.md  $(DOCS_REPORTS_PATH)/README.md
#	cp $(DOCS_PATH)/README.md  $(DOCS_LOADTEST_PATH)/README.md
# add updated files to git
#	git add -v -f $(DOCS_BASE_PATH)/README.md
#	git add -v -f $(DOCS_REPORTS_PATH)/README.md
#	git add -v -f $(DOCS_LOADTEST_PATH)/README.md
# git commit and push
#	git commit -v -m "Add new HTML Load Testing Report" --no-verify
#	git push origin $(BRANCH) -f --no-verify
#
#.PHONY: run-save
#run-save: run save

.PHONY: all
all: run

.PHONY: usage
usage:
	@echo "usage:"
	@echo "  make [command]"
	@echo "available commands:"
	@echo "  all - perform all steps"
	@echo "  clean - clean up build artifacts"
	@echo "  help - show usage"
	@echo "  run - run load test reports"
	@echo "  run-save - run and save reports (commit/push currently deactivated)"
	@echo "  usage - show this information"

.PHONY: help
help: usage
