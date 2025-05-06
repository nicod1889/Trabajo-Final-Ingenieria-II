import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../auth/auth.service';
import { hasValidRoles } from '../../util/rolesUtil';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuModule, SidebarModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() visible : boolean = false;
  @Output() hide = new EventEmitter;

  textTooltip : string = "Función no disponible";

  year : number = new Date().getFullYear();

  menubarStyle = {
    width: '100%',
  };

  items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      path: 'inicio'
    },
    {
      label: 'Viajes',
      icon: 'pi pi-star-fill',
      path: 'viajes',
      isDisabled: !hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"])
    },
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      path: 'Clientes',
      isDisabled: !hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"])
    },
    {
      label: 'Pagos',
      icon: 'pi pi-wallet',
      isDisabled: !hasValidRoles(this.authService.employeeData, [])
    },
    {
      label: 'Camiones',
      icon: 'pi pi-car',
      path: 'camiones',
      isDisabled: !hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"])
    },
    {
      label: 'Marcas',
      icon: 'pi pi-sparkles',
      path: 'marcas',
      isDisabled: !hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"])
    },
    {
      label: 'Ciudades',
      icon: 'pi pi-building',
      path: 'ciudades',
      isDisabled: !hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"])
    },
    {
      label: 'Empleados',
      icon: 'pi pi-briefcase',
      path: 'employees',
      isDisabled: !hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"])
    },
    {
      label: 'Cargas',
      icon: 'pi pi-briefcase',
      path: 'cargas',
      isDisabled: !hasValidRoles(this.authService.employeeData, ["ROL_ADMIN", "ROL_ADMINISTRATIVO"])
    },
    {
      label: 'Tipo de cargas',
      icon: 'pi pi-tags',
      path: 'tipo_cargas',
      isDisabled: !hasValidRoles(this.authService.employeeData, ["ROL_ADMIN"])
    }
  ];

  constructor (
    private authService : AuthService
  ){}

  sidebarStyle = {
    border: 'none',
  };

  hideEmit(){
    this.hide.emit();
  }
}
