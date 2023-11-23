import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DialogSpaceGetAllDto, DialogSpaceServiceProxy } from '@shared/service-proxies/application/dialog-space.proxie';
import { UtilityDepartmentDataDto, UtilityDialogSpaceTypeDto, UtilityDistrictDataDto, UtilityProvinceDataDto, UtilityServiceProxy, UtilityTerritorialUnitDto } from '@shared/service-proxies/application/utility-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { DialogSpaceDocumentType } from '@shared/service-proxies/application/dialog-space-document-proxie';
import { FileDownloadComponent } from '@shared/component/file-download/file-download.component';
import { ReportServiceProxy, ReportType } from '@shared/service-proxies/application/report-proxie';
import { FileDownloadRequestComponent } from '@shared/component/file-download-request/file-download-request.component';

@Component({
    templateUrl: 'dialog-space-report.component.html',
    styleUrls: [
        'dialog-space-report.component.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DialogSpaceReportComponent extends AppComponentBase implements OnInit {

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;



    constructor(_injector: Injector, private _utilityServiceProxy: UtilityServiceProxy, private _dialogSpaceServiceProxy: DialogSpaceServiceProxy,
        private _reportServiceProxy: ReportServiceProxy) {
        super(_injector);

    }

    ngOnInit(): void {
       this.getData();
    }

 


    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    getData(event?: LazyLoadEvent) {
       
        this.primengTableHelper.showLoadingIndicator();

        this._dialogSpaceServiceProxy.getAllReportDialogSpace().pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

}