import { Component, OnInit, ViewChild } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TipoCargaResponse, CargaRequest, CargaResponse } from '../../interfaces/model.interfaces';
import { Column } from '../../interfaces/components.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../auth/auth.service';
import { hasValidRoles } from '../../util/rolesUtil';
import { TipoCargaService } from '../../services/tipoCarga.service';
import { CargaService } from '../../services/carga.service';
import { CargaFormComponent } from '../../components/carga-form/carga-form.component';

@Component({
  selector: 'app-carga',
  standalone: true,
  imports: [ButtonModule, TableModule, PageComponent, ConfirmDialogComponent, ConfirmDialogModule, ToastComponent, CargaFormComponent, CommonModule],
  templateUrl: './carga.component.html',
  styleUrl: './carga.component.css'
})
export class CargaComponent implements OnInit {
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('form') form!: CargaFormComponent;

  title: string = "Cargas";
  labelButtonAdd: string = "Agregar carga";
  status!: boolean;
  idToUpdated? : number;
  cargaList: CargaResponse[] = [];
  tipoCargaList: TipoCargaResponse[] = [];
  dataCarga?: CargaRequest;

  canCreate : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canView : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canEdit : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canRemove : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"]);

  columns: Column[] = [
    {
      header: "Nombre",
      field: "nombre",
      sortable: true
    },
    {
      header: "Tipo de carga",
      field: "tipoCarga.nombre",
      sortable: true
    }
  ];

  buttonConfig: ActionButtonConfig[] = [
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
    private cargaService: CargaService, 
    private tipoCargaService: TipoCargaService,
    private authService : AuthService
  ) {}

  ngOnInit() {
    this.loadCargas();
    this.loadTipoCargas();
  }

  loadCargas() {
    this.cargaService.getAll().subscribe(response => {
      this.cargaList = response.filter(e => !e.deleted);
    });
  }

  loadTipoCargas() {
    this.tipoCargaService.getAll().subscribe(response => {
      this.tipoCargaList = response.filter(e => !e.isDeleted);
    });
  }

  openForm() {
    this.form.showForm();
  }

  save(carga: CargaRequest) {
    this.cargaService.create(carga).subscribe({
      next: (carga: CargaResponse) => {
        this.toast.showSuccessCreate();
        this.handlePostCreate(carga);
      },
      error: (error) => {
        this.toast.showErrorCreate();
        console.error(error);
      }
    });
  }

  openFormEdit(carga: any) {
    this.form.showFormEdit(carga);
  }

  update(event: { id: number, carga: CargaRequest }) {
    this.cargaService.update(event.id, event.carga).subscribe({
      next: (carga) => {
        this.toast.showSuccessUpdate();
        this.handlePostUpdate(carga);
      },
      error: (error) => {
        this.toast.showErrorUpdate();
        console.error(error);
      }
    }) 
  }

  handlePostUpdate(carga: CargaResponse) {
    const index = this.cargaList.findIndex(item => item.id === carga.id);
    this.cargaList[index] = carga;

    this.form.resetAndHideForm();
    this.idToUpdated = undefined;
    this.dataCarga = undefined;
  }

  handlePostCreate(carga : CargaResponse){
    let list = [...this.cargaList];
    list.push(carga);
    
    this.cargaList = list;

    this.form.resetAndHideForm();
  }

  openConfirmDialog(carga: CargaResponse) {
    this.dialog.openDialog(carga.id);
  }

  deleteCarga(id: number) {
    this.cargaService.deleteById(id).subscribe({
      next: () => {
        this.toast.showSuccessDelete();
        this.cargaList = this.cargaList.filter(item => item.id !== id);
      },
      error: (error) => {
        this.toast.showErrorDelete();
        console.error(error);
      }
    });
  }

  linkCarga(carga: CargaResponse) {
    alert("TODO relacionadas sin implementar");
  }  
}