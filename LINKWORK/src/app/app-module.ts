import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CorpoModule } from './modules/corpo/corpo-module';

registerLocaleData(localePt);

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule, CorpoModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  bootstrap: [App],
})
export class AppModule {}
