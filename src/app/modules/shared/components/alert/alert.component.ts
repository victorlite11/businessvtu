import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/api';


export class Alert {
  temporary : boolean;
  life : number;
  changes : number = Math.random();
  message : Message[] = [];
  severity : 'warn' | 'error' | 'success' | 'info';
  alive : boolean; // expected not to change this directly

  constructor(config: {
    temporary ?: boolean,
    life ?: number,
    alive ?: boolean,
    message ?: string,
    severity ?: 'warn' | 'error' | 'success' | 'info'
  }) {
    this.temporary = config.temporary || false;
    this.life = config.life || 3000;
    this.message.push({detail: config.message || "", severity: config.severity || "success"});
    this.severity = config.severity || "info";
    this.alive = config.alive || false;
  }

  showAlert(op: {message: string, severity: 'warn' | 'error' | 'success' | 'info'}) {
    this.alive = true;
    this.message = [];
    this.message.push({detail : op.message, severity: op.severity});
    this.severity = op.severity;
    setTimeout(() => this.alive = false, this.life)
  }

  hideAlert() {
    this.message = [];
    this.alive = false;
  }
}
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnChanges {
  @Input() temporary : boolean = false;
  @Input() life : number = 3000;
  @Input() message : Message[] = [];
  @Input() severity : 'warn' | 'error' | 'success' | 'info' = 'info';
  @Input() alive = false;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}

}
