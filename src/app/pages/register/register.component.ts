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
import { RegisterRequest } from '../../core/models/auth/register-request';
import { AbstractFormComponent } from '../../components/abstract-form.component';
import { NotificationService } from '../../core/services/notification.service';
import { finalize } from 'rxjs/operators';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslateService } from '../../core/services/translate.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
export class RegisterComponent extends AbstractFormComponent implements OnInit {
  form: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly translateService: TranslateService
  ) {
    super();
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  protected override onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting = true;
      this.disableForm();
      
      const registerRequest: RegisterRequest = {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value
      };
      
      this.authService.register(registerRequest)
        .pipe(finalize(() => {
          this.isSubmitting = false;
          this.enableForm();
        }))
        .subscribe({
          next: () => {
            firstValueFrom(this.translateService.translate('register.registrationSuccess')).then((message: string) => {
              this.notificationService.success(message);
              this.router.navigate(['/dashboard']);
            });
          },
          error: (error) => {
            if (error.error?.message) {
              this.notificationService.error(error.error.message);
            } else {
              firstValueFrom(this.translateService.translate('register.registrationError')).then((message: string) => {
                this.notificationService.error(message);
              });
            }
          }
        });
    } else {
      this.markFormGroupTouched(this.form);
      
      if (this.form.hasError('passwordMismatch')) {
        firstValueFrom(this.translateService.translate('register.passwordMismatch')).then((message: string) => {
          this.notificationService.warning(message);
        });
      } else {
        firstValueFrom(this.translateService.translate('common.formError')).then((message: string) => {
          this.notificationService.warning(message);
        });
      }
    }
  }
} 