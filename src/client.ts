import 'angular2-universal-polyfills';
import { enableProdMode } from '@angular/core';
import { platformUniversalDynamic } from 'angular2-universal';

enableProdMode();

import { BrowserMainModule } from './app/app.browser.module';

const platformRef = platformUniversalDynamic();
document.addEventListener('DOMContentLoaded', () => {
    platformRef.bootstrapModule(BrowserMainModule);
});

