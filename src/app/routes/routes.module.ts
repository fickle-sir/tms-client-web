import { NgModule } from '@angular/core';
import { SharedModule } from '@/common/shared.module';
import { LayoutModule } from '@/layout/layout.module';
import { RouteRoutingModule } from './routes-routing.module';
import { HomeModule } from './home/home.module';
import { WaybillModule } from './wb/waybill.module';
import { InitializerComponent } from './initializer.component';

@NgModule({
  declarations: [InitializerComponent],
  imports: [SharedModule, LayoutModule, HomeModule, RouteRoutingModule, WaybillModule.forRoot()]
})
export class RoutesModule { }
