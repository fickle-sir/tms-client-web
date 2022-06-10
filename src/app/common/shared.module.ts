import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzImageModule } from 'ng-zorro-antd/image';

import { NjMenuModule, NjFormModule, NjReuseTabModule } from 'ng-jx';

const MODULES: any[] = [
  RouterModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  NzModalModule,
  NzInputModule,
  NzButtonModule,
  NzMessageModule,
  NzDropDownModule,
  NzFormModule,
  NzCascaderModule,
  NzImageModule,

  NjMenuModule,
  NjReuseTabModule,
  NjFormModule.WithDefaults()
  // TranslateModule,
];

@NgModule({
  imports: MODULES.concat([]),
  exports: MODULES
})
export class SharedModule { }
