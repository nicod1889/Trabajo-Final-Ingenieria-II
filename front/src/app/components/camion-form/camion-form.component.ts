import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormField, TypeField } from '../../interfaces/components.interface';
import { noWhitespaceValidator, camionPatenteValidator } from '../../util/customValidators';
import { FormComponent } from '../form/form.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CamionResponse, CamionRequest, MarcaResponse } from '../../interfaces/model.interfaces';
import { MarcaService } from '../../services/marca.service';
import { markAllAsTouched } from '../../util/formUtils';

@Component({
  selector: 'app-camion-form',
  standalone: true,
  imports: [ButtonModule, DialogModule, DropdownModule, FloatLabelModule, InputTextModule, InputNumberModule, CommonModule, ReactiveFormsModule],
  templateUrl: './camion-form.component.html',
  styleUrl: './camion-form.component.css'
})
export class CamionFormComponent implements OnInit, OnChanges {
  @ViewChild("form") camionForm!: FormComponent;
  @Input() data? : any;
  @Output() onSave = new EventEmitter;
  @Output() onUpdate = new EventEmitter;

  marcas: { label: string, value: number }[] = [];
  fields: FormField[];

  visible : boolean = false;
  isEditMode : boolean = false;
  isViewMode : boolean = false;
  form!: FormGroup;
  title? : string;
  @Input() titleOnCreate : string = "Crear camión";
  @Input() titleOnUpdate : string = "Actualizar camión";
  @Input() titleOnView : string = "Ver camión";

  status!: boolean;
  idToUpdated? : number;
  camionList: CamionResponse[] = [];
  dataCamion?: CamionRequest;

  constructor (private fb : FormBuilder, private marcaService : MarcaService ){
    this.fields = [
      {
        label: 'Patente', 
        controlName: 'patente', 
        type: TypeField.TEXT, 
        placeholder: 'Ingrese la patente', 
        errorMessage: 'Dato obligatorio. Formatos válidos: AAA111 / AA111BB',
        validators: [Validators.required, camionPatenteValidator]
      },
      {
        label: 'Marca', 
        controlName: 'marcaId', 
        type: TypeField.SELECT, 
        placeholder: '', 
        errorMessage: 'Seleccione una marca',
        selectList: this.marcas,
        validators: [Validators.required],
      },
      {
        label: 'Modelo', 
        controlName: 'modelo', 
        type: TypeField.TEXT, 
        placeholder: 'Ingrese el modelo', 
        errorMessage: 'Dato obligatorio. Máximo 50 caracteres.',
        validators: [Validators.required, Validators.maxLength(50), noWhitespaceValidator]
      },
      {
        label: 'Kilometraje', 
        controlName: 'km', 
        type: TypeField.NUMBER, 
        placeholder: 'Ingrese el kilometraje', 
        errorMessage: 'Dato obligatorio. No puede ser negativo.',
        validators: [Validators.required, Validators.min(0), Validators.max(999999)]
      },
      {
        label: 'Año', 
        controlName: 'anio', 
        type: TypeField.NUMBER, 
        placeholder: 'Ingrese el año', 
        errorMessage: 'Dato obligatorio. No puede ser negativo.',
        validators: [Validators.required, Validators.min(0), Validators.max(999999)]
      },
      {
        label: 'N° de Chasis', 
        controlName: 'numeroChasis', 
        type: TypeField.TEXT, 
        placeholder: 'Ingrese el número de chasis', 
        errorMessage: 'Dato obligatorio. Máximo 50 caracteres.',
        validators: [Validators.required, Validators.maxLength(50), noWhitespaceValidator]
      },
      {
        label: 'N° de Motor', 
        controlName: 'numeroMotor', 
        type: TypeField.TEXT, 
        placeholder: 'Ingrese el número de motor', 
        errorMessage: 'Dato obligatorio. Máximo 50 caracteres.',
        validators: [Validators.required, Validators.maxLength(50), noWhitespaceValidator]
      },
      {
        label: 'Observaciones', 
        controlName: 'observaciones', 
        type: TypeField.TEXT, 
        placeholder: 'Ingrese las observaciones', 
        errorMessage: 'Máximo 300 caracteres.',
        validators: [Validators.maxLength(300)]
      }
    ];
  }

  ngOnInit() {
    this.form = this.fb.group({});
    this.fields?.forEach(f => {
      const control = new FormControl(null, f.validators);
      this.form.addControl(f.controlName, control);
    });

    this.marcaService.getAll().subscribe((marcas: MarcaResponse[]) => {
      this.marcas = marcas
        .map(marca => ({
          label: marca.nombre,
          value: marca.id
      }));
      this.fields.find(field => field.controlName === 'marcaId')!.selectList = this.marcas;
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

  showFormEdit(camion: any){
    console.log('Camión recibido en openFormEdit:', camion);
    this.idToUpdated = camion.id;
    
    const camionData: CamionRequest = {
      patente: camion.patente,
      marcaId: camion.marca.id,
      modelo: camion.modelo,
      km: camion.km,
      anio: camion.anio,
      numeroChasis: camion.numeroChasis,
      numeroMotor: camion.numeroMotor,
      observaciones: camion.observaciones
    };

    this.dataCamion = camionData;
    this.form.patchValue(this.dataCamion);
    this.isEditMode = true;
    this.title = this.titleOnUpdate;
    this.visible = true;    
  }

  showFormView(camion: any){
    this.idToUpdated = camion.id;
    
    const camionData: CamionRequest = {
      patente: camion.patente,
      marcaId: camion.marca.id,
      modelo: camion.modelo,
      km: camion.km,
      anio: camion.anio,
      numeroChasis: camion.numeroChasis,
      numeroMotor: camion.numeroMotor,
      observaciones: camion.observaciones
    };

    this.dataCamion = camionData;
    this.form.patchValue(this.dataCamion);
    this.isViewMode = false;
    this.title = this.titleOnView;
    this.visible = true;    

    Object.keys(this.form.controls).forEach(controlName => {
      this.form.controls[controlName].disable();
    });
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
      (this.isEditMode) ? this.onUpdate.emit({ id: this.idToUpdated!, camion: this.form.value }) : this.onSave.emit(this.form.value);
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