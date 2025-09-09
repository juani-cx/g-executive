import { Component } from '@angular/core';

@Component({
  selector: 'app-canvas',
  template: `
    <div class="canvas-container">
      <h2>Canvas Workspace</h2>
      <p>Canvas functionality will be implemented here</p>
    </div>
  `,
  styles: [`
    .canvas-container {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class CanvasComponent {}