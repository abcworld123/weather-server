import http from 'http';
import compression from 'compression';
import express from 'express';
import router from 'routes';
import runScheduleJobs from 'schedules';

const app = express();
const server = http.createServer(app);

runScheduleJobs();

app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', router);

app.use((req, res, next) => {
  console.warn(`\x1B[33m404\x1B[0m | ${req.url}`);
  res.status(404).send('404');
});

app.use((err, req, res, next) => {
  console.error(`\x1B[31m500\x1B[0m | ${req.url}`);
  if (app.settings.env === 'production') {
    console.error(err);
    res.status(500).send('500');
  } else {
    next(err.stack);
  }
});

server.on('error', (err) => {
  console.error(`\x1B[31mERROR\x1B[0m | ${err.stack}`);
});

server.listen(8400, () => {
  console.info('\x1B[36mconnected!!\x1B[0m');
});
