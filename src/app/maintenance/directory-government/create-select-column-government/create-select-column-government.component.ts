import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryGovernmentServiceProxy } from '@shared/service-proxies/application/directory-government-proxie';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'create-select-column-government',
  templateUrl: './create-select-column-government.component.html',
  styleUrls: ['./create-select-column-government.component.css']
})
export class CreateSelectColumnGovernmentComponent extends AppComponentBase {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() Enviar: EventEmitter<boolean[]>  = new EventEmitter<boolean[]>();

  active: boolean;
  saving: boolean;

  listColumns : boolean[] = [];
  checkName: boolean = true;
  checkShortName: boolean = true;
  checkAddress: boolean = true;
  checkPhoneNumber: boolean = true;
  checkUrl: boolean = true;
  checkTipo: boolean = true;
  checkSector: boolean = true;
  checkHabilitado: boolean = true;
  checkTotal: boolean = true;
  constructor(_injector: Injector, private _directorygovernmentServiceProxy: DirectoryGovernmentServiceProxy) { 
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
this.listColumns.push(this.checkShortName);
this.listColumns.push(this.checkAddress);
this.listColumns.push(this.checkPhoneNumber);
this.listColumns.push(this.checkUrl);
this.listColumns.push(this.checkTipo);
this.listColumns.push(this.checkSector);
this.listColumns.push(this.checkHabilitado);
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
    this.checkShortName = true;
    this.checkAddress = true;
    this.checkPhoneNumber = true;
    this.checkUrl = true;
    this.checkTipo = true;
    this.checkSector = true;
    this.checkHabilitado = true;
  }else{
    this.checkTotal = false;
    this.checkName = false;
    this.checkShortName = false;
    this.checkAddress = false;
    this.checkPhoneNumber = false;
    this.checkUrl = false;
    this.checkTipo = false;
    this.checkSector = false;
    this.checkHabilitado = false;
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
console.log(this.checkName);
}

selectRowShortName(checkValue) {
if (checkValue) {
this.checkShortName = true;
} 
else{
this.checkShortName = false;
this.checkTotal = false;
}
console.log(this.checkShortName);
}
selectRowAddress(checkValue) {
if (checkValue) {
this.checkAddress = true;
} 
else{
this.checkAddress = false;
this.checkTotal = false;
}
}
selectRowPhoneNumber(checkValue) {
if (checkValue) {
this.checkPhoneNumber = true;
} 
else{
this.checkPhoneNumber = false;
this.checkTotal = false;
}
}
selectRowUrl(checkValue) {
if (checkValue) {
this.checkUrl = true;
} 
else{
this.checkUrl = false;
this.checkTotal = false;
}
}
selectRowTipo(checkValue) {
if (checkValue) {
this.checkTipo = true;
} 
else{
this.checkTipo = false;
this.checkTotal = false;
}
}
selectRowSector(checkValue) {
if (checkValue) {
this.checkSector = true;
} 
else{
this.checkSector = false;
this.checkTotal = false;
} 
}
selectRowHabilitado(checkValue) {
if (checkValue) {
this.checkHabilitado = true;
} 
else{
this.checkHabilitado = false;
this.checkTotal = false;
} 
}

}
