import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DownloadSocialConflict, ReportType } from '@shared/service-proxies/application/report-proxie';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'download-social-conflict-sensible',
    templateUrl: 'download-social-conflict-sensible.component.html',
    styleUrls: [
        'download-social-conflict-sensible.component.css'
    ]
})

export class DownloadSocialConflictSensibleComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<{ data: DownloadSocialConflict, parameter: any }> = new EventEmitter<{ data: DownloadSocialConflict, parameter: any }>();

    title: string;
   
    active: boolean = false;
    saving: boolean = false;

    data: DownloadSocialConflict = new DownloadSocialConflict();

    private parameter: any;

    formats = {
        pdf: { type: ReportType.PDF, enabled: true },
        xlsx: { type: ReportType.XLSX, enabled: true },
        html: { type: ReportType.HTML, enabled: true },
        docx: { type: ReportType.DOCX, enabled: true }
    }

    

    constructor(_injector: Injector) {
        super(_injector);

        this.data.format =ReportType.PDF;
        this.data.bolNameCase = true;
        this.data.bolLocation = true;
        this.data.bolBackground = true;
        this.data.bolDemand = true;
        this.data.bolAccions = true;
        this.data.bolCurrentSituation = true;
        this.data.bolRecommendations = true;
        this.data.bolCommitments = true;
        this.data.bolSectors = true;
    }

    show(title: string, parameter: any, format: ReportType): void {
        this.title = title;
        this.parameter = parameter;
        this.data.format = format;
        this.active = true;
        this.modal.show();
    }

    onShown(): void {

    }

    save() {
       
        this.modalSave.emit({ data: this.data, parameter: this.parameter });
        this.modal.hide();
    }

    close(): void {
        this.active = false;
        this.saving = false;
        this.modal.hide();
    }
}