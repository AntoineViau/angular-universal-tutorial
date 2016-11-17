import 'angular2-universal-polyfills';
import { platformBrowser }    from '@angular/platform-browser';
import { BrowserMainModuleNgFactory } from '../aot/src/app/app.browser.module.ngfactory';

platformBrowser().bootstrapModuleFactory(BrowserMainModuleNgFactory);
 