import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient } from "@angular/common/http";

import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation } from "@azure/msal-browser";
import { MSAL_INSTANCE, MsalBroadcastService, MsalGuard, MsalService } from "@azure/msal-angular";

import { routes } from './app.routes';
import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ]
};

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      redirectUri: "/",
      postLogoutRedirectUri: '/'
    },
    cache: {
      cacheLocation : BrowserCacheLocation.LocalStorage
    }
  });
}
