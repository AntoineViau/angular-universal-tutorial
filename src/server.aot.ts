import { MainModule } from './app/app.node.module';
import 'angular2-universal-polyfills';

// Fix Universal Style
import { NodeDomRootRenderer, NodeDomRenderer } from 'angular2-universal/node';
function renderComponentFix(componentProto: any) {
  return new NodeDomRenderer(this, componentProto, this._animationDriver);
}
NodeDomRootRenderer.prototype.renderComponent = renderComponentFix;
// End Fix Universal Style

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';

// App
import { NodeMainModuleNgFactory as MainModule } from '../aot/src/app/app.node.module.ngfactory';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

app.engine('.html', createEngine({
  precompile: false,
  ngModule: MainModule,
}));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: 30 }));
app.use(express.static(path.join(ROOT, 'dist/client'), { index: false }));

// Our API for demos only
app.get('/data.json', (req, res) => {
  return res.end('Some data from the API, timestamp ' + (new Date()).getTime());
});

// Rendu Angular
function ngApp(req, res) {
  res.render('index', {
    req,
    res,
    preboot: false,
    baseUrl: '/',
    requestUrl: req.originalUrl,
    originUrl: 'http://localhost:3000'
  });
}
// Routes with html5pushstate
// ensure routes match client-side-app
app.get('/', ngApp);
app.get('/about', ngApp);
app.get('/about/*', ngApp);
app.get('/home', ngApp);
app.get('/home/*', ngApp);

// Gestion de la 404
app.get('*', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var pojo = { status: 404, message: 'No Content' };
  var json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Lancement du serveur
let server = app.listen(app.get('port'), () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
