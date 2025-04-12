import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';
import { StateService } from '../../core/services/state.service';
import { TranslateService } from '../../core/services/translate.service';
import { UsersService } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';

interface Language {
  code: string;
  name: string;
  flag: string;
}

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
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    TranslatePipe
  ]
})
export class SettingsComponent implements OnInit {
  notificationForm: FormGroup;
  displayForm: FormGroup;
  isLoading = false;
  isDisplayLoading = false;
  settingsForm: FormGroup;
  languages: Language[] = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private stateService: StateService,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private router: Router,
    private notificationService: NotificationService
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

    this.settingsForm = this.fb.group({
      language: [this.stateService.uiState().language]
    });
  }
  
  ngOnInit(): void {
    // Load saved preferences
    this.loadSettings();

    this.settingsForm.get('language')?.valueChanges.subscribe(lang => {
      this.stateService.updateUiState({ language: lang });
    });
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
  
  async confirmDeleteAccount(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog'
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result === true) {
      try {
        await firstValueFrom(this.usersService.deleteAccount());
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        
        const successMessage = await firstValueFrom(this.translateService.translate('settings.deleteAccount.success'));
        
        this.notificationService.success(successMessage);

      } catch (error) {
        console.error('Error deleting account:', error);
        
        const errorMessage = await firstValueFrom(this.translateService.translate('settings.deleteAccount.error'));
        
        this.notificationService.error(errorMessage);
      }
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
} 