import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = false;
  isPasswordLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }
  
  ngOnInit(): void {
    // Cargar datos del perfil
    this.loadProfileData();
  }
  
  private loadProfileData(): void {
    // Simulación de carga de datos
    this.profileForm.patchValue({
      name: 'Usuario Demo',
      email: 'demo@example.com'
    });
  }
  
  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Simulación de actualización
      setTimeout(() => {
        this.isLoading = false;
        // Mostrar mensaje de éxito
      }, 1500);
    }
  }
  
  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      this.isPasswordLoading = true;
      
      // Simulación de cambio de contraseña
      setTimeout(() => {
        this.isPasswordLoading = false;
        this.passwordForm.reset();
        // Mostrar mensaje de éxito
      }, 1500);
    }
  }
  
  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'passwordMismatch': true };
  }
} 