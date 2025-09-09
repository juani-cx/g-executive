import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="sticky top-0 z-50">
      <div class="flex justify-center pt-8 pb-4">
        <div class="glass-elevated border border-glass-border backdrop-blur-xl rounded-3xl px-6 py-3 shadow-lg w-full max-w-[1280px]">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-6">
              <button 
                mat-icon-button
                class="w-6 h-6 glass-surface hover:glass-elevated rounded-lg transition-all duration-200"
                (click)="toggleMainMenu.emit()"
              >
                <mat-icon class="text-glass-text-primary">menu</mat-icon>
              </button>
              
              <div class="flex items-center space-x-2">
                <img 
                  src="/google-logo.png" 
                  alt="Google" 
                  class="h-8 w-auto"
                />
                <div class="w-4 h-4 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.19 12.23C9.96 11.27 9.83 10.1 9.83 8.84C9.83 7.58 9.96 6.41 10.19 5.45C10.41 4.54 10.92 3.51 11.28 3.05L2.45 8.56C2.24 8.69 2.24 8.99 2.45 9.12L11.28 14.63C10.92 14.17 10.41 13.14 10.19 12.23Z" fill="#292645"/>
                  </svg>
                </div>
              </div>
            </div>

            <nav class="flex items-center space-x-9">
              <a routerLink="/" class="text-sm font-medium text-[#141221] hover:text-[rgba(99,102,241,0.9)] transition-colors">
                Dashboard
              </a>
              <a routerLink="/campaign-generator" class="text-sm font-medium text-[#141221] hover:text-[rgba(99,102,241,0.9)] transition-colors">
                Campaigns
              </a>
              <a routerLink="/catalog-generator" class="text-sm font-medium text-[#141221] hover:text-[rgba(99,102,241,0.9)] transition-colors">
                Catalogs
              </a>
            </nav>

            <div class="flex items-center space-x-4">
              <button mat-icon-button>
                <mat-icon>notifications</mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon>account_circle</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .sticky { position: sticky; }
    .top-0 { top: 0; }
    .z-50 { z-index: 50; }
    .flex { display: flex; }
    .justify-center { justify-content: center; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .space-x-6 > * + * { margin-left: 1.5rem; }
    .space-x-4 > * + * { margin-left: 1rem; }
    .space-x-9 > * + * { margin-left: 2.25rem; }
    .space-x-2 > * + * { margin-left: 0.5rem; }
    .pt-8 { padding-top: 2rem; }
    .pb-4 { padding-bottom: 1rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .w-full { width: 100%; }
    .max-w-[1280px] { max-width: 1280px; }
    .rounded-3xl { border-radius: 1.5rem; }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
    .h-8 { height: 2rem; }
    .w-auto { width: auto; }
    .h-4 { height: 1rem; }
    .w-4 { width: 1rem; }
    .w-6 { width: 1.5rem; }
    .h-6 { height: 1.5rem; }
    .text-sm { font-size: 0.875rem; }
    .font-medium { font-weight: 500; }
    .transition-colors { transition-property: color; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .rounded-lg { border-radius: 0.5rem; }
    .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
    .duration-200 { transition-duration: 200ms; }
  `]
})
export class HeaderComponent {
  @Input() title: string = 'Campaign AI';
  @Output() toggleMainMenu = new EventEmitter<void>();
}