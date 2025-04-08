import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-profile',
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
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-6">Mi Perfil</h1>
      
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-semibold mb-4">Información Personal</h2>
        
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="name" placeholder="Tu nombre">
            <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
              El nombre es obligatorio
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" placeholder="Tu email">
            <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
              El email es obligatorio
            </mat-error>
            <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
              Introduce un email válido
            </mat-error>
          </mat-form-field>
          
          <div class="flex justify-end mt-4">
            <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || isLoading">
              <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
              <span *ngIf="!isLoading">Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Cambiar Contraseña</h2>
        
        <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña Actual</mat-label>
            <input matInput formControlName="currentPassword" type="password" placeholder="Tu contraseña actual">
            <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
              La contraseña actual es obligatoria
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nueva Contraseña</mat-label>
            <input matInput formControlName="newPassword" type="password" placeholder="Tu nueva contraseña">
            <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
              La nueva contraseña es obligatoria
            </mat-error>
            <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
              La contraseña debe tener al menos 6 caracteres
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmar Nueva Contraseña</mat-label>
            <input matInput formControlName="confirmPassword" type="password" placeholder="Confirma tu nueva contraseña">
            <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
              La confirmación de contraseña es obligatoria
            </mat-error>
            <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
              Las contraseñas no coinciden
            </mat-error>
          </mat-form-field>
          
          <div class="flex justify-end mt-4">
            <button mat-raised-button color="primary" type="submit" [disabled]="passwordForm.invalid || isPasswordLoading">
              <mat-spinner diameter="20" *ngIf="isPasswordLoading"></mat-spinner>
              <span *ngIf="!isPasswordLoading">Cambiar Contraseña</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 64px);
      background-color: #f3f4f6;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
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