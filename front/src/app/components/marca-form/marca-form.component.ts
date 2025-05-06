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
import { MarcaResponse, MarcaRequest } from '../../interfaces/model.interfaces';
import { MarcaService } from '../../services/marca.service';
import { markAllAsTouched } from '../../util/formUtils';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  imports: [ButtonModule, DialogModule, DropdownModule, FloatLabelModule, InputTextModule, InputNumberModule, CommonModule, ReactiveFormsModule, FormComponent],
  templateUrl: './marca-form.component.html',
  styleUrl: './marca-form.component.css'
})
export class MarcaFormComponent implements OnInit, OnChanges {
  @ViewChild("form") marcaForm!: FormComponent;
  @Input() data? : any;
  @Output() onSave = new EventEmitter;
  @Output() onUpdate = new EventEmitter;

  marcas: { label: string, value: number }[] = [];
  fields: FormField[];

  visible : boolean = false;
  isEditMode : boolean = false;
  form!: FormGroup;
  title? : string;
  @Input() titleOnCreate : string = "Crear registro";
  @Input() titleOnUpdate : string = "Actualizar registro";

  status!: boolean;
  idToUpdated? : number;
  marcaList: MarcaResponse[] = [];
  dataMarca?: MarcaRequest;

  constructor (private fb : FormBuilder, private marcaService : MarcaService ){
    this.fields = [
      {
        label: 'Nombre', 
        controlName: 'nombre', 
        type: TypeField.TEXT, 
        placeholder: 'Ingrese el nombre de la marca', 
        errorMessage: 'Dato obligatorio.',
        validators: [Validators.required]
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

  showFormEdit(marca: any){
    this.idToUpdated = marca.id;
    
    const marcaData: MarcaRequest = {
      nombre: marca.nombre
    };

    this.dataMarca = marcaData;
    this.form.patchValue(this.dataMarca);
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
      (this.isEditMode) ? this.onUpdate.emit({ id: this.idToUpdated!, marca: this.form.value }) : this.onSave.emit(this.form.value);
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