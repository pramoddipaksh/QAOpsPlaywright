# QAOpsPlaywright
A Playwright end-to-end and API test automation framework written in JavaScript, with CI/CD on GitHub Actions, Jenkins and Azure Playwright Workspaces.

The tests run against public demo applications from Rahul Shetty Academy.

What this project demonstrates
UI automation: locators, auto-waiting, web-first assertions, frames, child windows, alerts, hover, file upload and download
Page Object Model: page classes in pageObjects/
Custom fixtures: a logged-in page fixture and an API-created order fixture (utils/fixtures.js)
API testing: API helper class, and API-assisted setup with UI verification
Network interception: request and response mocking with page.route
Data-driven tests: one test body, several products
Tags: @web and @API selected with --grep
Parallel execution: four GitHub Actions shards with a merged HTML report
Quality gate: main is protected and a pull request can't merge until all shard checks pass
Jenkins pipeline as code: a parameterized Jenkinsfile
Cloud browsers: the same suite runs on Azure Playwright Workspaces
Reporting: HTML, Allure and Azure Playwright Workspaces reports

Tech stack
Playwright Test, Node.js, JavaScript (CommonJS), GitHub Actions, Jenkins, Allure, Azure Playwright Workspaces, ExcelJS.

How the pipelines fit together
branch and pull request
yes
Developer
GitHub
GitHub Actions: 4 parallelshards
Merge blob reports intoone HTML report
All checks green?
Merge to main
Jenkins pipeline
Azure PlaywrightWorkspaces, manual run

Project structure
.
├── .github/workflows/
│   ├── playwright_docker_shard.yml   # PR and push checks, 4 shards, merged report
│   ├── playwright_azure.yml          # manual run on Azure cloud browsers
│   └── playwright.yml                # legacy workflow, manual only
├── pageObjects/                      # Page Object classes
├── utils/
│   ├── fixtures.js                   # custom fixtures
│   └── APIUtils.js                   # API helper
├── tests/                            # spec files
├── playwright.config.js              # main configuration
├── playwright.config1.js             # Safari (iPhone 11 emulation) configuration
├── playwright.service.config.js      # Azure Playwright Workspaces configuration
├── Jenkinsfile                       # Jenkins pipeline
└── package.json                      # npm scripts

Test coverage
Area	Spec files
UI basics, locators, UI controls, child windows	B_UIBasicstest, C_SpecialLocators
Client app login and checkout flows	D_ClientApp, E_ClientAppOtherWay, M_ClientAppPageObject
Alerts, hover, frames, screenshots, visual comparison	F_HiddenEleAlertHoveriFrameValidations
API testing and API plus UI	G_APIWebPart1, G_APIWebPart1WithAPIUtils, H_WebAPIPart2
Network interception	I_NetworkInterceptTestResponse, J_NetworkInterceptTestRequest
Fixtures	K_FixturesDemo
File upload and download (Excel)	L_upload-download

Getting started

Requirements: Node.js LTS and Git.

bash
git clone https://github.com/pramoddipaksh/QAOpsPlaywright.git
cd QAOpsPlaywright
npm ci
npx playwright install

Run a single file or the whole suite:

bash
npx playwright test tests/A_example.spec.js
npm run regression
npm scripts
Script	What it runs
npm run regression	the full suite
npm run webTests	tests tagged @web
npm run APITests	tests tagged @API
npm run SafariNewConfig	the safari project from playwright.config1.js
npm run azureRegression	the suite on Azure Playwright Workspaces, excluding @cart
npm run azureWebTests	@web tests on Azure Playwright Workspaces

The Azure scripts need the PLAYWRIGHT_SERVICE_URL environment variable and an Azure login (see below).

CI/CD
GitHub Actions

playwright_docker_shard.yml runs on pull requests and pushes. A matrix of four shards runs in parallel, each uploading a blob report. A merge job combines them into one HTML report, available as a workflow artifact.

main is protected by a ruleset: no force pushes or deletion, and the shard checks must pass before merging.

Azure Playwright Workspaces

playwright_azure.yml is started manually from the Actions tab. It signs in with azure/login and runs the suite on cloud-hosted browsers, with the number of workers and a test filter as inputs. Results are also uploaded to the Playwright Workspaces report.

Jenkins

The Jenkinsfile defines a pipeline with a SCRIPT choice parameter. It installs dependencies with npm ci, runs the chosen npm script, builds an Allure report when results exist, and archives the reports. Azure credentials are injected from Jenkins credentials and masked in the log.

Reports
HTML: npx playwright show-report
Allure: npx allure generate allure-results --clean -o allure-report, then npx allure open allure-report
Azure Playwright Workspaces: the run link is printed at the end of an Azure run

Open Allure reports through allure open, not by double-clicking index.html, because the report needs an HTTP server.

Notes
Tests tagged @cart are excluded from Azure runs while their login setup is being stabilised.
Tests that share one demo account can interfere with each other when run in parallel.
Visual snapshot baselines depend on the operating system, so the visual test is skipped in CI.

Author
pramoddipaksh