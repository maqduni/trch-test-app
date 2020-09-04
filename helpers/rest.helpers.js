/**
 * Borrowed from http://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express
 */
let http = require("http"),
    https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 */
exports.getJSON = function(options)
{
    // console.log('rest::getJSON');
    let reqHandler = +options.port === 443 ? https : http;

    return new Promise((resolve, reject) => {
        let req = reqHandler.request(options, (res) =>
        {
            let output = '';
            // console.log('rest::', options.host + ':' + res.statusCode);
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                output += chunk;
            });

            res.on('end', () => {
                try {
                    let obj = JSON.parse(output);
                    // console.log('rest::', obj);
                    resolve({
                        statusCode: res.statusCode,
                        data: obj
                    });
                }
                catch(err) {
                    console.error('rest::end', err);
                    reject(err);
                }
            });
        });

        req.on('error', (err) => {
            console.error('rest::request', err);
            reject(err);
        });

        req.end();
    });
};
