import { Injectable, OnDestroy } from '@angular/core';

import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AuthenticationResult, AccountInfo, EventType } from "@azure/msal-browser";

import { BehaviorSubject, Observable, Subscription, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  usernameSubject$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private subscriptions: Subscription[] = [];

  constructor(private msalService: MsalService, private msalBroadcastService: MsalBroadcastService) {
    this.subscriptions.push(this.msalService.initialize().subscribe({
      next: () => this.usernameSubject$.next(this.msalService.instance.getActiveAccount()?.username || null),
      error: err => console.error('MsalService initialization failed:', err.message)
    }));

    this.subscriptions.push(this.msalBroadcastService.msalSubject$.subscribe({
      next: (event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS) {
          const authenticationResult = event.payload as AuthenticationResult;
          this.usernameSubject$.next(authenticationResult.account.username);
        }
      },
      error: err => console.error('MsalBroadcastService failed:', err.message)
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
    this.usernameSubject$.next(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }
}
