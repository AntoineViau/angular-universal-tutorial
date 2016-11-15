import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';

@Injectable()
export class ModelService {

  constructor(public _http: Http) { }

  get(url: string, options?: any) {
    return this._http.get(url, options)
      .map(res => res.text()) //res.json())
      .catch(err => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }
}
