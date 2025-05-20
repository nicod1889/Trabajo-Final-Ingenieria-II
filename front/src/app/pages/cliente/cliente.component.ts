import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ClienteRequest, ClienteResponse } from '../../interfaces/model.interfaces';
import { PageComponent } from '../../components/page/page.component';
import { Column } from '../../interfaces/components.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { TooltipModule } from 'primeng/tooltip';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { AuthService } from '../../auth/auth.service';
import { hasValidRoles } from '../../util/rolesUtil';
import { ClienteFormComponent } from '../../components/cliente-form/cliente-form.component';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [ButtonModule, ClienteFormComponent, ConfirmDialogModule, ConfirmDialogComponent, ToastComponent, PageComponent, TableModule, ToastModule, TooltipModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('form') form!: ClienteFormComponent;

  title : string = "Clientes";
  labelButtonAdd : string = "Agregar Cliente";
  status! : boolean;
  idToUpdated? : number;
  clienteList : ClienteResponse[] = [];

  canCreate : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canEdit : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"]);
  canRemove : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"]);

  columns : Column []= [
    {
      header: "Nombre empresa",
      field: "businessName",
      sortable: true
    },
    {
      header: "Tipo documento",
      field: "category",
      sortable: true
    },
    {
      header: "Nro. identificación",
      field: "identificationNumber",
      sortable: true
    },
    {
      header: "E-mail",
      field: "email",
      sortable: true
    }
  ];

  buttonConfig: ActionButtonConfig[] = [
    { 
      icon: 'pi pi-link', 
      tooltip: 'Ver elementos relacionados', 
      severity: 'info',
      action: (data: any) => this.linkCliente(data) 
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

  dataCliente? : ClienteRequest;

  constructor(
    private clienteService : ClienteService,
    private authService : AuthService
  ){}

  ngOnInit(){
    this.loadClientes();
  }

  loadClientes(){
    this.clienteService.getAll().subscribe(response => {
      this.clienteList = response.filter(e => !e.deleted);
    });
  }

  openForm(){
    this.form.showForm();
  }

  save(cliente : ClienteRequest){
    this.clienteService.create(cliente).subscribe({
      next: (cliente) => {
        this.toast.showSuccessCreate();
        this.handlePostCreate(cliente);
      },
      error: (error) => {
        this.toast.showErrorCreate();
        console.error(error);
      }
    }) 
  }

  openFormEdit(cliente : any){
    this.idToUpdated = cliente.id;
    this.dataCliente = { ...cliente };
    this.form.showForm();
  }

  update(cliente : ClienteRequest){
    this.clienteService.update(this.idToUpdated!, cliente).subscribe({
      next: (cliente) => {
        this.toast.showSuccessUpdate();
        this.handlePostUpdate(cliente);
      },
      error: (error) => {
        this.toast.showErrorUpdate();
        console.error(error);
      }
    }) 
  }

  openConfirmDialog(cliente : any){
    this.dialog.openDialog(cliente.id);
  }
  
  deleteCliente(id : any){
    this.clienteService.deleteById(id).subscribe({
      next: () => {
        this.toast.showSuccessDelete();
        this.clienteList = this.clienteList.filter(item => item.id !== id);
      },
      error: (error) => {
        this.toast.showErrorDelete();
        console.error(error);
      }
    }) 
  }

  linkCliente(cliente : any){
    alert("TODO relacionadas sin implementar");
  }

  handlePostUpdate(cliente : ClienteResponse){
    const index = this.clienteList.findIndex(item => item.id === cliente.id);
    this.clienteList[index] = cliente;

    this.form.resetAndHideForm();
    this.idToUpdated = undefined;
    this.dataCliente = undefined;
  }

  handlePostCreate(cliente : ClienteResponse){
    let list = [...this.clienteList];
    list.push(cliente);
    
    this.clienteList = list;

    this.form.resetAndHideForm();
  }
}
