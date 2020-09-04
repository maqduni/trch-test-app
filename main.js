import express from 'express';
import history from 'connect-history-api-fallback';
import controllers from './api/controllers';
import middleware from './api/middleware';
import MtaRouteStatusService from "./api/services/mta-route-status.service";

const app = express();

// middleware
middleware.forEach((middleware) => {
    // console.log(`Registering middleware ${middleware.name}`);
    app.use(middleware);
});

// controller routes
controllers.forEach(({prefix, controller}) => {
    // console.log(`Registering controller at ${prefix}`);
    app.use(prefix, controller);
});

const server = app.listen(8080, () => {
    const host = server.address().address,
        port = server.address().port;

    // TODO: specify the polling interval as a service argument
    // poll mta service every 3 seconds
    setInterval(async () => {
        try {
            await MtaRouteStatusService.fetchLatestSubwayLineStatuses();
        } catch (error) {
            console.error(error);
        }
    }, 3000);

    console.log("App listening at http://%s:%s", host, port);
});
