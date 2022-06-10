import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'div.form-box.ent',
  templateUrl: './ent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  loadDistrict: any;
  btnText: string = '立即注册';
  url: string = 'enterprise/reg';

  constructor(
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    public http: HttpClient,
    public msgSrv: NzMessageService,
  ) {
    this.loadDistrict = (node: any, index: number): Promise<any> => {
      let resolve: any;
      const promise = new Promise<any>(r => resolve = r);

      this.http
        .get<any[]>(`district/getchildren?pid=${node.value || 0}`)
        .subscribe(list => {
          node.children = list.map(
            item => ({
              value: item['ID'],
              label: item['Name'],
              isLeaf: item['IsLeaf']
            })
          );
          resolve();
        });

      return promise;
    }
  }

  submit() {
    this.loading = true;
    this.http
      .post<any>(this.url, this.form.value)
      .subscribe(
        data => {
          this.loading = false;
          this.onSuccess(data);
        },
        (err: HttpError) => {
          this.loading = false;
          this.cdr.markForCheck();
          if (err.state)
            this.setErrors(err.state);
          // else if (err.msg)
          //   this.msgSrv.error(err.msg)
          // else
          //   this.msgSrv.error('注册失败');
        }
      );
  }

  buildForm(data?: any) {
    data = data || {};
    this.form = this.fb.group({
      ID: [data['ID']],
      Name: [data['Name']],
      Contact: [data['Contact']],
      Tel: [data['Tel']],
      CascadeAddr: [data['CascadeAddr']],
      AssociateAddr: [data['AssociateAddr']]
    });
  }

  onSuccess(_data: any) { }

  setErrors(errors: any) {
    const { form } = this;
    for (var name in form.controls) {
      const error = errors[name];
      const control = form.controls[name];

      if (error) {
        control.markAsDirty();
        control.setErrors({ error: error });
      } else if (control.dirty) {
        control.setErrors(null);
      }
    }
    //this.cdr.markForCheck();
  }

  ngOnInit() {
    this.buildForm();
  }
}
