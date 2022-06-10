import { NgModule } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ICONS } from '@/common/icons';

@NgModule({
  imports: [NzIconModule.forRoot(ICONS)]
})
export class IconsModule { }
