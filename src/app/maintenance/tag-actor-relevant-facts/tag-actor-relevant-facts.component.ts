import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { CreateEditTagComponent } from './create-edit-tag/create-edit-tag.component';
import { TagsDto, tagsProxy } from '@shared/service-proxies/application/tags-proxie';
import { finalize } from 'rxjs/operators';
import { result } from 'lodash';

@Component({
  selector: 'app-tag-actor-relevant-facts',
  templateUrl: './tag-actor-relevant-facts.component.html',
  styleUrls: ['./tag-actor-relevant-facts.component.css'],
   animations: [
    appModuleAnimation()
  ]
})
export class TagActorRelevantFactsComponent extends AppComponentBase  {


  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', {static : true}) paginator: Paginator;
  @ViewChild('CreateOrEditTagModal',{static:true}) CreateOrEditTagModal:CreateEditTagComponent;

  IdInstitution: number;
  _verificationEnabled:boolean;

  constructor( _injector:Injector, private _tagsServices: tagsProxy) {
    super(_injector);
    this._verificationEnabled = this.permission.isGranted('Pages.ReadingMode');
        if(this.appSession.user.role=="Admin"){
            this._verificationEnabled= false;
        }
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.primengTableHelper.adjustScroll(this.dataTable);
  }
  getTags(event?: LazyLoadEvent){
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    
    this.IdInstitution = this.appSession.user.institutionId
    
    this.primengTableHelper.showLoadingIndicator();
    
    this._tagsServices.getAllForInstitution(this.IdInstitution)
      .pipe(finalize(() =>this.primengTableHelper.hideLoadingIndicator()))
      .subscribe(result => {
        this.primengTableHelper.records = result.items
        this.primengTableHelper.totalRecordsCount = result.items.length;
        this.primengTableHelper.hideLoadingIndicator();
      })
    
        
  }
  createTags(){
    this.CreateOrEditTagModal.show();
  }
  deleteRole(tag: TagsDto): void {
    let self = this;
    self.message.confirm(
        self.l('se eliminara la etiqueta ', tag.name),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
                this._tagsServices.deleteTag(tag.id).subscribe(() => {
                    this.getTags();
                    abp.notify.success(this.l('SuccessfullyDeleted'));
                });
            }
        }
    );
}

}
