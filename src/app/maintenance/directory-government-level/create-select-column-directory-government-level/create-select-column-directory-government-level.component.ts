import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'create-select-column-directory-government-level',
  templateUrl: 'create-select-column-directory-government-level.component.html',
  styleUrls: ['create-select-column-directory-government-level.component.css']
})
export class CreateSelectColumnDirectoryGovernmentLevelComponent extends AppComponentBase {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() Enviar: EventEmitter<boolean[]>  = new EventEmitter<boolean[]>();

  active: boolean;
  saving: boolean;

  listColumns : boolean[] = [];
  checkName: boolean = true;
  checkEnabled: boolean = true;
  checkTotal: boolean = true;
  constructor(_injector: Injector) { 
    super(_injector);
  }

  showColumn(): void {
    //this.saving = false;
    this.active = true;
    this.modal.show();
  }

  save(): void {
    //this.saving = true;
    this.listColumns.push(this.checkName);
    this.listColumns.push(this.checkEnabled);
    console.log(this.listColumns);
   

    this.Enviar.emit(this.listColumns);
    this.listColumns = [];
    this.close();
  }
  close(): void {
    this.modal.hide();
    this.active = false;
  }
  onShown(): void {
    document.getElementById('Name').focus();
  }

  selectRowTotal(checkValue) {
    if (checkValue) {
      this.checkName = true;
      this.checkEnabled = true;
    } 
    else{
      this.checkName = false;
      this.checkEnabled = false;
    }
  }
  selectRowName(checkValue) {
    if (checkValue) {
      this.checkName = true;
    } 
    else{
      this.checkName = false;
      this.checkTotal = false;
    }
  }
  selectRowEnabled(checkValue) {
    if (checkValue) {
      this.checkEnabled = true;
    } 
    else{
      this.checkEnabled = false;
      this.checkTotal = false;
    }
  }
}
