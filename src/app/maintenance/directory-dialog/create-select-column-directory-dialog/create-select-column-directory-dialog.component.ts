import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryDialogServiceProxy } from '@shared/service-proxies/application/directory-dialog-proxie';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'create-select-column-directory-dialog',
  templateUrl: './create-select-column-directory-dialog.component.html',
  styleUrls: ['./create-select-column-directory-dialog.component.css']
})
export class CreateSelectColumnDirectoryDialogComponent extends AppComponentBase {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() Enviar: EventEmitter<boolean[]>  = new EventEmitter<boolean[]>();
  
  active: boolean;
  saving: boolean;
  listColumns : boolean[] = [];

  checkName: boolean = true;
  checkLast_name: boolean = true;
  checkMothers_last_name: boolean = true;
  checkPost: boolean = true;
  checkEntity: boolean = true;
  checkWeb: boolean = true;
  checkLandline: boolean = true;
  checkCell_phone: boolean = true;
  checkEnabled: boolean = true;
  checkTotal : boolean = true;
  
  constructor(_injector: Injector, private _directoryDialogServiceProxy: DirectoryDialogServiceProxy) { 
    super(_injector);
  }

  showColumn(): void {
    //this.saving = false;
    this.active = true;
    this.modal.show();
  }
  save(): void {

    this.listColumns.push(this.checkName);
    this.listColumns.push(this.checkLast_name);
    this.listColumns.push(this.checkMothers_last_name);
    this.listColumns.push(this.checkPost);
    this.listColumns.push(this.checkEntity);
    this.listColumns.push(this.checkWeb);
    this.listColumns.push(this.checkLandline);
    this.listColumns.push(this.checkCell_phone);
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

  selectTotal(checkValue){
    if(checkValue){
      this.checkTotal = true;
      this.checkName = true;
      this.checkLast_name = true;
      this.checkMothers_last_name = true;
      this.checkPost = true;
      this.checkEntity = true;
      this.checkWeb = true;
      this.checkLandline = true;
      this.checkCell_phone = true;
      this.checkEnabled = true;
    }else{
      this.checkTotal = false;
      this.checkName = false;
      this.checkLast_name = false;
      this.checkMothers_last_name = false;
      this.checkPost = false;
      this.checkEntity = false;
      this.checkWeb = false;
      this.checkLandline = false;
      this.checkCell_phone = false;
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

  selectRowLastName(checkValue) {
    if (checkValue) {
      this.checkLast_name = true;
    } 
    else{
      this.checkLast_name = false;
      this.checkTotal = false;
    }
  }

  selectRowMotherLastName(checkValue) {
    if (checkValue) {
      this.checkMothers_last_name = true;
    } 
    else{
      this.checkMothers_last_name = false;
      this.checkTotal = false;
    }
  }

  selectRowPost(checkValue) {
    if (checkValue) {
      this.checkPost = true;
    } 
    else{
      this.checkPost = false;
      this.checkTotal = false;
    }
  }

  selectRowEntity(checkValue) {
    if (checkValue) {
      this.checkEntity = true;
    } 
    else{
      this.checkEntity = false;
      this.checkTotal = false;
    }
  }

  selectRowWeb(checkValue) {
    if (checkValue) {
      this.checkWeb = true;
    } 
    else{
      this.checkWeb = false;
      this.checkTotal = false;
    }
  }

  selectRowLandLine(checkValue) {
    if (checkValue) {
      this.checkLandline = true;
    } 
    else{
      this.checkLandline = false;
      this.checkTotal = false;
    }
  }

  selectRowCellPhone(checkValue) {
    if (checkValue) {
      this.checkCell_phone = true;
    } 
    else{
      this.checkCell_phone = false;
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
