import { Component, OnInit, ViewChild } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CiudadResponse, CiudadRequest, Provincia } from '../../interfaces/model.interfaces';
import { Column } from '../../interfaces/components.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../auth/auth.service';
import { hasValidRoles } from '../../util/rolesUtil';
import { CiudadFormComponent } from '../../components/ciudad-form/ciudad-form.component';
import { CiudadService } from '../../services/ciudad.service';

@Component({
  selector: 'app-ciudad',
  standalone: true,
  imports: [ButtonModule, TableModule, PageComponent, ConfirmDialogComponent, ConfirmDialogModule, ToastComponent, CiudadFormComponent, CommonModule],
  templateUrl: './ciudad.component.html',
  styleUrl: './ciudad.component.css'
})
export class CiudadComponent implements OnInit {
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('form') form!: CiudadFormComponent;

  title: string = "Ciudades";
  labelButtonAdd: string = "Agregar ciudad";
  status!: boolean;
  idToUpdated? : number;
  ciudadList: CiudadResponse[] = [];
  dataCiudad?: CiudadRequest;

  canCreate : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canEdit : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canRemove : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"]);

  columns: Column[] = [
    {
      header: "Nombre",
      field: "nombre",
      sortable: true
    },
    {
      header: "Provincia",
      field: "showedProvincia",
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
    private ciudadService: CiudadService, 
    private authService : AuthService
  ) {}

  ngOnInit() {
    this.loadCiudades();
    
  }

  loadCiudades() {
    this.ciudadService.getAll().subscribe(response => {
      this.ciudadList = response
        .filter(e => !e.deleted)
        .map(e => {
          return this.processCiudad(e);
        });
    });
  }

  openForm() {
    this.form.showForm();
  }

  save(ciudad: CiudadRequest) {
    this.ciudadService.create(ciudad).subscribe({
      next: (ciudad: CiudadResponse) => {
        this.toast.showSuccessCreate();
        this.handlePostCreate(ciudad);
      },
      error: (error) => {
        this.toast.showErrorCreate();
        console.error(error);
      }
    });
  }

  openFormEdit(ciudad: any) {
    this.form.showFormEdit(ciudad);
  }

  update(event: { id: number, ciudad: CiudadRequest }) {
    this.ciudadService.update(event.id, event.ciudad).subscribe({
      next: (ciudad) => {
        this.toast.showSuccessUpdate();
        this.handlePostUpdate(ciudad);
      },
      error: (error) => {
        this.toast.showErrorUpdate();
        console.error(error);
      }
    }) 
  }

  handlePostUpdate(ciudad: CiudadResponse) {
    const updatedCiudad = this.processCiudad(ciudad);

    const index = this.ciudadList.findIndex(item => item.id === ciudad.id);
    this.ciudadList[index] = updatedCiudad;

    this.form.resetAndHideForm();
    this.idToUpdated = undefined;
    this.dataCiudad = undefined;
  }

  handlePostCreate(ciudad : CiudadResponse){
    const newCiudad = this.processCiudad(ciudad);

    let list = [...this.ciudadList];
    list.push(newCiudad);
    this.ciudadList = list;

    this.form.resetAndHideForm();
  }

  openConfirmDialog(ciudad: CiudadResponse) {
    this.dialog.openDialog(ciudad.id);
  }

  deleteCiudad(id: number) {
    this.ciudadService.deleteById(id).subscribe({
      next: () => {
        this.toast.showSuccessDelete();
        this.ciudadList = this.ciudadList.filter(item => item.id !== id);
      },
      error: (error) => {
        this.toast.showErrorDelete();
        console.error(error);
      }
    });
  }

  formatProvincia(provincia: string): string {
    return provincia
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  processCiudad(ciudad : CiudadResponse) : CiudadResponse{
      const showedProvincia = this.formatProvincia(ciudad.provincia);
  
      return {
        ...ciudad,
        showedProvincia
      };
  }

}