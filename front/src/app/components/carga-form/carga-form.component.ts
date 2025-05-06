import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormField, TypeField } from '../../interfaces/components.interface';
import { noWhitespaceValidator } from '../../util/customValidators';
import { FormComponent } from '../form/form.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CargaResponse, CargaRequest, TipoCargaResponse } from '../../interfaces/model.interfaces';
import { TipoCargaService } from '../../services/tipoCarga.service';
import { markAllAsTouched } from '../../util/formUtils';

@Component({
  selector: 'app-carga-form',
  standalone: true,
  imports: [ButtonModule, DialogModule, DropdownModule, FloatLabelModule, InputTextModule, InputNumberModule, CommonModule, ReactiveFormsModule],
  templateUrl: './carga-form.component.html',
  styleUrl: './carga-form.component.css'
})
export class CargaFormComponent implements OnInit, OnChanges {
  @ViewChild("form") cargaForm!: FormComponent;
  @Input() data? : any;
  @Output() onSave = new EventEmitter;
  @Output() onUpdate = new EventEmitter;

  tipoCargas: { label: string, value: number }[] = [];
  fields: FormField[];

  visible : boolean = false;
  isEditMode : boolean = false;
  form!: FormGroup;
  title? : string;
  @Input() titleOnCreate : string = "Crear carga";
  @Input() titleOnUpdate : string = "Actualizar carga";
  status!: boolean;
  idToUpdated? : number;
  cargaList: CargaResponse[] = [];
  dataCarga?: CargaRequest;

  constructor (private fb : FormBuilder, private tipoCargaService : TipoCargaService ){
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
        label: 'Tipo de carga', 
        controlName: 'tipoCargaId', 
        type: TypeField.SELECT, 
        placeholder: '', 
        errorMessage: 'Seleccione un tipo de carga',
        selectList: this.tipoCargas,
        validators: [Validators.required],
      }
    ];
  }

  ngOnInit() {
    this.form = this.fb.group({});
    this.fields?.forEach(f => {
      const control = new FormControl(null, f.validators);
      this.form.addControl(f.controlName, control);
    });

    this.tipoCargaService.getAll().subscribe((tipoCargas: TipoCargaResponse[]) => {
      this.tipoCargas = tipoCargas
        .map(tipoCarga => ({
          label: tipoCarga.nombre,
          value: tipoCarga.id
      }));
      this.fields.find(field => field.controlName === 'tipoCargaId')!.selectList = this.tipoCargas;
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

  showFormEdit(carga: any){
    console.log('Camión recibido en openFormEdit:', carga);
    this.idToUpdated = carga.id;
    
    const cargaData: CargaRequest = {
      nombre: carga.nombre,
      tipoCargaId: carga.tipoCarga.id,
    };

    this.dataCarga = cargaData;
    this.form.patchValue(this.dataCarga);
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
      (this.isEditMode) ? this.onUpdate.emit({ id: this.idToUpdated!, carga: this.form.value }) : this.onSave.emit(this.form.value);
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