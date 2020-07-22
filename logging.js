const dht22 = require('./DHT22');
const fs = require('fs');
const path = require('path');

const loggingConfig = require('./config.json');

dht22.on('data', (data) => {
    if (!loggingConfig.enabled) return;
    const humidity = `${data.timestamp.toISOString()},${data.humidity}\r\n`;
    const temperature = `${data.timestamp.toISOString()},${data.temperature}\r\n`;

    fs.mkdir(logDirectory(loggingConfig.logname), (err) => {
        fs.appendFile(humidityFilepath(loggingConfig.logname), humidity, (err) => {
            if (err) console.log('Error logging humidity', err);
        })
        fs.appendFile(temperatureFilepath(loggingConfig.logname), temperature, (err) => {
            if (err) console.log('Error logging temperature', err);
        })
    })
})

const dataDirectory = path.join(__dirname, 'data');
function logDirectory(name) {
    return path.join(dataDirectory, name);
}
function humidityFilepath(name) {
    return path.join(logDirectory(name), 'humidity.csv');
}
function temperatureFilepath(name) {
    return path.join(logDirectory(name), 'temperature.csv');
}


module.exports.getLogs = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(dataDirectory, { withFileTypes: true }, (err, results) => {
            if (err) return reject(err);
            return resolve(results.filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name))
        })
    })
}
module.exports.getTemperature = (name) => {
    return new Promise((resolve, reject) => {
        fs.readFile(temperatureFilepath(name), (err, data) => {
            if (err) return reject(err)
            return resolve(csvToPoints(data.toString()));
        })
    })
}
module.exports.getHumidity = (name) => {
    return new Promise((resolve, reject) => {
        fs.readFile(humidityFilepath(name), (err, data) => {
            if (err) return reject(err)
            return resolve(csvToPoints(data.toString()));
        })
    })
}

function csvToPoints(csv) {
    const points = [];
    if (!csv || csv.length == 0) return points;
    const lines = csv.split('\r\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const cells = line.split(',');
        points.push([new Date(cells[0]), +cells[1]])
    }
    return points;
}

module.exports.updateLogName = async (name) => {
    if (!name || name.length == 0 ) return reject('Name required');;
    loggingConfig.logname = name;
    await saveConfig();
}
module.exports.getLogName = () => {
    return loggingConfig.logname;
}
module.exports.setLoggingEnabled = async (enabled) => {
    loggingConfig.enabled = enabled ? true : false;
    await saveConfig();
}
module.exports.getLoggingEnabled = () => {
    return loggingConfig.enabled;
}

function saveConfig() {
    return new Promise((resolve, reject) => {
        fs.writeFile('./config.json', JSON.stringify(loggingConfig, null, 2), (err) => {
            if (err) {
                console.log('Error logname config', err);
                return reject(err);
            }
            console.log('Logging config updated');
            return resolve();
        });
    })
}