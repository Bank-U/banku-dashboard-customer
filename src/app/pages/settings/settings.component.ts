import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    TranslatePipe
  ]
})
export class SettingsComponent implements OnInit {
  notificationForm: FormGroup;
  displayForm: FormGroup;
  isLoading = false;
  isDisplayLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      pushNotifications: [true],
      transactionAlerts: [true]
    });
    
    this.displayForm = this.fb.group({
      theme: ['light'],
      currency: ['USD']
    });
  }
  
  ngOnInit(): void {
    // Load saved preferences
    this.loadSettings();
  }
  
  private loadSettings(): void {
    // Simulation of loading preferences
    this.notificationForm.patchValue({
      emailNotifications: true,
      pushNotifications: true,
      transactionAlerts: true
    });
    
    this.displayForm.patchValue({
      theme: 'light',
      currency: 'USD'
    });
  }
  
  onSubmit(): void {
    if (this.notificationForm.valid) {
      this.isLoading = true;
      
      // Simulation of saving
      setTimeout(() => {
        this.isLoading = false;
        // Show success message
      }, 1500);
    }
  }
  
  onDisplaySubmit(): void {
    if (this.displayForm.valid) {
      this.isDisplayLoading = true;
      
      // Simulation of saving
      setTimeout(() => {
        this.isDisplayLoading = false;
        // Show success message
      }, 1500);
    }
  }
  
  confirmDeleteAccount(): void {
    // Implement logic to delete the account
    console.log('Delete account');
  }
  
  logout(): void {
    this.authService.logout();
  }
} 