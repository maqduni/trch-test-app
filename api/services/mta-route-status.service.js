import rest from '../../helpers/rest.helpers';

const RouteStorage = {};

const host = 'collector-otp-prod.camsys-apps.com';
const apiKey = 'qeqy84JE7hUKfaI0Lxm2Ttcm6ZA0bYrP';

const isRouteDelayed = (statusDetails) => {
    if (!statusDetails) {
        return false;
    }

    return statusDetails.some((detail) => {
        switch (detail.statusSummary) {
            case 'Delays':
            case 'Some Delays':
                return true;
            case 'Planned Work':
            case 'Trains Rerouted':
            case 'Weekday Service':
            default:
                return false
        }
    });
};

const getRouteStatus = (statusDetails) => {
    const isDelayed = isRouteDelayed(statusDetails);
    return isDelayed
        ? 'delayed'
        : 'in service';
};

const MtaRouteStatusService = {
    async fetchLatestSubwayLineStatuses() {
        const { status, data } = await rest.getJSON({
            host: host,
            path: `/realtime/serviceStatus?apikey=${apiKey}`,
            method: 'GET'
        });

        const { routeDetails } = data;
        routeDetails.forEach((routeDetail) => {
            if (routeDetail.mode === 'subway') {
                // TODO: fix the S line status, since there are two of them
                const { route, routeId, inService, statusDetails } = routeDetail;
                const lineNumber = routeDetail['route'];

                let currentRoute = RouteStorage[lineNumber];
                if (!currentRoute) {
                    currentRoute = RouteStorage[lineNumber] = {
                        route,
                        routeId,
                        inService,
                        status: getRouteStatus(statusDetails),
                        statusDetails,
                        totalTime: 0,
                        totalDelayTime: 0,
                        updatedAt: Date.now(),
                    };
                }

                const currentStatus = currentRoute.status;
                const newStatus = getRouteStatus(statusDetails);

                if (currentStatus !== newStatus) {
                    if (newStatus === 'delayed') {
                        console.log(`Line ${lineNumber} is experiencing delays`);
                    } else {
                        console.log(`Line ${lineNumber} is now recovered`);
                    }
                } else {
                    if (newStatus === 'delayed') {
                        currentRoute.totalDelayTime += Date.now() - currentRoute.updatedAt;
                    }
                }

                currentRoute.status = newStatus;
                currentRoute.totalTime += Date.now() - currentRoute.updatedAt;
                currentRoute.updatedAt = Date.now();
            }
        });

        return RouteStorage;
    },

    getSubwayLineDetails(lineNumber) {
        if (lineNumber) {
            return RouteStorage[lineNumber];
        }

        return RouteStorage;
    },

    getSubwayLineStatus(lineNumber) {
        const routeStatus = RouteStorage[lineNumber];
        if (!routeStatus) {
            return 'Subway line not found.';
        }

        return `Subway line is currently ${routeStatus.status}.`;
    },

    getSubwayLineUptime(lineNumber) {
        const routeStatus = RouteStorage[lineNumber];
        if (!routeStatus) {
            return 'Subway line not found.';
        }

        const { totalTime, totalDelayTime } = routeStatus;

        return `${Math.round((1 - (totalDelayTime / totalTime)) * 100)}%`;
    },
};

export default MtaRouteStatusService;
