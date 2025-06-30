import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PageComponent } from '../../components/page/page.component';
import { EmpleadoBasicResponse, StatusService, CamionBasicResponse, ViajeResponse, ViajeRequest, CargaResponse, CiudadResponse } from '../../interfaces/model.interfaces';
import { Column } from '../../interfaces/components.interface';
import { ToastComponent } from '../../components/toast/toast.component';
import { CommonModule } from '@angular/common';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { hasValidRoles } from '../../util/rolesUtil';
import { AuthService } from '../../auth/auth.service';
import { ViajeService } from '../../services/viaje.service';
import { ViajeFormComponent } from '../../components/viaje-form/viaje-form.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CargaService } from '../../services/carga.service';
import { CiudadService } from '../../services/ciudad.service';
import { ViajeDetailComponent } from '../../components/viaje-detail.component';

@Component({
  selector: 'app-viaje',
  standalone: true,
  imports: [ButtonModule, TableModule, PageComponent, ToastComponent, ConfirmDialogComponent, ViajeFormComponent, CommonModule, FormsModule, DropdownModule, ViajeDetailComponent],
  templateUrl: './viaje.component.html',
  styleUrl: './viaje.component.css'
})
export class ViajeComponent implements OnInit {
  @ViewChild('form') form!: ViajeFormComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;
  @ViewChild('detail') detailComponent!: ViajeDetailComponent;

  title: string = "Viajes";
  labelButtonAdd: string = "Registrar nuevo viaje";
  status!: boolean;
  viajeList: ViajeResponse[] = [];
  idToUpdated?: number;
  dataViaje?: ViajeRequest;
  viajeToDelete?: ViajeResponse;

  ciudades: { label: string, value: number }[] = [];
  cargas: { label: string, value: number }[] = [];

  estadoOptions = [
    { label: 'Pendiente', value: StatusService.TO_DO },
    { label: 'En progreso', value: StatusService.IN_PROGRESS },
    { label: 'Finalizado', value: StatusService.FINISHED },
    { label: 'Cancelado', value: StatusService.CANCELLED }
  ];

  filters = {
    origenId: null,
    destinoId: null,
    estado: null,
    cargaId: null
  };

  viajeListOriginal: ViajeResponse[] = [];

  canCreate : boolean = hasValidRoles(this.authService.employeeData,["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canEdit : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO", "ROL_CAMIONERO"]);
  canRemove : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);

  columns: Column[] = [
    {
      header: "N° de orden",
      field: "numOrden",
      sortable: true
    },
    {
      header: "Origen",
      field: "origenNombre",
      sortable: true
    },
    {
      header: "Destino",
      field: "destinoNombre",
      sortable: true
    },
    {
      header: "Estado",
      field: "showedEstado",
      sortable: true
    },
    {
      header: "Camion",
      field: "camionCompound",
      sortable: true
    },
    {
      header: "Camionero",
      field: "empleadoCompound",
      sortable: true
    },
    {
      header: "Cliente",
      field: "nombreCliente",
      sortable: true
    },
    {
      header: "Carga",
      field: "cargaNombre",
      sortable: true
    },
  ]

  buttonConfig: ActionButtonConfig[] = [
    { 
      icon: 'pi pi-eye', 
      tooltip: 'Ver', 
      severity: 'info', 
      action: (data: any) => this.linkService(data) 
    },
    { 
      icon: 'pi pi-pencil', 
      tooltip: 'Modificar viaje', 
      severity: 'success', 
      isDisabled: !this.canEdit,
      action: (data: any) => this.canEdit ? this.openFormEdit(data) : null 
    },
    { 
      icon: 'pi pi-trash', 
      tooltip: 'Eliminar viaje', 
      severity: 'danger', 
      isDisabled: !this.canRemove,
      action: (data: any) => this.canRemove ? this.openConfirmDialog(data) : null
    }
  ];

  constructor(
    private viajeService: ViajeService,
    private authService : AuthService,
    private ciudadService: CiudadService,
    private cargaService: CargaService
  ) {}

  ngOnInit(): void {
    this.loadViaje();
    this.loadCiudades();
    this.loadCargas();
  }

  openForm(){
    this.form.showForm();
  }

  openFormEdit(viaje: any){
    this.idToUpdated = viaje.id;
    this.dataViaje = { ...viaje };
    this.form.showForm();
  }

  openConfirmDialog(viaje: ViajeResponse) {
    const estadosNoEliminables = [StatusService.TO_DO, StatusService.IN_PROGRESS];

    if (estadosNoEliminables.includes(viaje.estado)) {
      this.toast.showErrorCustom("No se puede eliminar el viaje debido a su estado.");
      return;
    }

    this.viajeToDelete = viaje;
    this.dialog.openDialog(viaje.id, `¿Está seguro que desea eliminar el viaje N° ${viaje.numOrden}?`);
  }

  save(viaje: ViajeRequest){
    this.viajeService.create(viaje).subscribe({
      next: (viaje: ViajeResponse) => {
        this.handlePostCreate(viaje);
        this.toast.showSuccessCreate();
      },
      error: (error) => {
        let msg = 'No se ha podido crear el registro.';
        if (error?.error?.message) {
          msg = error.error.message;
        }
        this.toast.showErrorCustom(msg);
      }
    });
  }

  update(viaje: ViajeRequest){
    this.viajeService.update(this.idToUpdated!, viaje).subscribe({
      next: (viaje) => {
        this.handlePostUpdate(viaje);
        this.toast.showSuccessUpdate();
      },
      error: (error) => {
        let msg = 'No se ha podido crear el registro.';
        if (error?.error?.message) {
          msg = error.error.message;
        }
        this.toast.showErrorCustom(msg);
      }
    });
  }

  handlePostCreate(viaje: ViajeResponse) {
    this.loadViaje();
    this.form.resetAndHideForm();
  }

  handlePostUpdate(viaje: ViajeResponse) {
    this.loadViaje();
    const index = this.viajeList.findIndex(item => item.id === viaje.id);
    this.viajeList[index] = this.processViaje(viaje);

    this.form.resetAndHideForm();
    this.idToUpdated = undefined;
    this.dataViaje = undefined;
  }

  deleteViaje() {
    if (!this.viajeToDelete) return;

    this.viajeService.deleteById(this.viajeToDelete.id).subscribe({
      next: () => {
        this.toast.showSuccessDelete();
        this.viajeList = this.viajeList.filter(item => item.id !== this.viajeToDelete?.id);
        this.viajeToDelete = undefined;
      },
      error: () => {
        this.toast.showErrorDelete();
      }
    });
  }

  loadViaje() {
    this.viajeService.getAll().subscribe(response => {
      const processed = response
        .map(e => this.processViaje(e));

      this.viajeListOriginal = processed;
      this.applyFilters();
    });
  }

  loadCiudades() {
    this.ciudadService.getAll().subscribe((ciudades: CiudadResponse[]) => {
      this.ciudades = ciudades.map(c => ({
        label: c.nombre,
        value: c.id
      }));
    });
  }

  loadCargas() {
    this.cargaService.getAll().subscribe((cargas: CargaResponse[]) => {
      this.cargas = cargas.map(c => ({
        label: c.nombre || `Carga #${c.id}`,
        value: c.id
      }));
    });
  }

  private processViaje(viaje: ViajeResponse) {
    const camion = viaje.camion;
    const empleado = viaje.empleado;
    const showedEstado = this.mapStatusToDescription(viaje.estado);
    const nombreCliente = viaje.cliente?.razonSocial || 'Nombre indefinido';

    return {
      ...viaje,
      camionCompound: `${camion.marca || ''} ${camion.modelo || ''} ${camion.patente || ''}`.trim(),
      empleadoCompound: `${empleado.nombre} ${empleado.apellido}`,
      showedEstado,
      nombreCliente,
      fechaSalidaEs: this.formatDate(viaje.fechaSalida),
      fechaEstimadaEntregaEs: this.formatDate(viaje.fechaEstimadaEntrega),
      precioCurrency: viaje.precio ? `$ ${viaje.precio}` : '',
      origenNombre: viaje.origen?.nombre || '',
      destinoNombre: viaje.destino?.nombre || '',
      cargaNombre: viaje.carga?.nombre || ''
    };
  }

  private mapStatusToDescription(estado: StatusService): string {
    const estadoMapping: { [key in StatusService]: string } = {
      [StatusService.TO_DO]: 'Pendiente',
      [StatusService.IN_PROGRESS]: 'En progreso',
      [StatusService.FINISHED]: 'Finalizado',
      [StatusService.CANCELLED]: 'Cancelado'
    };
    return estadoMapping[estado];
  }

  linkService(viaje: ViajeResponse){
    this.detailComponent.show(viaje);
  }

  private formatDate(date : string): string {
    if(date){
      const [year, month, day] = date.split('-');
      return `${day}-${month}-${year}`;
    } else{
      return '';
    }
  }

  applyFilters() {
    this.viajeList = this.viajeListOriginal.filter(viaje => {
      const matchesOrigen = this.filters.origenId ? viaje.origen?.id === this.filters.origenId : true;
      const matchesDestino = this.filters.destinoId ? viaje.destino?.id === this.filters.destinoId : true;
      const matchesEstado = this.filters.estado ? viaje.estado === this.filters.estado : true;
      const matchesCarga = this.filters.cargaId ? viaje.carga?.id === this.filters.cargaId : true;

      return matchesOrigen && matchesDestino && matchesEstado && matchesCarga;
    });
  }

}
