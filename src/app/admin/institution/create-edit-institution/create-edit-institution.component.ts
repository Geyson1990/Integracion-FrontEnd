import { Component, Injector, OnInit, Output, Self, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SectorDto } from '@shared/service-proxies/application/sector-proxie';
import { GetForEditInstitutionDto, Institution, InstitutionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EventEmitter } from 'stream';
import { finalize } from 'rxjs/operators';
import { InstitutionComponent } from '../institution.component';

@Component({
  selector: 'createOrEditInstitutionModal',
  templateUrl: './create-edit-institution.component.html',
  
})
export class CreateEditInstitutionComponent extends AppComponentBase {

  @ViewChild('createOrEditModal', {static:true}) modal:ModalDirective;
  @ViewChild('InstitutionCompo',{static:true}) institutionCompo:InstitutionComponent;
  //@Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  
  active = false;
  saving = false;
    

  institution: Institution = new Institution();
  sectors: SectorDto[] 
  constructor(
    injector: Injector,
    private _institution:InstitutionServiceProxy) {
    super(injector);    
  }

  show(institutionId?: number): void {
    const self = this;
    this._institution.getInstitutionForEdit(institutionId).subscribe(result=>{
      self.institution = result.institution;
      self.sectors = Object.assign([], result.sectors);
      if (this.institution?.sector && this.institution.sector.id != -1) {
        const managerIndex: number = this.sectors.findIndex(p => p.id == this.institution.sector.id);
        if (managerIndex == -1) {
            this.sectors.push(SectorDto.fromJS(this.institution.sector));
            
            this.sectors = this.sectors.sort((a, b) => a.name.localeCompare(b.name));
          }
        }
      this.active = true;
      self.modal.show();
    }); 
  }

  onSectorsChange(event: any) {
    const SectorId: number = +event.target.value;
    const index: number = this.sectors.findIndex(p => p.id == SectorId);
    
    if (index != -1) {
        this.institution.sector.name = this.sectors[index].name;
    } else {
        this.institution.sector.id = -1;
        this.institution.sector.name = undefined;
    }
}
  save(){
    
    const self= this;
    const input = new Institution();
    input.id= self.institution.id;
    input.name = self.institution.name;
    input.shortName = self.institution.shortName;
    input.ruc = self.institution.ruc;
    input.contacName = self.institution.contacName;
    input.emailAddress = self.institution.emailAddress;
    input.phoneNumber = self.institution.phoneNumber;
    input.sector = self.institution.sector;
    
    this.saving = true;
    this._institution.createOrUpdateInstitution(input)
      .pipe(finalize( ()=> this.saving = false))
      .subscribe(()=>{
          this.notify.info(this.l('SavedSuccessfully'));
          this.close();
          this.institutionCompo.getInstitutions();
          //this.modalSave.emit(null);
      })

    ;

  }
  close(){
    this.active = false;
    this.modal.hide();
  }
  onShown(){
    document.getElementById('InstitutionDisplayName').focus();
  }
 
}
