import { IS_NODE_TOKEN } from './is-node.token';
import { IS_BROWSER_TOKEN } from './is-browser.token';

import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app',
  template: `
  <br /><br /><br />
  <h1>isBrowser = {{isBrowser}}, isNode = {{isNode}}</h1>
  <navbar></navbar>
  <content></content>
  <blabla></blabla>
  `
})
export class AppComponent { 
  constructor(
    @Inject(IS_BROWSER_TOKEN) public isBrowser: boolean, 
    @Inject(IS_NODE_TOKEN) public isNode: boolean) { }
}
