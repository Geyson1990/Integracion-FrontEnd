import { getLocaleEraNames } from '@angular/common';
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SugerenceType } from '@shared/service-proxies/application/social-conflict-proxie';
import { SocialConflictSensibleInterventionPlan, SocialConflictSensibleDto } from '@shared/service-proxies/application/social-conflict-sensible-proxie';
import { LazyLoadEvent, Paginator } from 'primeng';

@Component({
  selector: 'intervention-plan-list',
  templateUrl: './intervention-plan-list.component.html',
  styleUrls: ['./intervention-plan-list.component.css']
})
export class InterventionPlanListComponent extends AppComponentBase implements OnInit {

  private _busy: boolean;
  private _socialConflictSensible: SocialConflictSensibleDto;

  @ViewChild('paginator', { static: true }) paginator: Paginator;

  @Input() get busy(): boolean {
    return this._busy;
  }

  set busy(value: boolean) {
    this._busy = value;
  }

  @Input() get socialConflictSensible(): SocialConflictSensibleDto {
    return this._socialConflictSensible;
  }
  private skipCount: number;
  private maxResultCount: number;

  set socialConflictSensible(value: SocialConflictSensibleDto) {
    this._socialConflictSensible = value;

  }
  constructor(_injector: Injector) {
    super(_injector);
    this.primengTableHelper.defaultRecordsCountPerPage = 5;
    this.skipCount = 0;
    this.maxResultCount = this.primengTableHelper.defaultRecordsCountPerPage;
    
  }

  ngOnInit(): void {
    this.getData
    this.formatPagination(this.skipCount, this.maxResultCount);
  }

  getData(event?: LazyLoadEvent) {
    this.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
    this.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
    this.formatPagination(this.skipCount, this.maxResultCount);
  }

  private formatPagination(skipCount: number, maxResultCount: number) {
    let index: number = 0;
    let result: number = 0;
    
    for (let item of this.socialConflictSensible.interventionPlans) {
      item.isHidden = true; 
      if (index >= skipCount && result < maxResultCount) {
        item.isHidden = false;
        result++;
      }
      index++;
    }
  }
}
