import { Directive, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export abstract class AbstractFormComponent implements OnInit, OnDestroy {
  protected abstract form: FormGroup;
  protected destroy$ = new Subject<void>();
  
  // Shared flags for forms
  protected isSubmitting = false;
  protected isDisabled = false;
  protected submitted = false;
  
  constructor() {}
  
  ngOnInit(): void {
    this.initFormListeners();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Initializes form listeners
   */
  protected initFormListeners(): void {
    // Default empty implementation
  }
  
  /**
   * Handles form submission
   */
  protected abstract onSubmit(): void;
  
  /**
   * Marks all controls as touched
   */
  protected markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  /**
   * Gets a form control by its name
   */
  protected getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }
  
  /**
   * Checks if a control has a specific error
   */
  protected hasError(controlName: string, errorName: string): boolean {
    const control = this.getControl(controlName);
    return control?.hasError(errorName) && (control?.touched || control?.dirty) || false;
  }
  
  /**
   * Resets the form to its initial state
   */
  protected resetForm(): void {
    this.form.reset();
    this.submitted = false;
  }
  
  /**
   * Disables the form
   */
  protected disableForm(): void {
    this.form.disable();
    this.isDisabled = true;
  }
  
  /**
   * Enables the form
   */
  protected enableForm(): void {
    this.form.enable();
    this.isDisabled = false;
  }
  
  /**
   * Returns an observable that emits when a form control changes
   */
  protected watchControl<T>(controlName: string): Observable<T> {
    const control = this.getControl(controlName);
    if (!control) {
      throw new Error(`Control "${controlName}" not found in the form.`);
    }
    
    return control.valueChanges.pipe(
      takeUntil(this.destroy$)
    );
  }
} 