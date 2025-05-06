import { Component, OnInit, ViewChild } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MarcaResponse, TipoCargaRequest, TipoCargaResponse } from '../../interfaces/model.interfaces';
import { Column } from '../../interfaces/components.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../auth/auth.service';
import { hasValidRoles } from '../../util/rolesUtil';
import { MarcaService } from '../../services/marca.service';
import { TipoCargaService } from '../../services/tipoCarga.service';
import { TipoCargaFormComponent } from '../../components/tipoCarga-form/tipoCarga-form.component';

@Component({
  selector: 'app-tipoCarga',
  standalone: true,
  imports: [ButtonModule, TableModule, PageComponent, ConfirmDialogComponent, ConfirmDialogModule, ToastComponent, TipoCargaFormComponent, CommonModule],
  templateUrl: './tipoCarga.component.html',
  styleUrl: './tipoCarga.component.css'
})
export class TipoCargaComponent implements OnInit {
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('form') form!: TipoCargaFormComponent;

  title: string = "Tipo de cargas";
  labelButtonAdd: string = "Agregar tipo de carga";
  status!: boolean;
  idToUpdated? : number;
  tipoCargaList: TipoCargaResponse[] = [];
  marcaList: MarcaResponse[] = [];
  dataTipoCarga?: TipoCargaRequest;

  canCreate : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canEdit : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canRemove : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"]);

  columns: Column[] = [
    {
      header: "Nombre",
      field: "nombre",
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
    private tipoCargaService: TipoCargaService, 
    private marcaService: MarcaService,
    private authService : AuthService
  ) {}

  ngOnInit() {
    this.loadTipoCargas();
    this.loadMarcas();
  }

  loadTipoCargas() {
    this.tipoCargaService.getAll().subscribe(response => {
      this.tipoCargaList = response.filter(e => !e.isDeleted);
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

  save(tipoCarga: TipoCargaRequest) {
    this.tipoCargaService.create(tipoCarga).subscribe({
      next: (tipoCarga: TipoCargaResponse) => {
        this.toast.showSuccessCreate();
        this.handlePostCreate(tipoCarga);
      },
      error: (error) => {
        this.toast.showErrorCreate();
        console.error(error);
      }
    });
  }

  openFormEdit(tipoCarga: any) {
    this.form.showFormEdit(tipoCarga);
  }

  update(event: { id: number, tipoCarga: TipoCargaRequest }) {
    this.tipoCargaService.update(event.id, event.tipoCarga).subscribe({
      next: (tipoCarga) => {
        this.toast.showSuccessUpdate();
        this.handlePostUpdate(tipoCarga);
      },
      error: (error) => {
        this.toast.showErrorUpdate();
        console.error(error);
      }
    }) 
  }

  handlePostUpdate(tipoCarga: TipoCargaResponse) {
    const index = this.tipoCargaList.findIndex(item => item.id === tipoCarga.id);
    this.tipoCargaList[index] = tipoCarga;

    this.form.resetAndHideForm();
    this.idToUpdated = undefined;
    this.dataTipoCarga = undefined;
  }

  handlePostCreate(tipoCarga : TipoCargaResponse){
    let list = [...this.tipoCargaList];
    list.push(tipoCarga);
    
    this.tipoCargaList = list;

    this.form.resetAndHideForm();
  }

  openConfirmDialog(tipoCarga: TipoCargaResponse) {
    this.dialog.openDialog(tipoCarga.id);
  }

  deleteTipoCarga(id: number) {
    this.tipoCargaService.deleteById(id).subscribe({
      next: () => {
        this.toast.showSuccessDelete();
        this.tipoCargaList = this.tipoCargaList.filter(item => item.id !== id);
      },
      error: (error) => {
        this.toast.showErrorDelete();
        console.error(error);
      }
    });
  }

  linkTipoCarga(tipoCarga: TipoCargaResponse) {
    alert("TODO relacionadas sin implementar");
  }  
}