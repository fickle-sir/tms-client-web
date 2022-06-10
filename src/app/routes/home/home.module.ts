import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@/common/shared.module';
import { IndexComponent } from './index.component';
import { LoginComponent } from './login.component';
import { RegComponent } from './reg.component';
import { EntComponent } from './ent.component';
import { EntRegComponent } from './ent-reg.component';
import { EntInfoComponent } from './ent-info.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: '用户登录', anonymous: true } },
  { path: 'reg', component: RegComponent, data: { title: '用户注册', anonymous: true } },
  { path: 'ent/reg', component: EntRegComponent, data: { title: '企业注册' } }
];

@NgModule({
  imports: [SharedModule, RouterModule.forRoot(routes)],
  declarations: [IndexComponent, LoginComponent, RegComponent, EntComponent, EntRegComponent, EntInfoComponent]
})
export class HomeModule { }
