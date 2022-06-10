import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../environments/environment';

const StatuMessages = {
  0: '无法访问服务器',
  400: '系统错误，请稍后重试',
  401: '无权访问',
  //403: '用户得到授权，但是访问是被禁止的。', // 用户得到授权，但是访问是被禁止的。
  404: '请求的内容丢失了~~',
  //406: '请求的格式不可得。',
  //410: '请求的资源被永久删除，且不会再得到的。',
  //422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器出错了，请稍后重试',
  //502: '网关错误。',
  //503: '服务不可用，服务器暂时过载或维护。',
  504: '系统繁忙，请稍后重试',
};

declare global {
  interface HttpError<T = any> {
    status?: number,
    code?: string,
    msg?: string,
    state?: Record<string, any>
    result?: T
  }
}

interface UnifiedResult {
  code?: string;
  msg?: string,
  state?: Record<string, any>
  result?: any
}

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url;
    if (url.startsWith('https://') && url.startsWith('http://'))
      return next.handle(req);

    // with server
    url = environment.SERVER_URL + url;
    req = req.clone({ url });

    // filter empty values.
    if (req.body && !(req.body instanceof FormData)) {
      const body = {};
      for (var key in req.body) {
        const value = req.body[key];
        if (value != null && typeof value !== 'undefined')
          body[key] = value;
      }
      req = req.clone({ body });
    }

    return next
      .handle(req)
      .pipe(map(rsp => {
        if (rsp instanceof HttpResponse) {
          const { code, result } = rsp.body as UnifiedResult;

          if (code != "OK")
            throw rsp;

          return rsp.clone({ body: result });
        }
        return rsp;
      }))
      .pipe(catchError(rsp => {
        let error: HttpError;
        if (rsp instanceof HttpResponse) {
          const { status } = rsp;
          let { code, msg, state, result } = rsp.body as UnifiedResult;
          msg && this.injector.get(NzMessageService).error(msg);
          error = { status, code, msg, state, result };
        } else if (rsp instanceof HttpErrorResponse) {
          const data: UnifiedResult = rsp.error || {};
          const { status } = rsp;
          let { code, msg, state, result } = data;
          msg = msg || StatuMessages[rsp.status] || rsp.statusText;
          msg && this.injector.get(NzMessageService).error(msg);
          error = { status, code, msg, state, result };
        } else if (rsp instanceof Error) {
          const { message: msg } = rsp;
          msg && this.injector.get(NzMessageService).error(msg);
          error = { status: -1, msg };
        } else {
          const msg = rsp;
          msg && this.injector.get(NzMessageService).error(rsp);
          error = { status: -1, msg };
        }
        return throwError(error);
      }));
  }
}
