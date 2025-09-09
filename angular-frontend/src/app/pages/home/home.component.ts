import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Campaign {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
}

@Component({
  selector: 'app-home',
  template: `
    <div class="p-8 max-w-[1280px] mx-auto w-full">
      <!-- Welcome Section -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Campaign AI Gen
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Your AI-powered marketing platform for creating campaigns, catalogs, and content instantly
        </p>
      </div>

      <!-- Quick Creation Section -->
      <div class="mb-12">
        <mat-card class="p-8">
          <mat-card-header>
            <mat-card-title class="text-2xl font-semibold text-gray-900">
              Quick Campaign Creation
            </mat-card-title>
            <mat-card-subtitle class="text-gray-600 mt-2">
              Enter a prompt to instantly generate marketing assets
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content class="mt-6">
            <div class="flex gap-4">
              <mat-form-field class="flex-1" appearance="outline">
                <mat-label>Describe your marketing campaign...</mat-label>
                <textarea 
                  matInput 
                  [(ngModel)]="campaignPrompt"
                  placeholder="e.g., Create a summer sale campaign for wireless headphones targeting young professionals"
                  rows="3"
                ></textarea>
              </mat-form-field>
              <div class="flex flex-col gap-2">
                <button 
                  mat-raised-button 
                  color="primary"
                  [disabled]="!campaignPrompt.trim()"
                  (click)="handleStartCampaign()"
                  class="px-8 py-3"
                >
                  <mat-icon>auto_awesome</mat-icon>
                  Generate
                </button>
                <button 
                  mat-stroked-button
                  (click)="router.navigate(['/campaign-generator'])"
                  class="px-8 py-2"
                >
                  Advanced Setup
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Campaigns -->
      <div class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">Recent Campaigns</h2>
          <div class="flex gap-4">
            <mat-form-field appearance="outline" class="w-64">
              <mat-label>Search campaigns...</mat-label>
              <input matInput [(ngModel)]="searchQuery" placeholder="Search...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Filter</mat-label>
              <mat-select [(ngModel)]="filterType">
                <mat-option value="all">All</mat-option>
                <mat-option value="active">Active</mat-option>
                <mat-option value="completed">Completed</mat-option>
                <mat-option value="draft">Draft</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="!isLoading; else loadingTemplate">
          <mat-card 
            *ngFor="let campaign of filteredCampaigns" 
            class="cursor-pointer hover:shadow-lg transition-shadow"
            (click)="openCampaign(campaign)"
          >
            <mat-card-header>
              <mat-card-title>{{ campaign.name }}</mat-card-title>
              <mat-card-subtitle>{{ campaign.status | titlecase }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="text-gray-600">Created {{ campaign.createdAt | date:'short' }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">Open</button>
              <button mat-button>Share</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <ng-template #loadingTemplate>
          <div class="flex justify-center py-12">
            <mat-spinner></mat-spinner>
          </div>
        </ng-template>

        <div *ngIf="filteredCampaigns.length === 0 && !isLoading" class="text-center py-12">
          <mat-icon class="text-6xl text-gray-400 mb-4">folder_open</mat-icon>
          <h3 class="text-xl font-medium text-gray-600 mb-2">No campaigns found</h3>
          <p class="text-gray-500">Create your first campaign to get started!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .p-8 { padding: 2rem; }
    .max-w-[1280px] { max-width: 1280px; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .w-full { width: 100%; }
    .mb-12 { margin-bottom: 3rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-2 { margin-top: 0.5rem; }
    .text-center { text-align: center; }
    .text-4xl { font-size: 2.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-xl { font-size: 1.25rem; }
    .text-6xl { font-size: 4rem; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .text-gray-900 { color: rgb(17 24 39); }
    .text-gray-600 { color: rgb(75 85 99); }
    .text-gray-500 { color: rgb(107 114 128); }
    .text-gray-400 { color: rgb(156 163 175); }
    .max-w-2xl { max-width: 42rem; }
    .flex { display: flex; }
    .flex-1 { flex: 1; }
    .flex-col { flex-direction: column; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-2 { gap: 0.5rem; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .items-center { align-items: center; }
    .px-8 { padding-left: 2rem; padding-right: 2rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .w-64 { width: 16rem; }
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .cursor-pointer { cursor: pointer; }
    .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
    .transition-shadow { transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
  `]
})
export class HomeComponent implements OnInit {
  campaignPrompt = '';
  searchQuery = '';
  filterType = 'all';
  campaigns: Campaign[] = [];
  isLoading = false;

  constructor(
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.isLoading = true;
    // Mock data for now - replace with actual API call
    setTimeout(() => {
      this.campaigns = [
        { id: 1, name: 'Summer Sale Campaign', status: 'active', createdAt: new Date() },
        { id: 2, name: 'Product Launch', status: 'completed', createdAt: new Date() },
        { id: 3, name: 'Holiday Promotion', status: 'draft', createdAt: new Date() }
      ];
      this.isLoading = false;
    }, 1000);
  }

  get filteredCampaigns() {
    return this.campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesFilter = this.filterType === 'all' || campaign.status === this.filterType;
      return matchesSearch && matchesFilter;
    });
  }

  handleStartCampaign() {
    if (this.campaignPrompt.trim()) {
      localStorage.setItem('campaignPrompt', this.campaignPrompt.trim());
      this.router.navigate(['/canvas']);
    }
  }

  openCampaign(campaign: Campaign) {
    this.router.navigate(['/canvas', campaign.id]);
  }
}