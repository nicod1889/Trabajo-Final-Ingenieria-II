import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormField, TypeField } from '../../interfaces/components.interface';
import { FormComponent } from '../form/form.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CiudadResponse, CiudadRequest, MarcaResponse, Provincia } from '../../interfaces/model.interfaces';
import { MarcaService } from '../../services/marca.service';
import { markAllAsTouched } from '../../util/formUtils';

@Component({
  selector: 'app-ciudad-form',
  standalone: true,
  imports: [ButtonModule, DialogModule, DropdownModule, FloatLabelModule, InputTextModule, InputNumberModule, CommonModule, ReactiveFormsModule],
  templateUrl: './ciudad-form.component.html',
  styleUrl: './ciudad-form.component.css'
})
export class CiudadFormComponent implements OnInit, OnChanges {
  @ViewChild("form") ciudadForm!: FormComponent;
  @Input() data? : any;
  @Output() onSave = new EventEmitter;
  @Output() onUpdate = new EventEmitter;

  fields: FormField[];

  visible : boolean = false;
  isEditMode : boolean = false;
  form!: FormGroup;
  title? : string;
  @Input() titleOnCreate : string = "Crear registro";
  @Input() titleOnUpdate : string = "Actualizar registro";

  status!: boolean;
  idToUpdated? : number;
  ciudadList: CiudadResponse[] = [];
  dataCiudad?: CiudadRequest;

  provincias: { label: string, value: Provincia }[] = [
    { label: 'Buenos Aires', value: Provincia.BUENOS_AIRES },
    { label: 'CABA', value: Provincia.CABA },
    { label: 'Catamarca', value: Provincia.CATAMARCA },
    { label: 'Chaco', value: Provincia.CHACO },
    { label: 'Chubut', value: Provincia.CHUBUT },
    { label: 'Córdoba', value: Provincia.CORDOBA },
    { label: 'Corrientes', value: Provincia.CORRIENTES },
    { label: 'Entre Ríos', value: Provincia.ENTRE_RIOS },
    { label: 'Formosa', value: Provincia.FORMOSA },
    { label: 'Jujuy', value: Provincia.JUJUY },
    { label: 'La Pampa', value: Provincia.LA_PAMPA },
    { label: 'La Rioja', value: Provincia.LA_RIOJA },
    { label: 'Mendoza', value: Provincia.MENDOZA },
    { label: 'Misiones', value: Provincia.MISIONES },
    { label: 'Neuquén', value: Provincia.NEUQUEN },
    { label: 'Río Negro', value: Provincia.RIO_NEGRO },
    { label: 'Salta', value: Provincia.SALTA },
    { label: 'San Juan', value: Provincia.SAN_JUAN },
    { label: 'San Luis', value: Provincia.SAN_LUIS },
    { label: 'Santa Cruz', value: Provincia.SANTA_CRUZ },
    { label: 'Santa Fe', value: Provincia.SANTA_FE },
    { label: 'Santiago del Estero', value: Provincia.SANTIAGO_DEL_ESTERO },
    { label: 'Tierra del Fuego', value: Provincia.TIERRA_DEL_FUEGO },
    { label: 'Tucumán', value: Provincia.TUCUMAN }
  ];

  constructor (private fb : FormBuilder, private marcaService : MarcaService ){
    this.fields = [
      {
        label: 'Nombre', 
        controlName: 'nombre', 
        type: TypeField.TEXT, 
        placeholder: 'Ingrese el nombre', 
        errorMessage: 'Dato obligatorio.',
        validators: [Validators.required]
      },
      {
        label: 'Provincia',
        controlName: 'provincia',
        type: TypeField.SELECT,
        placeholder: '',
        selectList: this.provincias,
        errorMessage: 'Selecciona una provincia',
        validators: [Validators.required],
        disabledOnCreate: true
      }
    ];
  }

  ngOnInit() {
    this.form = this.fb.group({});
    this.fields?.forEach(f => {
      const control = new FormControl(null, f.validators);
      this.form.addControl(f.controlName, control);
    });
  }

  ngOnChanges(): void {
    if(this.data) {
      this.form.patchValue(this.data);
      this.title = this.titleOnUpdate;
      this.isEditMode = true;
    }else{
      this.title = this.titleOnCreate;
      this.isEditMode = false;
    }
  }

  showForm(){
    this.visible = true;
    this.resetAll();
  }

  showFormEdit(ciudad: CiudadResponse) {
    this.idToUpdated = ciudad.id;
  
    // Verifica la estructura completa del objeto ciudad
    console.log(ciudad);  // Verifica cómo está estructurado 'ciudad'
  
    // Aquí usamos el valor de provincia directamente
    const ciudadData: CiudadRequest = {
      nombre: ciudad.nombre,
      provinciaId: ciudad.provincia,  // La provincia es directamente el valor del enum
    };
  
    this.dataCiudad = ciudadData;
  
    // Actualizamos el formulario con el valor correcto
    this.form.patchValue({
      nombre: ciudad.nombre,
      provincia: ciudad.provincia,  // Aquí asignamos directamente el valor del enum
    });
  
    this.isEditMode = true;
    this.title = this.titleOnUpdate;
    this.visible = true;
  }

  resetAndHideForm(){
    this.resetAll();
    this.visible = false;
  }

  isText(field : TypeField){
    return field === TypeField.TEXT;
  }

  isNumber(field : TypeField){
    return field === TypeField.NUMBER;
  }

  isSelect(field : TypeField){
    return field === TypeField.SELECT;
  }

  saveData(data : any){
    this.onSave.emit(data)
  }

  updateData(data : any){
    this.onUpdate.emit(data)
  }

  sendData(){
    markAllAsTouched(this.form);

    if(this.form.valid){
      (this.isEditMode) ? this.onUpdate.emit({ id: this.idToUpdated!, ciudad: this.form.value }) : this.onSave.emit(this.form.value);
      this.visible = false;
    }
  }

  hasError(nameField : any){
    let field = this.form.get(nameField); 
    return (field?.dirty || field?.touched) && field?.invalid;
  }

  resetAll(){
    this.form.reset();
    this.data = undefined;
    this.isEditMode = false;
    this.title = this.titleOnCreate;
  }
}