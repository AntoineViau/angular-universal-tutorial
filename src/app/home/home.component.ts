import { IS_NODE_TOKEN } from './../is-node.token';
import { IS_BROWSER_TOKEN } from './../is-browser.token';
import { APP_ID } from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';

import { ModelService } from '../shared/api.service';

@Component({
  selector: 'home',
  template: `
  <h1>Home component</h1>
  <div>
    APP_ID = {{appId}}
  </div>
  <div>
    {{ data | json }}
  </div>
  <button class="btn btn-primary" (click)="doSomething()">Do Something</button>
  `
})
export class HomeComponent implements OnInit {

  
  public data = {};

  constructor(
    public model: ModelService,
    @Inject(IS_BROWSER_TOKEN) public isBrowser: boolean,
    @Inject(IS_NODE_TOKEN) public isNode: boolean,
     @Inject(APP_ID) public appId: string 
    ) { }

  ngOnInit() {
    this.model.get('/data.json').subscribe(data => {
      this.data = data + ' from ' + (this.isBrowser ? 'BROWSER' : '') + (this.isNode ? 'NODE' : '');
    });
  }

  doSomething() {
    alert('and do something !');
  }

}
