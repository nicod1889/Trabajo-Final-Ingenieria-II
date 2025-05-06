import { Component, OnInit, ViewChild } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MarcaResponse, MarcaRequest } from '../../interfaces/model.interfaces';
import { Column } from '../../interfaces/components.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../auth/auth.service';
import { hasValidRoles } from '../../util/rolesUtil';
import { MarcaService } from '../../services/marca.service';
import { MarcaFormComponent } from '../../components/marca-form/marca-form.component';

@Component({
  selector: 'app-marca',
  standalone: true,
  imports: [ButtonModule, TableModule, PageComponent, ConfirmDialogComponent, ConfirmDialogModule, ToastComponent, MarcaFormComponent, CommonModule],
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.css'
})
export class MarcaComponent implements OnInit {
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('form') form!: MarcaFormComponent;

  title: string = "Marcas";
  labelButtonAdd: string = "Agregar marca";
  status!: boolean;
  idToUpdated? : number;
  marcaList: MarcaResponse[] = [];
  dataMarca?: MarcaRequest;

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
    private marcaService: MarcaService, 
    private authService : AuthService
  ) {}

  ngOnInit() {
    this.loadMarcas();
  }

  loadMarcas() {
    this.marcaService.getAll().subscribe(response => {
      this.marcaList = response.filter(e => !e.deleted);
    });
  }

  openForm() {
    this.form.showForm();
  }

  save(marca: MarcaRequest) {
    this.marcaService.create(marca).subscribe({
      next: (marca: MarcaResponse) => {
        this.toast.showSuccessCreate();
        this.handlePostCreate(marca);
      },
      error: (error) => {
        this.toast.showErrorCreate();
        console.error(error);
      }
    });
  }

  openFormEdit(marca: any) {
    this.form.showFormEdit(marca);
  }

  update(event: { id: number, marca: MarcaRequest }) {
    this.marcaService.update(event.id, event.marca).subscribe({
      next: (marca) => {
        this.toast.showSuccessUpdate();
        this.handlePostUpdate(marca);
      },
      error: (error) => {
        this.toast.showErrorUpdate();
        console.error(error);
      }
    }) 
  }

  handlePostUpdate(marca: MarcaResponse) {
    const index = this.marcaList.findIndex(item => item.id === marca.id);
    this.marcaList[index] = marca;

    this.form.resetAndHideForm();
    this.idToUpdated = undefined;
    this.dataMarca = undefined;
  }

  handlePostCreate(marca : MarcaResponse){
    let list = [...this.marcaList];
    list.push(marca);
    
    this.marcaList = list;

    this.form.resetAndHideForm();
  }

  openConfirmDialog(marca: MarcaResponse) {
    this.dialog.openDialog(marca.id);
  }

  deleteMarca(id: number) {
    this.marcaService.deleteById(id).subscribe({
      next: () => {
        this.toast.showSuccessDelete();
        this.marcaList = this.marcaList.filter(item => item.id !== id);
      },
      error: (error) => {
        this.toast.showErrorDelete();
        console.error(error);
      }
    });
  }
}