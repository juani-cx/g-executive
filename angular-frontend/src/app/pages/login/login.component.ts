import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen flex">
      <!-- Left side - Login Form -->
      <div class="flex-1 flex items-center justify-center bg-gray-50">
        <div class="max-w-md w-full space-y-8 p-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Welcome to</h2>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mt-2">
              Campaign AI Gen
            </h1>
            <p class="mt-4 text-gray-600">
              Your AI-powered marketing platform for internal business usage
            </p>
          </div>

          <div class="mt-8">
            <button 
              mat-raised-button 
              color="primary"
              class="w-full py-3 text-lg"
              (click)="handleLogin()"
            >
              Sign In
            </button>
            <p class="mt-4 text-sm text-gray-500 text-center">
              Internal access only - No registration required
            </p>
          </div>
        </div>
      </div>

      <!-- Right side - Solid background for future design elements -->
      <div class="flex-1 bg-gradient-to-br from-blue-500 to-purple-600">
        <div class="flex items-center justify-center h-full">
          <div class="text-white text-center">
            <mat-icon class="text-6xl mb-4">auto_awesome</mat-icon>
            <h3 class="text-2xl font-semibold">AI-Powered Marketing</h3>
            <p class="text-lg opacity-90 mt-2">Create campaigns, catalogs, and content instantly</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-h-screen { min-height: 100vh; }
    .flex { display: flex; }
    .flex-1 { flex: 1; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .bg-gray-50 { background-color: rgb(249 250 251); }
    .max-w-md { max-width: 28rem; }
    .w-full { width: 100%; }
    .space-y-8 > * + * { margin-top: 2rem; }
    .p-8 { padding: 2rem; }
    .text-center { text-align: center; }
    .text-3xl { font-size: 1.875rem; }
    .text-4xl { font-size: 2.25rem; }
    .font-bold { font-weight: 700; }
    .text-gray-900 { color: rgb(17 24 39); }
    .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
    .from-blue-500 { --tw-gradient-from: rgb(59 130 246); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 130, 246, 0)); }
    .to-purple-600 { --tw-gradient-to: rgb(147 51 234); }
    .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
    .text-transparent { color: transparent; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-8 { margin-top: 2rem; }
    .text-gray-600 { color: rgb(75 85 99); }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .text-lg { font-size: 1.125rem; }
    .text-sm { font-size: 0.875rem; }
    .text-gray-500 { color: rgb(107 114 128); }
    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
    .h-full { height: 100%; }
    .text-white { color: rgb(255 255 255); }
    .text-6xl { font-size: 4rem; }
    .mb-4 { margin-bottom: 1rem; }
    .text-2xl { font-size: 1.5rem; }
    .font-semibold { font-weight: 600; }
    .opacity-90 { opacity: 0.9; }
  `]
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleLogin() {
    this.authService.login();
    this.router.navigate(['/']);
  }
}