import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem('campaign-ai-auth');
    if (savedAuth === 'true') {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(): void {
    localStorage.setItem('campaign-ai-auth', 'true');
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('campaign-ai-auth');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}