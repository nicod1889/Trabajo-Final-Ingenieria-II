import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from "primeng/tooltip";
import { ActionButtonsComponent, ActionButtonConfig } from "../action-buttons/action-buttons.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-page-card',
  standalone: true,
  imports: [ CommonModule, ButtonModule, CardModule, IconFieldModule, InputTextModule, InputIconModule, ActionButtonsComponent, TooltipModule, FormsModule ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class PageCardComponent {
  @Input() title?: string = "";
  @Input() labelButtonAdd?: string = "";
  @Input() data: any[] = [];
  @Input() buttonConfig!: ActionButtonConfig[];
  @Input() canCreate: boolean = false;
  @Input() cardFields: { label: string, field: string }[] = [];

  @Output() onCreate = new EventEmitter();

  filterText: string = "";

  buttonStyle = {
    fontSize: '0.8rem'
  };

  iconFieldStyle = {
    fontSize: '0.8rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  };

  create() {
    if (!this.canCreate) return;
    this.onCreate.emit();
  }

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  get filteredData(): any[] {
    const filter = this.filterText?.toLowerCase().trim();
    if (!filter) return this.data;

    return this.data.filter(item =>
      this.cardFields.some(field =>
        (this.getNestedProperty(item, field.field) + '').toLowerCase().includes(filter)
      )
    );
  }
}
