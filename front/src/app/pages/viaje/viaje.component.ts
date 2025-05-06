import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PageComponent } from '../../components/page/page.component';
import { EmpleadoBasicResponse, StatusService, CamionBasicResponse, ViajeResponse, ViajeRequest } from '../../interfaces/model.interfaces';
import { Column } from '../../interfaces/components.interface';
import { ToastComponent } from '../../components/toast/toast.component';
import { CommonModule } from '@angular/common';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { hasValidRoles } from '../../util/rolesUtil';
import { AuthService } from '../../auth/auth.service';
import { ViajeService } from '../../services/viaje.service';
import { ViajeFormComponent } from '../../components/viaje-form/viaje-form.component';

@Component({
  selector: 'app-viaje',
  standalone: true,
  imports: [ButtonModule, TableModule, PageComponent, ToastComponent, ConfirmDialogComponent, ViajeFormComponent, CommonModule],
  templateUrl: './viaje.component.html',
  styleUrl: './viaje.component.css'
})
export class ViajeComponent implements OnInit {
  @ViewChild('form') form!: ViajeFormComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;

  title: string = "Viajes";
  labelButtonAdd: string = "Agregar viaje";
  status!: boolean;
  viajeList: ViajeResponse[] = [];
  idToUpdated?: number;
  dataViaje?: ViajeRequest;

  canCreate : boolean = hasValidRoles(this.authService.employeeData,["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canEdit : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO", "ROL_CAMIONERO"]);
  canRemove : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);

  columns: Column[] = [
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
      header: "Estado",
      field: "showedEstado",
      sortable: true
    },
    {
      header: "Inicio",
      field: "fechaSalidaEs",
      sortable: true
    },
    {
      header: "Fin",
      field: "fechaEstimadaEntregaEs",
      sortable: true
    },
    {
      header: "Precio",
      field: "precioCurrency",
      sortable: true
    },
    {
      header: "Cliente",
      field: "nombreCliente",
      sortable: true
    },
  ]

  buttonConfig: ActionButtonConfig[] = [
    { 
      icon: 'pi pi-link', 
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
    private authService : AuthService
  ) {}


  ngOnInit(): void {
    this.loadViaje();
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
        this.toast.showErrorCreate();
        console.error(error);
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
        this.toast.showErrorUpdate();
        console.error(error);
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
      this.viajeList = response
        .filter(e => e.estado !== StatusService.CANCELLED)
        .map(e => {
          return this.processViaje(e);
        });
    })
  }

  private processViaje(viaje: ViajeResponse) {
    const camion: CamionBasicResponse = viaje.camion;
    const camionCompound: string = `${camion.marca || ''} ${camion.modelo || ''} ${camion.patente || ''}`.trim();

    const empleado: EmpleadoBasicResponse = viaje.empleado;
    const empleadoCompound = empleado.nombre + ' ' + empleado.apellido;
    console.log(empleado);
    console.log(empleadoCompound);

    const showedEstado: string = this.mapStatusToDescription(viaje.estado);

    const nombreCliente: string = viaje.cliente.businessName 
      ? viaje.cliente.businessName 
      : `${viaje.cliente.nombre} ${viaje.cliente.apellido}`;

    viaje = {
      ...viaje,
      camionCompound,
      empleadoCompound,
      showedEstado,
      nombreCliente,
      fechaSalidaEs: this.formatDate(viaje.fechaSalida),
      fechaEstimadaEntregaEs: this.formatDate(viaje.fechaEstimadaEntrega),
      precioCurrency: (viaje.precio) ? `$ ${viaje.precio}` : '' 
    }

    return viaje;
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
    alert("TODO relacionadas sin implementar");
  }

  private formatDate(date : string): string {
    if(date){
      const [year, month, day] = date.split('-');
      return `${day}-${month}-${year}`;
    } else{
      return '';
    }
  }

}
