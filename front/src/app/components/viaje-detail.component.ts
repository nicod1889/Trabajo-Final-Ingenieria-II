import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { ViajeResponse } from "../interfaces/model.interfaces";

@Component({
  selector: 'app-viaje-detail',
  standalone: true,
  imports: [CommonModule, DialogModule],
  template: `
    <p-dialog header="Detalle del viaje"
              [(visible)]="visible"
              [modal]="true"
              [style]="{ width: '50vw' }"
              focusOnShow="false">
      <div *ngIf="viaje">
        <p><strong>N° de orden:</strong> {{ viaje.numOrden }}</p>
        <p><strong>Origen:</strong> {{ viaje.origen.nombre }}</p>
        <p><strong>Destino:</strong> {{ viaje.destino.nombre }}</p>
        <p><strong>Camión:</strong> {{ viaje.camionCompound }}</p>
        <p><strong>Camionero:</strong> {{ viaje.empleadoCompound }}</p>
        <p><strong>Cliente:</strong> {{ viaje.nombreCliente }}</p>
        <p><strong>Estado:</strong> {{ viaje.showedEstado }}</p>
        <p><strong>Carga:</strong> {{ viaje.carga?.nombre || 'Sin carga' }}</p>
        <p><strong>Fecha salida:</strong> {{ viaje.fechaSalidaEs }}</p>
        <p><strong>Fecha entrega estimada:</strong> {{ viaje.fechaEstimadaEntregaEs }}</p>
        <p><strong>Precio:</strong> {{ viaje.precioCurrency }}</p>
        <p><strong>Observaciones:</strong> {{ viaje.observaciones || '-' }}</p>
      </div>
    </p-dialog>
  `
})
export class ViajeDetailComponent {
  @Input() viaje?: ViajeResponse;
  visible = false;

  show(viaje: ViajeResponse) {
    this.viaje = viaje;
    this.visible = true;
  }
}
