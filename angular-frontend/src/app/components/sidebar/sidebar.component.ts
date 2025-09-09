import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside [class]="sidebarClasses" *ngIf="isOpen">
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">Navigation</h2>
        <nav>
          <ul class="space-y-2">
            <li>
              <a routerLink="/" class="flex items-center space-x-3 text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100">
                <mat-icon>home</mat-icon>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a routerLink="/campaign-generator" class="flex items-center space-x-3 text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100">
                <mat-icon>campaign</mat-icon>
                <span>Campaigns</span>
              </a>
            </li>
            <li>
              <a routerLink="/catalog-generator" class="flex items-center space-x-3 text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-100">
                <mat-icon>inventory</mat-icon>
                <span>Catalogs</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 256px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      height: 100%;
    }
    .sidebar-closed {
      width: 0;
      overflow: hidden;
    }
    .p-6 { padding: 1.5rem; }
    .text-lg { font-size: 1.125rem; }
    .font-semibold { font-weight: 600; }
    .mb-4 { margin-bottom: 1rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .space-x-3 > * + * { margin-left: 0.75rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .text-gray-700 { color: rgb(55 65 81); }
    .hover\\:text-blue-600:hover { color: rgb(37 99 235); }
    .hover\\:bg-gray-100:hover { background-color: rgb(243 244 246); }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;

  get sidebarClasses() {
    return this.isOpen ? 'sidebar' : 'sidebar-closed';
  }
}