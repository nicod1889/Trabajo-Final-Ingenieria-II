import { Component, OnInit, ViewChild } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MarcaResponse, CamionRequest, CamionResponse } from '../../interfaces/model.interfaces';
import { Column } from '../../interfaces/components.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../auth/auth.service';
import { hasValidRoles } from '../../util/rolesUtil';
import { CamionService } from '../../services/camion.service';
import { MarcaService } from '../../services/marca.service';
import { CamionFormComponent } from '../../components/camion-form/camion-form.component';

@Component({
  selector: 'app-camion',
  standalone: true,
  imports: [ButtonModule, TableModule, PageComponent, ConfirmDialogComponent, ConfirmDialogModule, ToastComponent, CamionFormComponent, CommonModule],
  templateUrl: './camion.component.html',
  styleUrl: './camion.component.css'
})
export class CamionComponent implements OnInit {
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('form') form!: CamionFormComponent;

  title: string = "Camiones";
  labelButtonAdd: string = "Agregar camión";
  status!: boolean;
  idToUpdated? : number;
  camionList: CamionResponse[] = [];
  marcaList: MarcaResponse[] = [];
  dataCamion?: CamionRequest;

  canCreate : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canView : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canEdit : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canRemove : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"]);

  columns: Column[] = [
    {
      header: "Patente",
      field: "patente",
      sortable: true
    },
    {
      header: "Marca",
      field: "marca.nombre",
      sortable: true
    },
    {
      header: "Modelo",
      field: "modelo",
      sortable: true
    },
    {
      header: "Kilometraje",
      field: "km",
      sortable: true
    },
    {
      header: "Año",
      field: "anio",
      sortable: true
    }
  ];

  buttonConfig: ActionButtonConfig[] = [
    { 
      icon: 'pi pi-eye',
      tooltip: 'Ver registro', 
      severity: 'info',
      isDisabled: !this.canView,
      action: (data: any) => this.canView ? this.openFormView(data) : null
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
    private camionService: CamionService, 
    private marcaService: MarcaService,
    private authService : AuthService
  ) {}

  ngOnInit() {
    this.loadCamions();
    this.loadMarcas();
  }

  loadCamions() {
    this.camionService.getAll().subscribe(response => {
      this.camionList = response.filter(e => !e.deleted);
    });
    
  }

  loadMarcas() {
    this.marcaService.getAll().subscribe(response => {
      this.marcaList = response.filter(e => !e.deleted);
    });
  }

  openForm() {
    this.form.showForm();
  }

  save(camion: CamionRequest) {
    this.camionService.create(camion).subscribe({
      next: (camion: CamionResponse) => {
        this.toast.showSuccessCreate();
        this.handlePostCreate(camion);
      },
      error: (error) => {
        this.toast.showErrorCreate();
        console.error(error);
      }
    });
  }

  openFormEdit(camion: any) {
    this.form.showFormEdit(camion);
  }

  openFormView(camion: any) {
    this.form.showFormView(camion);
  }

  update(event: { id: number, camion: CamionRequest }) {
    this.camionService.update(event.id, event.camion).subscribe({
      next: (camion) => {
        this.toast.showSuccessUpdate();
        this.handlePostUpdate(camion);
      },
      error: (error) => {
        this.toast.showErrorUpdate();
        console.error(error);
      }
    }) 
  }

  handlePostUpdate(camion: CamionResponse) {
    const index = this.camionList.findIndex(item => item.id === camion.id);
    this.camionList[index] = camion;

    this.form.resetAndHideForm();
    this.idToUpdated = undefined;
    this.dataCamion = undefined;
  }

  handlePostCreate(camion : CamionResponse){
    let list = [...this.camionList];
    list.push(camion);
    
    this.camionList = list;

    this.form.resetAndHideForm();
  }

  openConfirmDialog(camion: CamionResponse) {
    this.dialog.openDialog(camion.id);
  }

  deleteCamion(id: number) {
    this.camionService.deleteById(id).subscribe({
      next: () => {
        this.toast.showSuccessDelete();
        this.camionList = this.camionList.filter(item => item.id !== id);
      },
      error: (error) => {
        this.toast.showErrorDelete();
        console.error(error);
      }
    });
  }

  linkCamion(camion: CamionResponse) {
    alert("TODO relacionadas sin implementar");
  }  
}