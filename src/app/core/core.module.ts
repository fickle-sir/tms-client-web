import { NgModule, Optional, SkipSelf, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule()
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      //providers: [{ provide: APP_INITIALIZER, useFactory: loadAppDataFactory, deps: [StartupService], multi: true }]
    };
  }
}
