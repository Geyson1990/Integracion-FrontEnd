import { Component, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TagsDto, tagsProxy } from '@shared/service-proxies/application/tags-proxie';
import { result } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscriber } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EventEmitter } from 'stream';

@Component({
  selector: 'CreateOrEditTagModal',
  templateUrl: './create-edit-tag.component.html',
  styleUrls: ['./create-edit-tag.component.css']
})
export class CreateEditTagComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', {static: true}) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

 //@Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  
  active = false;
  saving = false;
  item :TagsDto = new TagsDto();
  nameid: string;
  _verificationEnabled :boolean;
  constructor(injector: Injector, private _tagServices:tagsProxy )  { 
    super(injector);
    this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
  }

  ngOnInit(): void {
  }
  
  show(Id?: number): void {
    const self = this;
    this.item = new TagsDto();

    if(Id){
      this.nameid= "esta es la etiqueta";
      this._tagServices.get(Id).subscribe(result=>{
        this.item=result
        
        self.active = true;
        self.modal.show(); 
      })
       
    
    }else
    {
      self.active = true;
    self.modal.show();
    }
     
  }
  save(): void {
    
    this.item.institutionId = this.appSession.user.institutionId;
    
    this.saving = true;
    this._tagServices.createOrUpdateRole(this.item).pipe(finalize(() => this.saving = false)).subscribe(() => {
      //this.modalSave.emit();
      this.notify.success('Guardado satisfactoriamente');
      this.close();
    });
            
}

  onShown(): void {
    document.getElementById('Name').focus();
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
