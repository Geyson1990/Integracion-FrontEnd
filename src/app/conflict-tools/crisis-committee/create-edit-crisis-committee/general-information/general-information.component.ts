import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CrisisCommitteeDto, CrisisCommitteeFocalPoint, CrisisCommitteePersonDto, CrisisCommitteeTeamLocationDto, CrisisCommitteeUserDto } from '@shared/service-proxies/application/crisis-committee-proxie';
import { LazyLoadEvent, Paginator } from 'primeng';
import * as moment from 'moment';
import { now } from 'lodash';
import { userReniecSunatProxy } from '@shared/service-proxies/application/user-reniec-sunar-proxie';
import { name } from 'msal/lib-commonjs/packageMetadata';
import { ElementScrollController } from '@fullcalendar/core';

@Component({
    selector: 'general-information-crisis-committee',
    templateUrl: 'general-information.component.html',
    styleUrls: [
        'general-information.component.css'
    ]
})
export class GeneralInformationCrisisCommitteeComponent extends AppComponentBase implements OnInit {

    private _crisisCommittee: CrisisCommitteeDto;

    @ViewChild('paginator', { static: true }) paginator: Paginator;

    get crisisCommittee(): CrisisCommitteeDto {
        return this._crisisCommittee;
    }

    @Input() set crisisCommittee(value: CrisisCommitteeDto) {
        this._crisisCommittee = value;
        
        if (this._crisisCommittee.crisisCommitteeTime) {
            this.crisisCommitteeTime = this._crisisCommittee.crisisCommitteeTime.toDate();
        }
        const dateErrorFormatted = moment('0001-01-01', 'YYYY-MM-DD').format('YYYY/MM/DD');
        if (this._crisisCommittee.crisisComiteStartTime.format('YYYY/MM/DD') !== dateErrorFormatted) {
            this.crisisComiteStartTime = this._crisisCommittee.crisisComiteStartTime.toDate();
        } else {
            this.crisisComiteStartTime = null;
        }
        if (this._crisisCommittee.crisisComiteEndTime.format('YYYY/MM/DD') !== dateErrorFormatted) {
            this.crisisComiteEndTime = this._crisisCommittee.crisisComiteEndTime.toDate();
        } else {
            this.crisisComiteEndTime = null;
        }

    }

    get finalCode(): string {
        return (this.crisisCommittee.replaceCount ? this.crisisCommittee.replaceCount : '') + ' - ' +
            (this.crisisCommittee.replaceYear ? this.crisisCommittee.replaceYear : '');
    }

    get interventionPlanTitle(): string {
        if (this.crisisCommittee.interventionPlan)
            return `${this.crisisCommittee.interventionPlan.code} - ${this.crisisCommittee.interventionPlan.caseName}`;

        return 'Presione el botón de búsqueda para seleccionar un plan de intervención';
    }

    @Input() persons: CrisisCommitteePersonDto[];

    crisisCommitteeTime: Date;
    crisisComiteStartTime: Date;
    crisisComiteEndTime: Date;




    @Output() addTeam: EventEmitter<void> = new EventEmitter<void>();
    @Output() editTeam: EventEmitter<{ index: number, value: CrisisCommitteeTeamLocationDto }> = new EventEmitter<{ index: number, value: CrisisCommitteeTeamLocationDto }>();
    @Output() showInterventionPlanSearch: EventEmitter<void> = new EventEmitter<void>();

    private skipCount: number = 0;
    private maxResultCount: number = 0;

    constructor(_injector: Injector, private _userInformation: userReniecSunatProxy) {
        super(_injector);
        this.primengTableHelper.defaultRecordsCountPerPage = 5;
        this.skipCount = 0;
        this.maxResultCount = this.primengTableHelper.defaultRecordsCountPerPage;
    }

    ngOnInit() {
        this.formatPagination(this.skipCount, this.maxResultCount);
    }

    getData(event?: LazyLoadEvent) {
        this.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
        this.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        this.formatPagination(this.skipCount, this.maxResultCount);
    }

    addOrUpdateItem(event: { value: CrisisCommitteeTeamLocationDto, index: number }) {
        if (event.index || event.index == 0) {
            this.crisisCommittee.teams[event.index] = event.value;
        } else {
            this.crisisCommittee.teams.push(event.value);
        }
        this.formatPagination(this.skipCount, this.maxResultCount);
    }

    editEvent(team: CrisisCommitteeTeamLocationDto, index: number) {
        this.editTeam.emit({ index: index, value: team });
    }

    removeItem(team: CrisisCommitteeTeamLocationDto, index: number) {
        if (team.id) {
            team.remove = true;
            this.notify.warn('Se ha marcado para eliminar el integrante del comité de crisis seleccionado');
        } else {
            this.crisisCommittee.teams.splice(index, 1);
            this.formatPagination(this.skipCount, this.maxResultCount);
        }
    }

    cancelRemove(team: CrisisCommitteeTeamLocationDto) {
        team.remove = false;
        this.notify.success('Se deshizo el marcado de eliminar del integrante del comité de crisis seleccionado');
    }

    processCrisisCommitteeTime(): boolean {
        if (!this.crisisCommitteeTime || (<any>this.crisisCommitteeTime == 'Invalid Date')) {
            this.message.error('Debe seleccionar la fecha de elaboración antes de guardar los cambios', 'Aviso');
            return false;
        }

        this.crisisCommittee.crisisCommitteeTime = moment(this.crisisCommitteeTime);

        return true;
    }
    processcrisisComiteStartTime(): boolean {
        if (!this.crisisComiteStartTime || (<any>this.crisisComiteStartTime == 'Invalid Date')) {
            this.message.error('Debe seleccionar la fecha de Inicio antes de guardar los cambios', 'Aviso');
            return false;
        }
        var timeNow;
        timeNow = Date.now();
        if (this.crisisComiteStartTime >= timeNow) {
            this.message.error('La fecha de Inicio tiene que ser anterior a la fecha acual ', 'Aviso');
            this.crisisComiteStartTime = null;
            return false
        }
        this.crisisCommittee.crisisComiteStartTime = moment(this.crisisComiteStartTime);
        return true;
    }
    processcrisisComiteEndTime(): boolean {
        if (!this.crisisComiteEndTime || (<any>this.crisisComiteEndTime == 'Invalid Date')) {
            this.message.error('Debe seleccionar la fecha de fin antes de guardar los cambios', 'Aviso');
            return false;
        }
        if (this.crisisComiteStartTime > this.crisisComiteEndTime) {
            this.message.error('La fecha de fin tiene que ser posterior a la Fecha de Inicio ', 'Aviso');
            this.crisisComiteEndTime = null;
            return false
        }
        this.crisisCommittee.crisisComiteEndTime = moment(this.crisisComiteEndTime);
        return true;
    }

    addTeamEvent() {
        this.addTeam.emit();
    }

    findInterventionPlan() {
        this.showInterventionPlanSearch.emit();
    }

    removeInterventionPlan() {
        this.message.confirm('¿Esta seguro de eliminar el plan de intervención?', 'Aviso', confirmation => {
            if (confirmation) {
                this.crisisCommittee.interventionPlan = undefined;
            }
        });
    }

    getUserName(user: CrisisCommitteeUserDto): string {
        if (!user)
            return '';

        return (user.name ? user.name : '').trim() + ' ' + (user.surname ? user.surname : '').trim();
    }

    private formatPagination(skipCount: number, maxResultCount: number) {
        let index: number = 0;
        let result: number = 0;

        for (let item of this.crisisCommittee.teams) {
            item.isHidden = true;
            if (index >= skipCount && result < maxResultCount) {
                item.isHidden = false;
                result++;
            }
            index++;
        }
    }


}