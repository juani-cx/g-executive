import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-gray-900">Campaign AI Gen</h1>
            </div>
            <nav class="flex space-x-8">
              <a routerLink="/" class="text-gray-500 hover:text-gray-900">Dashboard</a>
              <a routerLink="/campaigns" class="text-gray-500 hover:text-gray-900">Campaigns</a>
              <a routerLink="/catalogs" class="text-gray-500 hover:text-gray-900">Catalogs</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div class="text-center">
              <mat-icon class="text-6xl text-gray-400 mb-4">auto_awesome</mat-icon>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Angular Migration</h2>
              <p class="text-lg text-gray-600 mb-8">
                Successfully migrated from React to Angular 20! The basic structure is now in place.
              </p>
              <button mat-raised-button color="primary" class="mr-4">
                Create Campaign
              </button>
              <button mat-stroked-button>
                View Catalogs
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .min-h-screen { min-height: 100vh; }
    .bg-gray-50 { background-color: rgb(249 250 251); }
    .bg-white { background-color: rgb(255 255 255); }
    .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
    .border-b { border-bottom-width: 1px; }
    .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-center { align-items: center; }
    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .text-2xl { font-size: 1.5rem; }
    .font-bold { font-weight: 700; }
    .text-gray-900 { color: rgb(17 24 39); }
    .space-x-8 > * + * { margin-left: 2rem; }
    .text-gray-500 { color: rgb(107 114 128); }
    .hover\\:text-gray-900:hover { color: rgb(17 24 39); }
    .sm\\:px-0 { padding-left: 0; padding-right: 0; }
    .border-4 { border-width: 4px; }
    .border-dashed { border-style: dashed; }
    .border-gray-200 { border-color: rgb(229 231 235); }
    .rounded-lg { border-radius: 0.5rem; }
    .h-96 { height: 24rem; }
    .justify-center { justify-content: center; }
    .text-center { text-align: center; }
    .text-6xl { font-size: 4rem; }
    .text-gray-400 { color: rgb(156 163 175); }
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .text-3xl { font-size: 1.875rem; }
    .text-lg { font-size: 1.125rem; }
    .text-gray-600 { color: rgb(75 85 99); }
    .mr-4 { margin-right: 1rem; }
    
    @media (min-width: 640px) {
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .sm\\:px-0 { padding-left: 0; padding-right: 0; }
    }
    
    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
    }
  `]
})
export class AppComponent {
  title = 'Campaign AI Gen - Angular Migration';
}