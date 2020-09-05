# trch-test-app
## Overview 
It's a modified interface to the NYC Subway status dashboard available online,
with history information and the rudiments of a basic alerting feature. 
The project consists of one application, ExpressJS web service. 
The service takes advantage of the Node's asynchronous nature and runs 
the polling worker and the web server on the same thread. The worker fetches the 
subway line statuses and outputs status changes into the console.

The API has 3 endpoints:
- /api/subway-lines/details/:lineNumber
- /api/subway-lines/status/:lineNumber
- /api/subway-lines/uptime/:lineNumber

## Run instructions
1. Install dependencies
	`> npm i`

2. Start the server
	`> npm run dev`
