import { CommonModule } from "@angular/common";
import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { AuthService } from "../../auth/auth.service";
import { FormField, TypeField } from "../../interfaces/components.interface";
import { StatusService, ServiceResponse } from "../../interfaces/model.interfaces";
import { markAllAsTouched } from "../../util/formUtils";
import { hasValidRoles } from "../../util/rolesUtil";
import { FormComponent } from "../form/form.component";

@Component({
  selector: 'app-seguimientoFlota-form',
  standalone: true,
  imports: [DialogModule, FloatLabelModule, InputNumberModule, InputTextModule, DropdownModule, ButtonModule, CommonModule, ReactiveFormsModule, MultiSelectModule, CalendarModule],
  templateUrl: './seguimientoFlota-form.component.html'
})
export class SeguimientoFlotaFormComponent implements OnInit, OnChanges {
  @ViewChild("form") servicesForm!: FormComponent;
  @Input() data: any;
  @Input() titleOnCreate: string = 'Crear registro';
  @Input() titleOnUpdate: string = 'Actualizar registro';
  @Output() onSave = new EventEmitter;
  @Output() onUpdate = new EventEmitter; 

  canEdit = hasValidRoles(this.authService.employeeData,["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);

  fields: FormField[];
  camiones: { label: string, value: number }[] = [];
  clientes: { label: string, value: number }[] = [];
  empleados: { label: string, value: number }[] = [];
  ciudades: { label: string, value: number }[] = [];
  cargas: { label: string, value: number }[] = [];
  statusOptions: { label: string, value: StatusService }[] = [
    { label: 'Pendiente', value: StatusService.TO_DO },
    { label: 'En progreso', value: StatusService.IN_PROGRESS },
    { label: 'Finalizado', value: StatusService.FINISHED },
    { label: 'Cancelado', value: StatusService.CANCELLED }
  ];

  form!: FormGroup;
  visible: boolean = false;
  isEditMode: boolean = false;
  title?: string;
  status!: boolean;
  idToUpdated? : number;
  serviceList: ServiceResponse[] = []; 

  constructor(
    private fb: FormBuilder,
    private authService : AuthService
  ){    
    this.fields = [
      {
        label: 'Estado',
        controlName: 'estado',
        type: TypeField.SELECT,
        placeholder: '',
        selectList: this.statusOptions,
        errorMessage: 'Indique un estado',
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Observaciones',
        controlName: 'observaciones',
        type: TypeField.TEXT,
        placeholder: 'Notas adicionales...',
        validators: [],
        disabledOnUpdate: !this.canEdit
      }
    ]
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({});
    this.fields?.forEach(f => {
      const control = new FormControl(null, f.validators);
      this.form.addControl(f.controlName, control);
      if (f.disabledOnCreate) {
        this.form.get(f.controlName)?.disable();
      }
    });
  }

  ngOnChanges(): void {
    if (this.data) {
      this.form.patchValue({
        estado: this.data.estado,
        observaciones: this.data.observaciones
      });

      this.title = this.titleOnUpdate;
      this.isEditMode = true;

      this.form.enable();
      this.fields?.forEach(field => {
        if (field.disabledOnUpdate) {
          this.form.get(field.controlName)?.disable();
        }
      });
    } else {
      this.title = this.titleOnCreate;
      this.isEditMode = false;
    }
  }

  showForm(){
    this.visible = true;
    this.resetAll();
  }

  resetAndHideForm(){
    this.resetAll()
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

  isMultiSelect(field: TypeField){
    return field === TypeField.MULTISELECT;
  }

  isCalendar(field: TypeField){
    return field === TypeField.CALENDAR;
  }

  sendData() {
    markAllAsTouched(this.form);
    if (!this.form.valid) return;

    const formValue = this.form.value;

    const payload = {
      id: this.data.id,
      numOrden: this.data.numOrden,
      fechaSalida: this.data.fechaSalida,
      fechaEstimadaEntrega: this.data.fechaEstimadaEntrega,
      origenId: this.data.origen?.id,
      destinoId: this.data.destino?.id,
      clienteId: this.data.cliente?.id,
      empleadoId: this.data.empleado?.id,
      camionId: this.data.camion?.id,
      cargaId: this.data.carga?.id,
      precio: this.data.precio,
      estado: formValue.estado,
      observaciones: formValue.observaciones
    };

    this.onUpdate.emit(payload);
  }

  hasError(nameField : any){
    let field = this.form.get(nameField); 
    return (field?.dirty || field?.touched) && field?.invalid;
  }

  resetAll(){
    this.initForm();
    this.data = undefined;
    this.isEditMode = false;
    this.title = this.titleOnCreate;
  }
}
