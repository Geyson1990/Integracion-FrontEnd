import { Component, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import {  Injector, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EntityDtoOfInt64, Institution, InstitutionServiceProxy, PersonType, UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { FindPersonComponent } from '@shared/component/find-person/find-person.component';
import { UtilityPersonDto } from '@shared/service-proxies/application/utility-proxie';
import { CreateEditInstitutionComponent } from './create-edit-institution/create-edit-institution.component';

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  
  animations: [appModuleAnimation()]
})
export class InstitutionComponent extends AppComponentBase implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', {static : true}) paginator: Paginator;
  @ViewChild('createOrEditInstitutionModal',{static:true}) createOrEditInstitutionModal:CreateEditInstitutionComponent;


  constructor(injector: Injector, private _institution:InstitutionServiceProxy) { 
    super(injector);

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.primengTableHelper.adjustScroll(this.dataTable);
  }
  
  getInstitutions(): void {
    this.primengTableHelper.showLoadingIndicator();
    

    this._institution.getInstitutions()
        .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
        .subscribe(result => {
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.totalRecordsCount = result.items.length;
            this.primengTableHelper.hideLoadingIndicator();
        });
  }

  createInstitution(){
    this.createOrEditInstitutionModal.show();
  }

  deleteInstitution(institution: Institution){
    let self = this;
    self.message.confirm(
        self.l('la institución sera eliminada de forma permanente ', institution.name),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
              this._institution.deleteInstitution(institution.id).subscribe(()=>{
                this.getInstitutions();
                 abp.notify.success(this.l('SuccessfullyDeleted'));
              });
                
            }
        }
    );
  }

}
