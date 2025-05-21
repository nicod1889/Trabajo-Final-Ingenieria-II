import { Component, ViewChild } from '@angular/core';
import { ActionButtonConfig } from '../../components/action-buttons/action-buttons.component';
import { EmpleadoRequest, EmpleadoResponse, Role } from '../../interfaces/model.interfaces';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { Column } from '../../interfaces/components.interface';
import { EmpleadoService } from '../../services/empleado.service';
import { employeeFormComponent } from '../../components/employee-form/employee-form.component';
import { PageComponent } from '../../components/page/page.component';
import { ToastModule } from 'primeng/toast';
import { hasValidRoles } from '../../util/rolesUtil';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    ConfirmDialogComponent,
    employeeFormComponent,
    ToastComponent,
    PageComponent,
    ToastModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class employeeComponent {
  @ViewChild('dialog') dialog!: ConfirmDialogComponent;
  @ViewChild('toast') toast!: ToastComponent;
  @ViewChild('form') form!: employeeFormComponent;

  title : string = "Empleados";
  labelButtonAdd : string = "Agregar empleado";
  status! : boolean;
  idToUpdated? : number;
  employeeList : EmpleadoResponse[] = [];

  canCreate : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"]);
  canEdit : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"]);
  canRemove : boolean = hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"]);

  columns : Column []= [
    {
      header: "Nombre",
      field: "nombre",
      sortable: true
    },
    {
      header: "Apellido",
      field: "apellido",
      sortable: true
    },
    {
      header: "E-Mail",
      field: "email",
      sortable: true
    },
    {
      header: "Nro. documento",
      field: "numeroIdentificacion",
      sortable: true
    },
    {
      header: "Rol",
      field: "rolText",
      sortable: true
    },
    {
      header: "Dirección",
      field: "direccionCompound",
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

  dataemployee? : EmpleadoRequest;

  constructor(
    private employeeService : EmpleadoService,
    private authService : AuthService
  ){}

  ngOnInit(){
    this.loademployees();
  }

  loademployees(){
    this.employeeService.getAll().subscribe(response => {
      console.log("RESPONSE:", response);

      this.employeeList = response
      .filter(e => !e.deleted)
      .map(e => {
        return this.processemployee(e);
      });

    });
  }

  openForm(){
    this.form.showForm();
  }

  save(employee : EmpleadoRequest){
    this.employeeService.create(employee).subscribe({
      next: (employee) => {
        this.toast.showSuccessCreate();
        this.handlePostCreate(employee);
      },
      error: (error: any) => {
        this.toast.showErrorCreate();
        console.error(error);
      }
    }) 
  }

  openFormEdit(employee : any){
    this.idToUpdated = employee.id;
    this.dataemployee = { ...employee };
    this.form.showForm();
  }

  update(employee : EmpleadoRequest){
    this.employeeService.update(this.idToUpdated!, employee).subscribe({
      next: (employee) => {
        this.toast.showSuccessUpdate();
        this.handlePostUpdate(employee);
      },
      error: (error) => {
        this.toast.showErrorUpdate();
        console.error(error);
      }
    }) 
  }

  openConfirmDialog(employee : any){
    this.dialog.openDialog(employee.id);
  }
  
  deleteemployee(id : any){
    this.employeeService.deleteById(id).subscribe({
      next: () => {
        this.toast.showSuccessDelete();
        this.employeeList = this.employeeList.filter(item => item.id !== id);
      },
      error: (error) => {
        this.toast.showErrorDelete();
        console.error(error);
      }
    }) 
  }

  linkemployee(employee : any){
    alert("TODO relacionadas sin implementar");
  }

  handlePostUpdate(employee : EmpleadoResponse){
    const updatedemployee = this.processemployee(employee);

    const index = this.employeeList.findIndex(item => item.id === employee.id);
    this.employeeList[index] = updatedemployee;

    this.form.resetAndHideForm();
    this.idToUpdated = undefined;
    this.dataemployee = undefined;
  }

  handlePostCreate(employee : EmpleadoResponse){
    const newemployee = this.processemployee(employee);

    let list = [...this.employeeList];
    list.push(newemployee);
    
    this.employeeList = list;

    this.form.resetAndHideForm();
  }

  private formatRol(rol: string): string {
  return rol
    .replace('ROL_', '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

  processemployee(employee : EmpleadoResponse) : EmpleadoResponse{
    const addr = employee.direccion;
    const direccionCompound = `${addr.street || ''} ${addr.number || ''} ${addr.floor ?? ''} ${addr.department ?? ''}`.trim();

    const rolText = this.formatRol(employee.rol);

    return {
      ...employee,
      direccionCompound,
      rolText
    };
  }
}
