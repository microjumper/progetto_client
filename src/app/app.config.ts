import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, provideHttpClient } from "@angular/common/http";

import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, InteractionType } from "@azure/msal-browser";
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalGuard, MsalGuardConfiguration,
  MsalInterceptor,
  MsalService
} from "@azure/msal-angular";

import { routes } from './app.routes';
import { environment } from "../environments/environment";
import { ConfirmationService, MessageService } from "primeng/api";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      useValue: {
        interactionType: 'popup'
      },
      multi: true
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    MessageService,
    ConfirmationService
  ]
};

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      redirectUri: '/',
      postLogoutRedirectUri: '/'
    },
    cache: {
      cacheLocation : BrowserCacheLocation.LocalStorage
    }
  });
}
function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: [ 'User.Read' ]
    },
    loginFailedRoute: '/'
  };
}

