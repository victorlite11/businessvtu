import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { INotification } from '../../interfaces/main.interfaces';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() visible = false;
  @Input() notification = ""
  constructor() { }


  ngOnInit(): void {
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

}
