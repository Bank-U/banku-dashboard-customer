import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-delete-account-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  template: `
    <div class="delete-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="warning-icon material-symbols-outlined">error_outline</mat-icon>
          <h2>{{ 'settings.deleteAccount.title' | translate | async }}</h2>
        </div>
      </div>

      <mat-dialog-content>
        <p class="warning-text">{{ 'settings.deleteAccount.warning' | translate | async }}</p>
        <p class="confirmation-text">{{ 'settings.deleteAccount.confirmationText' | translate | async }}</p>
        
        <div class="input-container">
          <mat-form-field appearance="outline">
            <input 
              matInput 
              [formControl]="confirmationInput" 
              placeholder="{{ 'settings.deleteAccount.confirmInput' | translate | async }}"
              autocomplete="off">
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button class="cancel-button" mat-dialog-close>
          {{ 'common.cancel' | translate | async }}
        </button>
        <button 
          mat-flat-button 
          class="confirm-button"
          [disabled]="!isConfirmed"
          (click)="confirmDelete()">
          {{ 'settings.deleteAccount.confirm' | translate | async }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .delete-dialog {
      padding: 0;
      width: 100%;
      max-width: 400px;
      background: white;
      border-radius: 8px;
      overflow: hidden;

      mat-dialog-content {
        padding-top: 0px;
      }
    }

    .dialog-header {
      padding: 24px;
      background: white;
      border-bottom: 1px solid var(--banku-border-light);

      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;

        .warning-icon {
          color: var(--banku-error);
          font-size: 24px;
          width: 24px;
          height: 24px;
        }

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 400;
          color: var(--banku-error);
        }
      }
    }

    mat-dialog-content {
      padding: 24px;
      color: var(--banku-text-primary);
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 0;

      .warning-text {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        color: var(--banku-text-secondary);
      }

      .confirmation-text {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        color: var(--banku-error);
      }

      .input-container {

        mat-form-field {
          width: 100%;

          ::ng-deep {
            .mat-mdc-form-field-flex {
              background-color: white;
            }

            .mat-mdc-text-field-wrapper {
              background-color: white;
              border: 1px solid var(--banku-border);
              border-radius: 4px;
            }

            .mat-mdc-form-field-outline {
              border: none;
            }

            input.mat-mdc-input-element {
              padding-left: 12px;
              font-size: 14px;
            }
          }
        }
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      margin: 0;
      border-top: 1px solid var(--banku-border-light);
      display: flex;
      justify-content: flex-end;
      gap: 12px;

      .cancel-button {
        color: var(--banku-text-secondary);
        background: transparent;
        border: 1px solid var(--banku-border);
        padding: 0 16px;
        height: 36px;
        font-size: 14px;
        font-weight: 400;

        &:hover {
          background: var(--banku-background-light);
        }
      }

      .confirm-button {
        background-color: var(--banku-error);
        color: white;
        padding: 0 16px;
        height: 36px;
        font-size: 14px;
        font-weight: 400;

        &:disabled {
          opacity: 0.7;
        }
      }
    }

    @media (max-width: 600px) {
      .delete-dialog {
        margin: 0;
        border-radius: 0;
      }

      mat-dialog-actions {
        padding: 16px;
        flex-direction: column;
        gap: 8px;

        button {
          width: 100%;
          margin: 0;
        }
      }
    }
  `]
})
export class DeleteAccountDialogComponent {
  confirmationInput = new FormControl('', [
    Validators.required,
    Validators.pattern('DELETE')
  ]);

  constructor(private readonly dialogRef: MatDialogRef<DeleteAccountDialogComponent>) {}

  get isConfirmed(): boolean {
    return this.confirmationInput.value?.toUpperCase() === 'DELETE';
  }

  confirmDelete(): void {
    if (this.isConfirmed) {
      this.dialogRef.close(true);
    }
  }
} 