import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-6">Welcome to Banku Dashboard</h1>
      <p class="text-lg mb-4">Your personal finance management platform</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-4">Track Your Expenses</h2>
          <p class="mb-4">Monitor your spending habits and identify areas for improvement.</p>
          <a routerLink="/dashboard" class="text-blue-600 hover:text-blue-800">Go to Dashboard →</a>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-4">Manage Your Profile</h2>
          <p class="mb-4">Update your personal information and preferences.</p>
          <a routerLink="/profile" class="text-blue-600 hover:text-blue-800">View Profile →</a>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-4">Settings</h2>
          <p class="mb-4">Customize your dashboard and notification preferences.</p>
          <a routerLink="/settings" class="text-blue-600 hover:text-blue-800">Go to Settings →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 64px);
      background-color: #f3f4f6;
    }
  `]
})
export class HomeComponent {} 