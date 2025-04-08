import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth/login-request';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <header class="login-header">
        <div class="header-content">
          <mat-icon class="header-icon">account_balance</mat-icon>
          <h1 class="header-title">{{ 'login.title' | translate | async }}</h1>
        </div>
      </header>
      
      <main class="login-main">
        <div class="login-card-container">
          <p class="login-subtitle">{{ 'login.subtitle' | translate | async }}</p>
          
          <mat-card class="login-card">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'login.email' | translate | async }}</mat-label>
                <input matInput type="email" formControlName="email" placeholder="tu@email.com" required>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  {{ 'login.emailRequired' | translate | async }}
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                  {{ 'login.emailInvalid' | translate | async }}
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ 'login.password' | translate | async }}</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  {{ 'login.passwordRequired' | translate | async }}
                </mat-error>
              </mat-form-field>

              <div class="form-options">
                <mat-checkbox color="primary">{{ 'login.rememberMe' | translate | async }}</mat-checkbox>
                <a href="#" class="forgot-password">{{ 'login.forgotPassword' | translate | async }}</a>
              </div>

              <button mat-raised-button color="primary" class="login-button" type="submit" [disabled]="loginForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">{{ 'login.loginButton' | translate | async }}</span>
              </button>
            </form>
          </mat-card>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
    }
    
    .login-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    }
    
    .login-header {
      width: 100%;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header-icon {
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
      margin-right: 1rem;
      color: white;
    }
    
    .header-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      margin: 0;
    }
    
    .login-main {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
    
    .login-card-container {
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    
    .login-subtitle {
      color: white;
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
    
    .login-card {
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      padding: 2rem;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .forgot-password {
      color: var(--primary-color);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }
    
    .forgot-password:hover {
      color: var(--accent-color);
    }
    
    .login-button {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .login-button:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    @media (max-width: 640px) {
      .login-header {
        padding: 0.75rem 1rem;
      }
      
      .header-icon {
        font-size: 1.5rem;
        height: 1.5rem;
        width: 1.5rem;
      }
      
      .header-title {
        font-size: 1.25rem;
      }
      
      .login-main {
        padding: 1rem;
      }
      
      .login-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const loginRequest: LoginRequest = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      
      this.authService.login(loginRequest).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          this.snackBar.open(
            'Error de autenticación. Por favor, verifica tus credenciales.',
            'Cerrar',
            { duration: 5000, panelClass: ['error-snackbar'] }
          );
        }
      });
    }
  }
} 