import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { StatusService, ViajeResponse, ViajeRequest, CargaResponse, CiudadResponse } from '../../interfaces/model.interfaces';
import { Column } from '../../interfaces/components.interface';
import { ToastComponent } from '../../components/toast/toast.component';
import { CommonModule } from '@angular/common';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { hasValidRoles } from '../../util/rolesUtil';
import { AuthService } from '../../auth/auth.service';
import { ViajeService } from '../../services/viaje.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CargaService } from '../../services/carga.service';
import { CiudadService } from '../../services/ciudad.service';
import { ViajeDetailComponent } from '../../components/viaje-detail.component';
import { PageCardComponent } from "../../components/card/card.component";
import { SeguimientoFlotaFormComponent } from '../../components/seguimientoFlota-form/seguimientoFlota-form.component';

@Component({
  selector: 'app-viaje',
  standalone: true,
  imports: [ButtonModule, TableModule, ToastComponent, ConfirmDialogComponent, CommonModule, FormsModule, DropdownModule, ViajeDetailComponent, PageCardComponent, SeguimientoFlotaFormComponent],
  templateUrl: './seguimientoFlota.component.html',
})
export class SeguimientoFlotaComponent implements OnInit {
  @ViewChild('form') form!: SeguimientoFlotaFormComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;
  @ViewChild('detail') detailComponent!: ViajeDetailComponent;

  title: string = "Seguimiento de flota";
  labelButtonAdd: string = "Registrar nuevo viaje";
  status!: boolean;
  viajeList: ViajeResponse[] = [];
  idToUpdated?: number;
  dataViaje?: ViajeRequest;

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
    }
  ]

  buttonConfig: ActionButtonConfig[] = [
    { 
      icon: 'pi pi-eye', 
      tooltip: 'Ver elementos relacionados', 
      severity: 'info', 
      action: (data: any) => this.linkService(data) 
    },
    { 
      icon: 'pi pi-pencil', 
      tooltip: 'Editar registro', 
      severity: 'success', 
      isDisabled: !this.canEdit,
      action: (data: any) => this.canEdit ? this.openFormEdit(data) : null 
    },
    { 
      icon: 'pi pi-trash', 
      tooltip: 'Borrar registro', 
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

  openConfirmDialog(viaje: ViajeResponse){
    this.dialog.openDialog(viaje.id);
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
    let list = [...this.viajeList];
    list.push(this.processViaje(viaje));

    this.viajeList = list;

    this.form.resetAndHideForm();
  }

  handlePostUpdate(viaje: ViajeResponse) {
    const index = this.viajeList.findIndex(item => item.id === viaje.id);
    this.viajeList[index] = this.processViaje(viaje);

    this.form.resetAndHideForm();
    this.idToUpdated = undefined;
    this.dataViaje = undefined;
  }

  deleteViaje(id: number) {
    this.viajeService.deleteById(id).subscribe({
      next: () => { 
        this.toast.showSuccessDelete();
        this.viajeList = this.viajeList.filter(item => item.id !== id);
      },
      error: (error) => {
        this.toast.showErrorDelete();
        console.log(error);
      }
    });
  }

  loadViaje() {
    this.viajeService.getAll().subscribe(response => {
      const processed = response
        .filter(e => e.estado !== StatusService.CANCELLED)
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
