import { IS_NODE_TOKEN } from './is-node.token';
import { IS_BROWSER_TOKEN } from './is-browser.token';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/node'; // for AoT we need to manually split universal packages

import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    UniversalModule, // NodeModule, NodeHttpModule, and NodeJsonpModule are included
    FormsModule,

    SharedModule,
    LayoutModule,
    HomeModule,
    AboutModule,

    AppRoutingModule
  ],
  providers: [
    {
      provide: IS_BROWSER_TOKEN,
      useValue: isBrowser 
    },
    {
      provide: IS_NODE_TOKEN, 
      useValue: isNode 
    }
  ]
})
export class MainModule { }
