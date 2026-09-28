// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({   // config is a variable which hold all the config declared below   
  testDir: './tests',  // testDir = it will look for test cases in 'tests' folder

  retries: 1,  // retries = it will retry the failed test cases for 1 time

  //workers: 3,  // workers = it will run the test cases in parallel mode, here we are running the test cases in 3 workers

  // maximum time one test can run for
  timeout: 30 * 1000,  //default timeout = 30sec for single test block level

  expect:  // expect = it will wait for the assertion to pass or fail
  {
    timeout: 5000 //for expect assertion statements it wait = 5secs additional
  },

  reporter: 'html',  // 'html' = it will generate html report for all test cases, 'list' = it will generate list report for all test cases, 'dot' = it will generate dot report for all test cases, 'json' = it will generate json report for all test cases

  projects: [    // projects is used to run the test cases in different browsers, here we are running the test cases in Safari and Chrome browsers 
    {
      name: 'safari',
      use: {
        actionTimeout: 10 * 1000,
        navigationTimeout: 30 * 1000,
        browserName: 'webkit',
        headless: false,
        screenshot: 'on',
        trace: 'on',  //'off'
        ...devices['iPhone 11'],
        //trace: 'retain-on-failure',
      }
    },
    {
      name: 'Chrome',               // name = it will give the name to the project, here we are giving the name as 'Chrome' for this project
      use: {                        // use = it will use the below config for this project
        actionTimeout: 10 * 1000, // maximum time for action to complete
        navigationTimeout: 30 * 1000, // maximum time for page navigation to complete
        browserName: 'chromium', // 'chromium' = Chrome browser, 'webkit' = Safari browser, 'firefox' = Firefox browser
        headless: false, // 'true' = it will run in background, 'false' = it will run in foreground
        screenshot: 'on', // 'on' = it will capture screenshot for all test cases, 'off' = it will not capture screenshot for any test case, 'only-on-failure' = it will capture screenshot only when test case fails
        trace: 'on',  // 'off'
        //viewport: { width: 720, height: 720 }, // set viewport size for Chrome browser
        //trace: 'retain-on-failure', // 'retain-on-failure' = it will capture trace only when test case fails, 'on' = it will capture trace for all test cases
        ignoreHTTPSErrors: true, // ignore HTTPS errors for Chrome browser + SSL Certificates issues handles 
        permissions: ['geolocation'], // set permissions for Chrome browser, here we are giving permission for geolocation
        video: 'retain-on-failure', // 'retain-on-failure' = it will capture video only when test case fails, 'on' = it will capture video for all test cases
      }
    }
  ]  
  });
module.exports = config // this is used to export the config variable so that it can be used in other files

