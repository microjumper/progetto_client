import { Injectable, OnDestroy } from '@angular/core';

import { MsalService } from "@azure/msal-angular";
import { AuthenticationResult, AccountInfo } from "@azure/msal-browser";

import { Observable, Subscription, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(private msalService: MsalService) {
    this.subscriptions.push(this.msalService.initialize().subscribe({
      error: err => console.error('MsalService initialization failed:', err.message)
    }));
  }

  getActiveAccount(): AccountInfo | null {
    return this.msalService.instance.getActiveAccount();
  }

  loginWithMicrosoft(): Observable<AuthenticationResult> {
    return this.msalService.loginPopup().pipe(
      tap(response => {
        this.msalService.instance.setActiveAccount(response.account);
      })
    );
  }

  logout() {
    this.msalService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }
}
