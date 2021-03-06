import 'angular2-universal-polyfills';
import { enableProdMode } from '@angular/core';
import { platformUniversalDynamic } from 'angular2-universal';
import { BrowserMainModule } from './app/app.browser.module';

enableProdMode();

const platformRef = platformUniversalDynamic();
document.addEventListener('DOMContentLoaded', () => {
    platformRef.bootstrapModule(BrowserMainModule);
});

    