import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DocumentType } from '../../interfaces/model.interfaces';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormField, TypeField } from '../../interfaces/components.interface';
import { FormComponent } from '../form/form.component';
import { emailCustomValidator, noWhitespaceValidator, nroDniCuitValidator } from '../../util/customValidators';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [ButtonModule, DialogModule, DropdownModule, FloatLabelModule, InputTextModule, CommonModule,  ReactiveFormsModule, FormComponent],
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent {
  @ViewChild("form") clienteForm!: FormComponent;
  @Input() data? : any;
  @Output() onSave = new EventEmitter;
  @Output() onUpdate = new EventEmitter;

  documentTypes: { label: string, value: string }[];
  fields: FormField[];

  constructor (
    private fb : FormBuilder
  ){
    this.documentTypes = Object.values(DocumentType).map(type => ({
      label: type,
      value: type
    }));

    this.fields = [
      {
        label: 'Seleccione un tipo de documento',
        controlName: 'category',
        type: TypeField.SELECT,
        placeholder: '',
        errorMessage: 'Seleccione un tipo de documento.',
        selectList: this.documentTypes,
        validators: [Validators.required]
      },
      {
        label: 'Número de documento', 
        controlName: 'identificationNumber',
        type: TypeField.NUMBER,
        placeholder: 'Ingrese su número de documento',
        errorMessage: 'Debe ingresar 8 digitos para DNI y 11 si es CUIT.',
        validators: [Validators.required, nroDniCuitValidator]
      },
      {
        label: 'Email',
        controlName: 'email',
        type: TypeField.TEXT,
        placeholder: 'Ingrese su email',
        errorMessage: 'El mail es inválido.',
        validators: [Validators.required, emailCustomValidator]
      },
      { 
        label: 'Nombre empresa',
        controlName: 'businessName',
        type: TypeField.TEXT,
        placeholder: 'Ingrese el nombre de la empresa',
        errorMessage: 'Máximo 255 caracteres. No se permiten espacios en blanco',
        validators: [Validators.maxLength(255), noWhitespaceValidator]
      }
    ];
  }

  saveData(data : any){
    this.onSave.emit(data)
  }

  updateData(data : any){
    this.onUpdate.emit(data)
  }

  showForm(){
    this.clienteForm.form.reset();
    this.clienteForm.visible = true;
  }

  resetAndHideForm(){
    this.clienteForm.resetAll();
    this.clienteForm.visible = false;
  }
}
