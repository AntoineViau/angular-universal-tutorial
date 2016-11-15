import { IS_NODE_TOKEN } from './../is-node.token';
import { IS_BROWSER_TOKEN } from './../is-browser.token';
import { Component, OnInit, Inject } from '@angular/core';

import { ModelService } from '../shared/api.service';

@Component({
  selector: 'home',
  template: `
  Home component
  {{ data | json }}
  <button class="btn btn-primary" (click)="doSomething()">Do Something</button>
  `
})
export class HomeComponent implements OnInit {

  data = {};

  constructor(
    public model: ModelService,
    @Inject(IS_BROWSER_TOKEN) private isBrowser,
    @Inject(IS_NODE_TOKEN) private isNode) { }

  ngOnInit() {
    this.model.get('/data.json').subscribe(data => {
      this.data = data + ' from ' + (this.isBrowser ? 'BROWSER' : '') + (this.isNode ? 'NODE' : '');
    });
  }

  doSomething() {
    alert('and do something !');
  }

}
