import { Routes } from '@angular/router';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { VehicleComponent } from './pages/vehicle/vehicle.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ServicesComponent } from './pages/services/services.component';
import { employeeComponent } from './pages/employee/employee.component';
import { authGuard, authGuardNotLogin, ClientGuard, employeeGuard, servicesGuard, vehiclesGuard, camionesGuard, marcasGuard, ciudadesGuard, tipoCargaGuard, cargaGuard, viajeGuard } from './auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { CamionComponent } from './pages/camion/camion.component';
import { MarcaComponent } from './pages/marca/marca.component';
import { CiudadComponent } from './pages/ciudad/ciudad.component';
import { TipoCargaComponent } from './pages/tipoCarga/tipoCarga.component';
import { CargaComponent } from './pages/carga/carga.component';
import { ViajeComponent } from './pages/viaje/viaje.component';

export const routes: Routes = [
    { path: 'inicio', component: HomeComponent, canActivate: [authGuard] },
    { path: 'viajes', component: ViajeComponent, canActivate: [viajeGuard] },
    { path: 'Clientes', component: ClienteComponent, canActivate: [ClientGuard] },
    { path: 'vehiculos', component: VehicleComponent, canActivate: [vehiclesGuard] },
    { path: 'camiones', component: CamionComponent, canActivate: [camionesGuard] },
    { path: 'marcas', component: MarcaComponent, canActivate: [marcasGuard] },
    { path: 'ciudades', component: CiudadComponent, canActivate: [ciudadesGuard] },
    { path: 'login', component: LoginFormComponent, canActivate: [authGuardNotLogin] },
    { path: 'employees', component: employeeComponent, canActivate: [employeeGuard] },
    { path: 'cargas', component: CargaComponent, canActivate: [cargaGuard] },
    { path: 'tipo_cargas', component: TipoCargaComponent, canActivate: [tipoCargaGuard] },
    { path: 'servicios', component: ServicesComponent, canActivate: [servicesGuard] },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: '**', redirectTo: 'inicio' }
];
