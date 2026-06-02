import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { cacheInterceptor } from './core/interceptors/cache';
import { provideNgxMask } from 'ngx-mask';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([cacheInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideNgxMask()
  ]
};