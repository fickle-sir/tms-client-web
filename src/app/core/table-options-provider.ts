import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NjTableOptions, NjTableOptionsProvider } from 'ng-jx';

@Injectable()
export class TableOptionsProvider implements NjTableOptionsProvider {
  _cache = {};

  constructor(private http: HttpClient) { }

  get(name: string): Promise<NjTableOptions> {
    let options = this._cache[name];
    if (!options) {
      const promise: any = this.http
        .get('GetModel', { params: { name: name } })
        .toPromise();
      return promise;
    }
    return Promise.resolve(options);
  }
}
