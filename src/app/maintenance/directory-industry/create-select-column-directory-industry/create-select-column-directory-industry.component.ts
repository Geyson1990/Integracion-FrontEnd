import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DirectoryIndustryServiceProxy } from '@shared/service-proxies/application/directory-industry-proxie';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'create-select-column-directory-industry',
  templateUrl: 'create-select-column-directory-industry.component.html',
  styleUrls: ['create-select-column-directory-industry.component.css']
})
export class CreateSelectColumnDirectoryIndustryComponent extends AppComponentBase {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() Enviar: EventEmitter<boolean[]>  = new EventEmitter<boolean[]>();

  active: boolean;
  state: string;
  saving: boolean;

  listColumns : boolean[] = [];
  checkNameEmpresa: boolean = true;
  checkSector: boolean = true;
  checkDireccion: boolean = true;
  checkTelefono: boolean = true;
  checkPaginaWeb: boolean = true;
  checkDepartamento: boolean = true;
  checkProvincia: boolean = true;
  checkDistrito: boolean = true;
  checkHabilitado: boolean = true;
  checkTotal : boolean = true;
  constructor(_injector: Injector, private _directorygovernmentServiceProxy: DirectoryIndustryServiceProxy) { 
    super(_injector);
  }

   showColumn(): void {
        //this.saving = false;
        this.active = true;
        this.modal.show();
    }

    save(): void {
    
    this.listColumns.push(this.checkNameEmpresa);
    this.listColumns.push(this.checkSector);
    this.listColumns.push(this.checkDireccion);
    this.listColumns.push(this.checkTelefono);
    this.listColumns.push(this.checkPaginaWeb);
    this.listColumns.push(this.checkDepartamento);
    this.listColumns.push(this.checkProvincia);
    this.listColumns.push(this.checkDistrito);
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
      document.getElementById('NameEmpresa').focus();
    }

    selectTotal(checkValue){
      if(checkValue){
        this.checkTotal = true;
        this.checkNameEmpresa = true;
        this.checkSector = true;
        this.checkDireccion = true;
        this.checkTelefono = true;
        this.checkPaginaWeb = true;
        this.checkDepartamento = true;
        this.checkProvincia = true;
        this.checkDistrito = true;
        this.checkHabilitado = true;
      }else{
        this.checkTotal = false;
        this.checkNameEmpresa = false;
        this.checkSector = false;
        this.checkDireccion = false;
        this.checkTelefono = false;
        this.checkPaginaWeb = false;
        this.checkDepartamento = false;
        this.checkProvincia = false;
        this.checkDistrito = false;
        this.checkHabilitado = false;
      }
    }
    selectRowNameEmpresa(checkValue) {
      if (checkValue) {
        this.checkNameEmpresa = true;
      } 
      else{
        this.checkNameEmpresa = false;
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

    selectRowDireccion(checkValue) {
      if (checkValue) {
        this.checkDireccion = true;
      } 
      else{
        this.checkDireccion = false;
        this.checkTotal = false;
      }
    }

    selectRowTelefono(checkValue) {
      if (checkValue) {
        this.checkTelefono = true;
      } 
      else{
        this.checkTelefono = false;
        this.checkTotal = false;
      }
    }

    selectRowPaginaWeb(checkValue) {
      if (checkValue) {
        this.checkPaginaWeb = true;
      } 
      else{
        this.checkPaginaWeb = false;
        this.checkTotal = false;
      }
    }

    selectRowDepartamento(checkValue) {
      if (checkValue) {
        this.checkDepartamento = true;
      } 
      else{
        this.checkDepartamento = false;
        this.checkTotal = false;
      }
    }

    selectRowProvincia(checkValue) {
      if (checkValue) {
        this.checkProvincia = true;
      } 
      else{
        this.checkProvincia = false;
        this.checkTotal = false;
      }
    }

    selectRowDistrito(checkValue) {
      if (checkValue) {
        this.checkDistrito = true;
      } 
      else{
        this.checkDistrito = false;
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
