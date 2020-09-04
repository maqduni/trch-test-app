import express from 'express';
import MtaRouteStatusService from '../services/mta-route-status.service';

const controller = express.Router();

controller.get('/details/:lineNumber', (req, res, next) => {
    const { lineNumber } = req.params;
    const details = MtaRouteStatusService.getSubwayLineDetails(lineNumber);

    res.json(details);
});

controller.get('/status/:lineNumber', (req, res, next) => {
    const { lineNumber } = req.params;
    const status = MtaRouteStatusService.getSubwayLineStatus(lineNumber);

    res.json(status);
});

controller.get('/uptime/:lineNumber', (req, res, next) => {
    const { lineNumber } = req.params;
    const uptime = MtaRouteStatusService.getSubwayLineUptime(lineNumber);

    res.json(uptime);
});

export default {
    controller,
    prefix: '/api/subway-lines'
};
