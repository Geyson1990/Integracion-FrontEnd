import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'select-column-social-conflict-alert',
  templateUrl: 'select-column-social-conflict-alert.component.html',
  styleUrls: ['select-column-social-conflict-alert.component.css']
})
export class SelectColumnSocialConflictAlertComponent extends AppComponentBase {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() Enviar: EventEmitter<boolean[]>  = new EventEmitter<boolean[]>();

  active: boolean;
  saving: boolean;
  
  listColumns : boolean[] = [];
  checkTotal: boolean = true;
  checkCode: boolean = true;
  checkDateIssue: boolean = true;
  checkAlertName: boolean = true;
  checkUnderSecretary: boolean = true;
  checkMainInformation: boolean = true;
  checkActors: boolean = true;
  checkRisk: boolean = true;
  checkLevelRisk: boolean = true;

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
    this.listColumns.push(this.checkCode);
    this.listColumns.push(this.checkDateIssue);
    this.listColumns.push(this.checkAlertName);
    this.listColumns.push(this.checkUnderSecretary);
    this.listColumns.push(this.checkMainInformation);
    this.listColumns.push(this.checkActors);
    this.listColumns.push(this.checkRisk);
    this.listColumns.push(this.checkTotal);
    this.listColumns.push(this.checkLevelRisk);
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
    document.getElementById('Code').focus();
  }

  selectCode(checkValue) {
    if (checkValue) {
      this.checkCode = true;
    } 
    else{
      this.checkCode = false;
      this.checkTotal = false;
    }
  }
  selectDateIssue(checkValue) {
    if (checkValue) {
      this.checkDateIssue = true;
    } 
    else{
      this.checkDateIssue = false;
      this.checkTotal = false;
    }
  }
  selectAlertName(checkValue) {
    if (checkValue) {
      this.checkAlertName = true;
    } 
    else{
      this.checkAlertName = false;
      this.checkTotal = false;
    }
  }
  selectUnderSecretary(checkValue) {
    if (checkValue) {
      this.checkUnderSecretary = true;
    } 
    else{
      this.checkUnderSecretary = false;
      this.checkTotal = false;
    }
  }
  selectMainInformation(checkValue) {
    if (checkValue) {
      this.checkMainInformation = true;
    } 
    else{
      this.checkMainInformation = false;
      this.checkTotal = false;
    }
  }
  selectActors(checkValue) {
    if (checkValue) {
      this.checkActors = true;
    } 
    else{
      this.checkActors = false;
      this.checkTotal = false;
    }
  }
  selectRisk(checkValue) {
    if (checkValue) {
      this.checkRisk = true;
    } 
    else{
      this.checkRisk = false;
      this.checkTotal = false;
    }
  }
  selectLevelRisk(checkValue) {
    if (checkValue) {
      this.checkLevelRisk = true;
    } 
    else{
      this.checkLevelRisk = false;
      this.checkTotal = false;
    }
  }
  selectTotal(checkValue) {
    if (checkValue) {
      this.checkTotal = true;
      this.checkCode = true;
      this.checkDateIssue = true;
      this.checkAlertName = true;
      this.checkUnderSecretary = true;
      this.checkMainInformation = true;
      this.checkActors = true;
      this.checkLevelRisk = true;
      this.checkRisk = true;      
    } 
    else{
      this.checkTotal = false;
      this.checkCode = false;
      this.checkDateIssue = false;
      this.checkAlertName = false;
      this.checkUnderSecretary = false;
      this.checkMainInformation = false;
      this.checkActors = false;
      this.checkLevelRisk = false;
      this.checkRisk = false;
    }
  }
}
