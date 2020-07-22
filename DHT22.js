var sensorLib;
if (process.env.NODE_ENV != 'development') {
    sensorLib = require('node-dht-sensor');
}
var CronJob = require('cron').CronJob;
const Events = require('events');
var eventEmitter = new Events.EventEmitter();

console.log('INITIALISING DHT22 AIR SENSOR');

var job = new CronJob('* * * * *', function () {
    if (process.env.NODE_ENV == 'development') {
        console.log('*** SIMULATED READING *** ');
        eventEmitter.emit('data', {
            "timestamp": new Date(),
            "temperature": (18 + (Math.random() * 10)).toFixed(1),
            "humidity": (30 + (Math.random() * 50)).toFixed(1)
        })
    } else {
        takeReading();
    }
}, null, true, null);
job.start();

function takeReading() {
    try {
        console.log('Taking reading');
        const timestamp = new Date();
        timestamp.setUTCMilliseconds(0); // round down to the nearest second
        sensorLib.read(22, 4, function (err, temperature, humidity) {
            if (err) {
                console.log("Error taking DHT22 reading", err);
            } else {
                eventEmitter.emit('data', {
                    "timestamp": timestamp,
                    "temperature": temperature.toFixed(1),
                    "humidity": humidity.toFixed(1)
                })
            }
        });
    } catch (error) {
        console.log('DHT22 takeReading error');
        console.log(error)
    }
}


module.exports = eventEmitter;