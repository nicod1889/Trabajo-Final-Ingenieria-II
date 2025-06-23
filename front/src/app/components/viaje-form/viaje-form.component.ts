import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { FormField, TypeField } from '../../interfaces/components.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CamionService } from '../../services/camion.service';
import { ClienteService } from '../../services/cliente.service';
import { EmpleadoService } from '../../services/empleado.service';
import { ClienteResponse, EmpleadoResponse, ServiceResponse, SparePartResponse, StatusService, CamionResponse, CargaResponse, CiudadResponse } from '../../interfaces/model.interfaces';
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
import { CargaService } from '../../services/carga.service';
import { CiudadService } from '../../services/ciudad.service';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-viaje-form',
  standalone: true,
  imports: [DialogModule, FloatLabelModule, InputNumberModule, InputTextModule, DropdownModule, ButtonModule, CommonModule, ReactiveFormsModule, MultiSelectModule, CalendarModule],
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
    private camionService: CamionService,
    private clienteService: ClienteService, 
    private empleadoService: EmpleadoService,
    private ciudadService: CiudadService,
    private cargaService: CargaService,
    private authService : AuthService
  ){    
    this.fields = [
      {
        label: 'Número de Orden',
        controlName: 'numOrden',
        type: TypeField.NUMBER,
        isCurrency: false,
        errorMessage: 'Ingrese un número de orden',
        validators: [Validators.required, Validators.min(1)],
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
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Fecha de salida',
        controlName: 'fechaSalida',
        type: TypeField.CALENDAR,
        errorMessage: 'Seleccione una fecha',
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Fecha estimada de entrega',
        controlName: 'fechaEstimadaEntrega',
        type: TypeField.CALENDAR,
        errorMessage: 'Seleccione una fecha',
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
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
        label: 'Camionero',
        controlName: 'empleadoId',
        type: TypeField.SELECT,
        placeholder: '',
        selectList: this.empleados,
        errorMessage: 'Seleccione un camionero',
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Cliente',
        controlName: 'clienteId',
        type: TypeField.SELECT,
        placeholder: '',
        errorMessage: 'Seleccione un cliente',
        selectList: this.clientes,
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Carga',
        controlName: 'cargaId',
        type: TypeField.SELECT,
        placeholder: '',
        errorMessage: 'Seleccione una carga',
        selectList: this.cargas,
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Ciudad Origen',
        controlName: 'origenId',
        type: TypeField.SELECT,
        placeholder: '',
        errorMessage: 'Seleccione una ciudad de origen',
        selectList: this.ciudades,
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Ciudad Destino',
        controlName: 'destinoId',
        type: TypeField.SELECT,
        placeholder: '',
        errorMessage: 'Seleccione una ciudad de destino',
        selectList: this.ciudades,
        validators: [Validators.required],
        disabledOnUpdate: !this.canEdit
      },
      {
        label: 'Precio',
        controlName: 'precio',
        type: TypeField.NUMBER,
        isCurrency: true,
        errorMessage: 'Ingrese un precio',
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
    
    this.getCamiones();
    this.getClientes();
    this.getCamioneros();
    this.getCiudades();
    this.getCargas();
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
    console.log('Datos recibidos en edición:', this.data);
    
    if(this.data){
      const [y1, m1, d1] = this.data.fechaSalida.split('-').map(Number);
      const [y2, m2, d2] = this.data.fechaEstimadaEntrega.split('-').map(Number);

      const service = {
        ...this.data,
        clienteId: this.data.cliente.id,
        camionId: this.data.camion.id,
        empleadoId: this.data.empleado?.id,
        origenId: this.data.origen?.id,
        destinoId: this.data.destino?.id,
        cargaId: this.data.carga?.id,
        numOrden: this.data.numOrden,
        observaciones: this.data.observaciones,
        fechaSalida: new Date(y1, m1 - 1, d1),
        fechaEstimadaEntrega: new Date(y2, m2 - 1, d2)
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
    return cliente.razonSocial ?? 'Nombre indefinido';
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
    (this.isEditMode) ? this.onUpdate.emit(this.form.value) : this.onSave.emit(this.form.value);
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
      this.fields.find(field => field.controlName === 'clienteId')!.selectList = this.clientes;
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

  getCiudades() {
    this.ciudadService.getAll().subscribe((ciudades: CiudadResponse[]) => {
      this.ciudades = ciudades.map(c => ({
        label: c.nombre,
        value: c.id
      }));
      this.fields.find(f => f.controlName === 'origenId')!.selectList = this.ciudades;
      this.fields.find(f => f.controlName === 'destinoId')!.selectList = this.ciudades;
    });
  }

  getCargas() {
    this.cargaService.getAll().subscribe((cargas: CargaResponse[]) => {
      this.cargas = cargas.map(c => ({
        label: c.nombre || `Carga #${c.id}`,
        value: c.id
      }));
      this.fields.find(f => f.controlName === 'cargaId')!.selectList = this.cargas;
    });
  }
}
