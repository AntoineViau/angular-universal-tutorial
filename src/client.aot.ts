import 'angular2-universal-polyfills';
import { enableProdMode } from '@angular/core';
import { platformUniversalDynamic } from 'angular2-universal';
import { BrowserMainModuleNgFactory } from '../aot/src/app/app.browser.module.ngfactory';

enableProdMode();

const platformRef = platformUniversalDynamic();
document.addEventListener('DOMContentLoaded', () => {
    platformRef.bootstrapModuleFactory(BrowserMainModuleNgFactory);
});

