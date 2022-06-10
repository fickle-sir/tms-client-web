import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule} from 'ng-zorro-antd/dropdown';
import { NjMenuModule, NjReuseTabModule } from 'ng-jx';
import { DefaultLayoutComponent } from './default.component';

@NgModule({
    imports: [CommonModule, RouterModule, NzIconModule, NzDropDownModule, NzAvatarModule, NjMenuModule, NjReuseTabModule],
    declarations: [DefaultLayoutComponent],
    exports: [DefaultLayoutComponent]
})
export class LayoutModule { }
