import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EntComponent } from './ent.component';
import { AppService } from '../../core/app.service';

@Component({
  selector: 'div.form-box.ent',
  templateUrl: './ent.component.html',
  host: { '[class.ent-info]': 'true' }
})
export class EntInfoComponent extends EntComponent implements OnInit {
  btnText: string = '更新企业信息';
  url: string = 'enterprise/update';

  constructor(
    cdr: ChangeDetectorRef,
    fb: FormBuilder,
    http: HttpClient,
    msgSvc: NzMessageService,
    private router: Router,
    private appSrv: AppService
  ) {
    super(cdr, fb, http, msgSvc);
  }

  onSuccess(success: boolean) {
    if (success) {
      this.appSrv.onUserInfoChange.emit({ entName: this.form.get('Name')!.value });
      this.msgSrv.success('更新成功');
    } else {
      this.msgSrv.success('更新失败');
    }
  }

  ngOnInit() {
    this.http
      .get<any>('enterprise/get')
      .subscribe(data => {
        this.buildForm(data);
        this.cdr.markForCheck();
      });
  }
}
