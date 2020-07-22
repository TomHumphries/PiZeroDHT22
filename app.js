const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))

const loggingService = require('./logging');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res, next) => {
    const logs = await loggingService.getLogs();
    const name = loggingService.getLogName();
    const enabled = loggingService.getLoggingEnabled();
    res.render('index', {logs, name, enabled});
})

app.get('/logs/:name', async (req, res, next) => {
    const name = req.params.name;
    const humidity = await loggingService.getHumidity(name);
    const temperature = await loggingService.getTemperature(name);
    const humidityFormatted = [];
    humidity.forEach(reading => {
        humidityFormatted.push({x: reading[0].valueOf(), y: reading[1]})
    });
    const temperatureFormatted = [];
    temperature.forEach(reading => {
        temperatureFormatted.push({x: reading[0].valueOf(), y: reading[1]})
    });
    res.render('chart', {
        title: name,
        humidity: humidityFormatted, 
        temperature: temperatureFormatted
    })

})


app.post('/settings', async (req, res, next) => {
    try {
        const name = req.body.name;
        const enabled = req.body.loggingenabled;
        await loggingService.updateLogName(name);
        await loggingService.setLoggingEnabled(enabled);
        console.log('complete')
        return res.redirect('/');
    } catch (error) {
        next(error);
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})