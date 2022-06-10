import { Injectable, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TitleService {
  prefix: string = '';

  suffix: string = '';

  separator: string = '-';

  default = '';

  constructor(private injector: Injector, private title: Title) { }

  private getByRoute(): string {
    let next = this.injector.get(ActivatedRoute);

    while (next.firstChild) {
      next = next.firstChild;
    }

    const data = (next.snapshot && next.snapshot.data) || {};

    return data.title;
  }

  /** 设置标题 */
  setTitle(title?: string | string[]) {
    if (!title)
      title = this.getByRoute() || this.default;

    if (!title)
      return;

    if (!Array.isArray(title))
      title = [title];

    const segments: string[] = [];
    this.prefix && segments.push(this.prefix);
    title && segments.push(...(title as string[]));
    this.suffix && segments.push(this.suffix);

    this.title.setTitle(segments.join(this.separator));
  }
}
