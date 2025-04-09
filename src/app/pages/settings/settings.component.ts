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
    // Cargar preferencias guardadas
    this.loadSettings();
  }
  
  private loadSettings(): void {
    // Simulación de carga de preferencias
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
      
      // Simulación de guardado
      setTimeout(() => {
        this.isLoading = false;
        // Mostrar mensaje de éxito
      }, 1500);
    }
  }
  
  onDisplaySubmit(): void {
    if (this.displayForm.valid) {
      this.isDisplayLoading = true;
      
      // Simulación de guardado
      setTimeout(() => {
        this.isDisplayLoading = false;
        // Mostrar mensaje de éxito
      }, 1500);
    }
  }
  
  confirmDeleteAccount(): void {
    // Implementar lógica para eliminar la cuenta
    console.log('Eliminar cuenta');
  }
  
  logout(): void {
    this.authService.logout();
  }
} 