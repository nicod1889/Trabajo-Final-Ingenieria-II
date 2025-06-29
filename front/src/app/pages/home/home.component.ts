import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CarouselModule } from 'primeng/carousel';
import { ServiceResponse, StatusService, VehicleBasicResponse, ViajeResponse } from '../../interfaces/model.interfaces';
import { ButtonModule } from 'primeng/button';
import { ServicesService } from '../../services/services.service';
import { Router } from '@angular/router';
import { ViajeService } from '../../services/viaje.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, DividerModule, CarouselModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  welcome: string = '';
  viajeList: ViajeResponse[] = [];

  constructor(private viajeService: ViajeService, private router: Router) {}

  ngOnInit() {
    this.loadWelcome();
    this.loadViajes();
  }

  loadViajes() {
    this.viajeService.getAll().subscribe(response => {
      this.viajeList = response
        .filter(v => v.estado === StatusService.TO_DO || v.estado === StatusService.IN_PROGRESS)
        .sort((a, b) => {
          if (a.estado === StatusService.TO_DO && b.estado !== StatusService.TO_DO) return -1;
          if (a.estado === StatusService.IN_PROGRESS && b.estado !== StatusService.IN_PROGRESS) return b.estado === StatusService.TO_DO ? 1 : -1;
          return 0;
        })
        .map(v => this.processViaje(v));
    });
  }


  private processViaje(viaje: ViajeResponse) {
    const showedEstado = this.mapStatusToDescription(viaje.estado);
    const camion = viaje.camion;
    const camionCompound = `${camion.marca || ''} ${camion.modelo || ''} ${camion.patente || ''}`.trim();
    const origenNombre = viaje.origen?.nombre || '';
    const destinoNombre = viaje.destino?.nombre || '';

    return {
      ...viaje,
      showedEstado,
      camionCompound,
      origenNombre,
      destinoNombre
    };
  }

  private mapStatusToDescription(status: StatusService): string {
    const statusMapping: { [key in StatusService]: string } = {
      [StatusService.TO_DO]: 'Pendiente',
      [StatusService.IN_PROGRESS]: 'En progreso',
      [StatusService.FINISHED]: 'Finalizado',
      [StatusService.CANCELLED]: 'Cancelado'
    };
    return statusMapping[status];
  }

  private loadWelcome() {
    const hours = new Date().getHours();
    if (hours < 12) {
      this.welcome = 'Buenos días';
    } else if (hours < 20) {
      this.welcome = 'Buenas tardes';
    } else {
      this.welcome = 'Buenas noches';
    }
  }

  goToViajes() {
    this.router.navigate(['/viajes']);
  }
    
}