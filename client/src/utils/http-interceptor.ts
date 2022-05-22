import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let config = {};

    if (environment.frontMode === 'start') {
      config = {
        withCredentials: true,
      };
    }

    request = request.clone(config);

    return next.handle(request);
  }
}
