import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Enter your name">
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Enter your password">
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Confirm Password</mat-label>
              <input matInput formControlName="confirmPassword" type="password" placeholder="Confirm your password">
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">Confirm password is required</mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">Passwords do not match</mat-error>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">Register</span>
              </button>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    mat-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }
    mat-card-header {
      justify-content: center;
      margin-bottom: 20px;
    }
    mat-card-title {
      font-size: 24px;
    }
    form {
      display: flex;
      flex-direction: column;
    }
    mat-form-field {
      margin-bottom: 16px;
    }
    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    button {
      width: 100%;
    }
    mat-card-actions {
      display: flex;
      justify-content: center;
      padding: 16px;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'passwordMismatch': true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        localStorage.setItem('token', 'fake-jwt-token');
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }, 1500);
    }
  }
} 