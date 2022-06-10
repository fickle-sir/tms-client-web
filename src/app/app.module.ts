import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import zh from '@angular/common/locales/zh';

import { NjReuseStrategy, NJ_TABLE_OPTIONS_PROVIDER, NJ_FORM_OPTIONS_PROVIDER } from 'ng-jx';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { ICONS } from './common/icons';

import { TableOptionsProvider, AppInterceptor } from './core';
import { SharedModule } from './common/shared.module';
import { RoutesModule } from './routes/routes.module';
import { AppComponent } from './app.component';
import { NjJwtInterceptor } from 'ng-jx/auth/jwt';
import { FormsModule } from '@angular/forms';

registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    RoutesModule,
    FormsModule,
    NzIconModule.forRoot(ICONS)
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    // { provide: NZ_ICONS, useValue: ICONS },
    { provide: RouteReuseStrategy, useClass: NjReuseStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NjJwtInterceptor, multi: true },
    // { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: [NjTableRoutableComponent], multi: true },
    { provide: NJ_FORM_OPTIONS_PROVIDER, useClass: TableOptionsProvider },
    { provide: NJ_TABLE_OPTIONS_PROVIDER, useClass: TableOptionsProvider },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
