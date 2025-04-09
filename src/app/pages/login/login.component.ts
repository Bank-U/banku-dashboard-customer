import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../core/models/auth/login-request';
import { AbstractFormComponent } from '../../components/abstract-form.component';
import { NotificationService } from '../../core/services/notification.service';
import { finalize } from 'rxjs/operators';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    RouterModule
  ]
})
export class LoginComponent extends AbstractFormComponent implements OnInit {
  form: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    super();
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  protected override onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting = true;
      this.disableForm();
      
      const loginRequest: LoginRequest = {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value
      };
      
      this.authService.login(loginRequest)
        .pipe(finalize(() => {
          this.isSubmitting = false;
          this.enableForm();
        }))
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.notificationService.error(
              error.error?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.'
            );
          }
        });
    } else {
      this.markFormGroupTouched(this.form);
      this.notificationService.warning('Por favor, completa todos los campos correctamente.');
    }
  }
} 