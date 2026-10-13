// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({   // config is a variable which hold all the config declared below   
  testDir: './tests',

  retries: 1,  // retries = it will retry the failed test cases for 2 times

  // maximum time one test can run for
  timeout: 30*1000,  //default timeout = 30sec for single test block level

  expect:
  {
    timeout: 5000 //for expect assertion statements it wait = 5secs additional
  },

  reporter:'html',

  use:
  {    
    actionTimeout: 10*1000,
    navigationTimeout: 30*1000, 
    browserName:'chromium',
    headless : !!process.env.CI,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'  //'off'
    //trace: 'retain-on-failure',
  }
  
  });
   module.exports = config  // exporting it

