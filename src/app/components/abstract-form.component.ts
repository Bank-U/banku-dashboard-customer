import { Directive, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export abstract class AbstractFormComponent implements OnInit, OnDestroy {
  protected abstract form: FormGroup;
  protected destroy$ = new Subject<void>();
  
  // Flags compartidos para formularios
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
   * Inicializa los listeners del formulario
   */
  protected initFormListeners(): void {
    // Implementación por defecto vacía
  }
  
  /**
   * Maneja el envío del formulario
   */
  protected abstract onSubmit(): void;
  
  /**
   * Marca todos los controles como tocados
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
   * Obtiene un control del formulario por su nombre
   */
  protected getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }
  
  /**
   * Verifica si un control tiene un error específico
   */
  protected hasError(controlName: string, errorName: string): boolean {
    const control = this.getControl(controlName);
    return control?.hasError(errorName) && (control?.touched || control?.dirty) || false;
  }
  
  /**
   * Resetea el formulario a su estado inicial
   */
  protected resetForm(): void {
    this.form.reset();
    this.submitted = false;
  }
  
  /**
   * Deshabilita el formulario
   */
  protected disableForm(): void {
    this.form.disable();
    this.isDisabled = true;
  }
  
  /**
   * Habilita el formulario
   */
  protected enableForm(): void {
    this.form.enable();
    this.isDisabled = false;
  }
  
  /**
   * Retorna un observable que emite cuando un control del formulario cambia
   */
  protected watchControl<T>(controlName: string): Observable<T> {
    const control = this.getControl(controlName);
    if (!control) {
      throw new Error(`Control "${controlName}" no encontrado en el formulario.`);
    }
    
    return control.valueChanges.pipe(
      takeUntil(this.destroy$)
    );
  }
} 