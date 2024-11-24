const { Command } = require('commander');
const express = require('express');
const noteRoute = require('./route/noteRoute');
const path = require('path');

const app = express();
const program = new Command();

program
    .requiredOption('-h, --host <type>', 'адреса сервера')
    .requiredOption('-p, --port <number>', 'порт сервера')
    .requiredOption('-c, --cache <path>', 'шлях до директорії, де будуть закешовані файли');

program.configureOutput({
    writeErr: (str) => {
        console.error("Йосип босий! То ти шось пропустив '-h (--host), -p (--port), -c (--cache <path>)'");
        process.exit(1);
    }
});

program.parse(process.argv);

const options = program.opts();
const host = options.host;
const port = options.port;
const cachePath = options.cache;

// Middleware для передачі cachePath
app.use((req, res, next) => {
    req.cachePath = cachePath; 
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use('/notes', noteRoute);

// Запуск сервера
app.listen(port, host, () => {
    console.log(`Сервер стартанув: http://${host}:${port}/`);
});
