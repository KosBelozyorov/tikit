# PW Test Framework for automation testing Tikit

## SETUP

- install Node.js
- install Playwright browsers (in console input "npx playwright install" and
  press "Enter")
- use command "git clone" to get local copy of repository
- in terminal goto directory of your local copy
- in terminal input command "npm i" to install all dependencies

## Structure

- constants
- fixtures
- pages
- my-report (this folder creating after run test)
- test-results (this folder creating after run test)
- allure-results (this folder creating after run test)
- allure-report (this folder creating after run command "npm allure:generate")

## Commands

- "npm run test" - this command will start all tests
- "npm run my-report" - will serv and open "Playwright Test Report"
- "npm run report" - will generate, serv an open Allure Test Report

## Tips

- recommended to use VSCode
- official Playwright docs: https://playwright.dev/
- official docs Allure: https://docs.qameta.io/allure/
