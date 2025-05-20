import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { FormField, TypeField } from '../../interfaces/components.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CamionService } from '../../services/camion.service';
import { ClienteService } from '../../services/cliente.service';
import { EmpleadoService } from '../../services/empleado.service';
import { ClienteResponse, EmpleadoBasicResponse, EmpleadoResponse, ServiceResponse, SparePartResponse, StatusService, CamionResponse } from '../../interfaces/model.interfaces';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { hasValidRoles } from '../../util/rolesUtil';
import { AuthService } from '../../auth/auth.service';
import { markAllAsTouched } from '../../util/formUtils';

@Component({
  selector: 'app-viaje-form',
  standalone: true,
  imports: [FormComponent, DialogModule, FloatLabelModule, InputNumberModule, InputTextModule, DropdownModule, ButtonModule, CommonModule, ReactiveFormsModule, MultiSelectModule],
  templateUrl: './viaje-form.component.html',
  styleUrl: './viaje-form.component.css'
})
export class ViajeFormComponent implements OnInit, OnChanges {
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
    private camionService: CamionService,
    private clienteService: ClienteService, 
    private empleadoService: EmpleadoService,
    private authService : AuthService
  ){    
    this.fields = [
      {
        label: 'Camión',
        controlName: 'camionId',
        type: TypeField.SELECT,
        placeholder: '',
        errorMessage: 'Seleccione un camión',
        selectList: this.camiones,
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Cliente',
        controlName: 'clientId',
        type: TypeField.SELECT,
        placeholder: '',
        errorMessage: 'Seleccione un cliente',
        selectList: this.clientes,
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Empleado',
        controlName: 'empleadoId',
        type: TypeField.SELECT,
        placeholder: '',
        selectList: this.empleados,
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Estado',
        controlName: 'estado',
        type: TypeField.SELECT,
        placeholder: '',
        selectList: this.statusOptions,
        errorMessage: 'Indique un estado',
        validators: [Validators.required],
        disabledOnCreate: true
      },
      {
        label: 'Precio',
        controlName: 'precio',
        type: TypeField.NUMBER,
        placeholder: '$0.00',
        disabledOnUpdate: !this.canEdit
      }
    ]
  }

  ngOnInit(): void {
    this.initForm();
    
    this.getCamiones();
    this.getClientes();
    this.getCamioneros();
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
    if(this.data){
      const sparePartsIds = this.data.spareParts?.map((sparePart: SparePartResponse) => sparePart.id);

      const service = {
        ...this.data,
        clienteId: this.data.cliente.id,
        camionId: this.data.camion.id,
      };

      this.form.patchValue(service);
      this.title = this.titleOnUpdate;
      this.isEditMode = true;

      this.form.enable();
      this.fields?.forEach(field => {
        if (field.disabledOnUpdate) {
          this.form.get(field.controlName)?.disable();
        }
      });
    } else{
      this.title = this.titleOnCreate;
      this.isEditMode = false;
    }
  }

  getNombreCliente(cliente: ClienteResponse): string {
    return cliente.businessName ?? 'Nombre indefinido';
  }

  getNombreEmpleado(empleado: EmpleadoResponse): string {
    return (empleado.nombre + ' ' + empleado.apellido);
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

  sendData(){
    markAllAsTouched(this.form);

    if(this.form.valid){
      (this.isEditMode) ? this.onUpdate.emit(this.form.value) : this.onSave.emit(this.form.value);
    }
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

  getCamioneros() {
    this.empleadoService.getAll().subscribe((empleados: EmpleadoResponse[]) => {
      this.empleados = empleados
        .filter(empleado => !empleado.deleted && empleado.rol as string == "ROL_CAMIONERO")
        .map(empleado => ({
          label: (empleado.nombre + ' ' + empleado.apellido),
          value: empleado.id
        }));
      this.fields.find(field => field.controlName === 'empleadoId')!.selectList = this.empleados;
    });
  }

  getClientes() {
    this.clienteService.getAll().subscribe((clientes: ClienteResponse[]) => {
      this.clientes = clientes
        .filter(cliente => !cliente.deleted)
        .map(cliente => ({
          label: this.getNombreCliente(cliente),
          value: cliente.id
        }));
      this.fields.find(field => field.controlName === 'clientId')!.selectList = this.clientes;
    });
  }

  getCamiones() {
    this.camionService.getAll().subscribe((camiones: CamionResponse[]) => {
      this.camiones = camiones
        .filter(camion => !camion.deleted)
        .map(camion => ({
          label: `${camion.marca.nombre || ''} ${camion.modelo || ''} - ${camion.patente || ''}`,
          value: camion.id
        }));
      this.fields.find(field => field.controlName === 'camionId')!.selectList = this.camiones;
    });
  }
}
