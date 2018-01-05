import * as express from 'express';
import * as cors from 'cors';
import * as config from 'config';
import ApiRouter from './ApiRouter';
const app = express();

const env = process.env.NODE_ENV || 'development';

app.use(cors());
app.use('/api', new ApiRouter().getRouter());

if (env === 'production') {
  const frontendFolder = __dirname + '/../../dist_frontend';
  // serve contents of backend/dist_frontend when built
  app.use(express.static(frontendFolder));
  app.all('/*', function(req, res, next) {
    // Just send the index.html for other files
    res.sendFile('index.html', { root: frontendFolder });
  });
} else {
  app.get('/', function (req, res) {
    res.send('This is where the server will serve the frontend app on production!');
  });
}

const port = process.env.PORT || config.get('port');
app.listen(port, function () {
  console.log('Backend listening on port ' + port + '!');
});
