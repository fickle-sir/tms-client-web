import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { DefaultLayoutComponent } from '../layout/default.component';
import { InitializerComponent } from './initializer.component';
import { IndexComponent } from './home/index.component';
import { EntInfoComponent } from './home/ent-info.component';
import { EntIdGuard } from '../core/entId.guard';
import { NjJwtGuard } from 'ng-jx/auth/jwt';
import { WaybillBatchComponent } from './wb/waybill-batch/waybill-batch.component';

const routes: Routes = [
  {
    path: '**',
    canActivate: [NjJwtGuard],
    component: InitializerComponent
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [EntIdGuard, NjJwtGuard],
    canActivateChild: [NjJwtGuard],
    children: [
      { path: '', component: IndexComponent, data: { title: '首页', reuse: true } },
      { path: 'ent/info', component: EntInfoComponent, data: { title: '企业信息', reuse: true } },
      { path: 'waybill_batch', component: WaybillBatchComponent, data: { title: '批量运单', reuse: true } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash, scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
