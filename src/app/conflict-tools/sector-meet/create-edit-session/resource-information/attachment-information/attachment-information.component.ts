import { Component, Injector } from '@angular/core';
import { SectorSessionStateService } from '@app/conflict-tools/sector-meet/shared/sector-session-state.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'attachment-information',
    templateUrl: 'attachment-information.component.html',
    styleUrls: [
        'attachment-information.component.css'
    ]
})
export class AttachmentInformationComponent extends AppComponentBase {

    state: SectorSessionStateService;

    constructor(_injector: Injector) {
        super(_injector);
        this.state = _injector.get(SectorSessionStateService);
    }

    removeAttachment(index: number) {
        this.message.confirm('¿Esta seguro de eliminar el registro seleccionado?', 'Aviso', confirmation => {
            if (confirmation) {
                this.state.sectorMeetSession.uploadFiles.splice(index, 1);
            }
        });
    }
}