import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="not-found-container">
      <mat-icon class="large-icon">error_outline</mat-icon>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <button mat-raised-button color="primary" routerLink="/">
        Go Home
      </button>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      padding: 2rem;
    }
    .large-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
      color: #666;
    }
  `]
})
export class NotFoundComponent {}