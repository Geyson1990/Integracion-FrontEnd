import { Component, Injector, OnDestroy, OnInit, ViewChild, Renderer2, AfterContentInit, OnChanges, SimpleChanges, DoCheck, AfterViewChecked } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PortalServiceProxy, PortalSocialConflictAlertRiskDto, PortalSocialConflictAlertSectorDto, PortalSocialConflictAlertStateDto, PortalSocialConflictAlertTerritorialUnitDto, PortalSocialConflictAlertTypologyDto } from '@shared/service-proxies/application/portal-proxie';
import { LazyLoadEvent, Paginator, UIChart } from 'primeng';
import { Subscription } from 'rxjs';
import { DashboardComponentBase } from '../dashboard-shared/dashboard.component';
import { SharedWindow } from '../dashboard-shared/dashboard.service';
import { CanvasJS } from '@canvasjs/angular-charts';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { ExportImagenToFileProxy } from '@shared/service-proxies/application/export-imagen-to-file-proxie';
import { finalize } from 'rxjs/operators';



@Component({
    templateUrl: 'dashboard-social-conflict-alert.component.html',
    styleUrls: [
       '../dashboard.style.css'
    ], animations: [
        appModuleAnimation()
    ]
})
export class DashboardSocialConflictAlertComponent extends DashboardComponentBase implements OnInit, OnDestroy {
    
    @ViewChild('territorialUnitPaginator', { static: true }) territorialUnitPaginator: Paginator;
    @ViewChild('typologyPaginator', { static: true }) typologyPaginator: Paginator;
    @ViewChild('risksPaginator', { static: true }) risksPaginator: Paginator;
    @ViewChild('sectorsPaginator', { static: true }) sectorsPaginator: Paginator;
    @ViewChild('statesPaginator', { static: true }) statesPaginator: Paginator;    

    @ViewChild('chart') chartCons: UIChart;

    isBusyChart: boolean = true;
    isLoading: boolean = true;

    risks: PortalSocialConflictAlertRiskDto[] = [];
    sectors: PortalSocialConflictAlertSectorDto[] = [];
    states: PortalSocialConflictAlertStateDto[] = [];
    territorialUnits: PortalSocialConflictAlertTerritorialUnitDto[] = [];
    typologies: PortalSocialConflictAlertTypologyDto[] = [];

    summaries = {
        territorialUnits: 0,
        typologies: 0,
        risks: 0,
        sectors: 0,
        states: 0
    }

    paginations = {
        territorialUnits: {
            maxResultCount: 10,
            skipCount: 0
        },
        typologies: {
            maxResultCount: 10,
            skipCount: 0
        },
        risks: {
            maxResultCount: 10,
            skipCount: 0
        },
        sectors: {
            maxResultCount: 10,
            skipCount: 0
        },
        states: {
            maxResultCount: 10,
            skipCount: 0
        }
    }


    charts = {
        territorialUnits: {
            type: this.chartTypes.pie,
            pie: undefined,
            bar: undefined
        },
        typologies: {
            type: this.chartTypes.pie,
            pie: undefined,
            bar: undefined
        },
        risks: {
            type: this.chartTypes.pie,
            pie: undefined,
            bar: undefined
        },
        sectors: {
            type: this.chartTypes.pie,
            pie: undefined,
            bar: undefined
        },
        states: {
            type: this.chartTypes.pie,
            pie: undefined,
            bar: undefined
        }
    }

    private subscription: Subscription;

    constructor(_injector: Injector, private _portalServiceProxy: PortalServiceProxy,
        private _exportImagenToFileProxy : ExportImagenToFileProxy,
        private _fileDownloadService: FileDownloadService) {
        super(_injector);
    }
    
    territorialUnitsChart = [];
    territorialUnitsChartBar = [];
    tipologiaUnitsChart = [];
    tipologiaUnitsChartBar  = [];
    RiesgoUnitsChart  = [];
    RiesgoUnitsChartBar  = [];
    SectoresUnitsChart  = [];
    SectoresUnitsChartBar  = [];
    StatesUnitsChart  = [];
    StatesUnitsChartBar  = [];


 
    ngOnInit(): void {
        this.subscription = this.shared.refresh.subscribe(response => {
            if (response == SharedWindow.All || response == SharedWindow.Social_Conflict_Alert)
                this.loadInformation();
        })
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
    
    exportImage(getById:string, type:any){
        const div = document.querySelector("#"+getById);
        const canvas = div.querySelector("canvas") as HTMLCanvasElement;
        
        var result= canvasToBase64Png(canvas);
        if (type == 1) {
            var nameImage = "Alertas_Situaciones_UnidadTerritorialPie"
        } else if (type == 2) {
            var nameImage = "Alertas_Situaciones_UnidadTerritorialBar"
        }
        else if (type == 3) {
            var nameImage = "Alertas_Situaciones_TipologiaPie"
        }
        else if (type == 4) {
            var nameImage = "Alertas_Situaciones_TipologiaBar"
        }
        else if (type == 5) {
            var nameImage = "Alertas_Situaciones_RiesgoPie"
        }
        else if (type == 6) {
            var nameImage = "Alertas_Situaciones_RiesgoBar"
        }
        else if (type == 7) {
            var nameImage = "Alertas_Situaciones_SectoresPie"
        }
        else if (type == 8) {
            var nameImage = "Alertas_Situaciones_SectoresBar"
        }
        else if (type == 9) {
            var nameImage = "Alertas_Situaciones_EstadoCierrePie"
        }
        else if (type == 10) {
            var nameImage = "Alertas_Situaciones_EstadoCierreBar"
        }
        
        this._exportImagenToFileProxy.getImageToExcel(result, nameImage
        ).pipe(finalize(() => {
            this.primengTableHelper.hideLoadingIndicator();
        })).subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }

    loadInformation() {
        this._portalServiceProxy
            .getAllSocialConflictAlerts(
                this.shared.filters.territorialUnitId == -1 ? undefined : this.shared.filters.territorialUnitId,
                this.shared.filters.departmentId == -1 ? undefined : this.shared.filters.departmentId,
                this.shared.filters.provinceId == -1 ? undefined : this.shared.filters.provinceId,
                this.shared.filters.districtId == -1 ? undefined : this.shared.filters.districtId,
                this.shared.filters.conflictId == -1 ? undefined : this.shared.filters.conflictId)
            .subscribe(response => {
                
                this.risks = response.risks;
                this.sectors = response.sectors;
                this.states = response.states;
                this.territorialUnits = response.territorialUnits;
                this.typologies = response.typologies;
                
                this.loadRiskInformation();
                this.loadSectorInformation();
                this.loadStateInformation();
                this.loadTerritorialUnitInformation();
                this.loadTypologyInformation();

                this.isBusyChart = false;
                this.isLoading = false;
                
            }); 
            
    }
    explodePie (e) {
        if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
        } else {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
        }
        e.chart.render();
    }        

    getTerritorialUnits(event?: LazyLoadEvent) {
        this.paginations.territorialUnits.maxResultCount = this.primengTableHelper.getMaxResultCount(this.territorialUnitPaginator, event);
        this.paginations.territorialUnits.skipCount = this.primengTableHelper.getSkipCount(this.territorialUnitPaginator, event);
        this.formatTerritorialUnits(this.paginations.territorialUnits.skipCount, this.paginations.territorialUnits.maxResultCount);
    }

    getTypologies(event?: LazyLoadEvent) {
        this.paginations.typologies.maxResultCount = this.primengTableHelper.getMaxResultCount(this.typologyPaginator, event);
        this.paginations.typologies.skipCount = this.primengTableHelper.getSkipCount(this.typologyPaginator, event);
        this.formatTypologies(this.paginations.typologies.skipCount, this.paginations.typologies.maxResultCount);
    }

    getRisks(event?: LazyLoadEvent) {
        this.paginations.risks.maxResultCount = this.primengTableHelper.getMaxResultCount(this.risksPaginator, event);
        this.paginations.risks.skipCount = this.primengTableHelper.getSkipCount(this.risksPaginator, event);
        this.formatRisks(this.paginations.risks.skipCount, this.paginations.risks.maxResultCount);
    }

    getSectors(event?: LazyLoadEvent) {
        this.paginations.sectors.maxResultCount = this.primengTableHelper.getMaxResultCount(this.sectorsPaginator, event);
        this.paginations.sectors.skipCount = this.primengTableHelper.getSkipCount(this.sectorsPaginator, event);
        this.formatSectors(this.paginations.sectors.skipCount, this.paginations.sectors.maxResultCount);
    }

    getStates(event?: LazyLoadEvent) {
        this.paginations.states.maxResultCount = this.primengTableHelper.getMaxResultCount(this.statesPaginator, event);
        this.paginations.states.skipCount = this.primengTableHelper.getSkipCount(this.statesPaginator, event);
        this.formatStates(this.paginations.states.skipCount, this.paginations.states.maxResultCount);
    }

    private loadRiskInformation() {
        if (this.risks.length > this.primengTableHelper.defaultRecordCountPerPie) {
            this.charts.risks.type = this.chartTypes.bar;
            this.charts.risks.bar = {
                labels: this.risks.map(p => p.name),
                datasets: [
                    {
                        label: 'Niveles de riesgo',
                        tooltipLabels: this.risks.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.risks) * 100, 2), 0) + '% '),
                        data: this.risks.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };                        
        } else {
            this.charts.risks.type = this.chartTypes.pie;
            this.charts.risks.pie = {
                totals: this.summaries.risks,
                labels: this.risks.map(p => p.name),
                tooltipLabels: this.risks.map(p => this.formatNumber(this.roundNumber((p.count / this.summaries.risks) * 100, 2), 0) + '% '),
                outLabels: this.risks.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.risks) * 100, 2), 0) + '% '),
                datasets: [
                    {
                        data: this.risks.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };               
        }
        this.formatRisks(this.paginations.risks.skipCount, this.paginations.risks.maxResultCount);
    }

    private loadSectorInformation() {
        this.summaries.sectors = this.sectors.reduce((l, c) => c.count + l, 0);
        if (this.sectors.length > this.primengTableHelper.defaultRecordCountPerPie) {
            this.charts.sectors.type = this.chartTypes.bar;
            this.charts.sectors.bar = {
                labels: this.sectors.map(p => p.name),
                datasets: [
                    {
                        label: 'Atención a los sectores',
                        tooltipLabels: this.sectors.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.sectors) * 100, 2), 0) + '% '),
                        data: this.sectors.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };
        } else {
            this.charts.sectors.type = this.chartTypes.pie;
            this.charts.sectors.pie = {
                totals: this.summaries.sectors,
                labels: this.sectors.map(p => p.name),
                tooltipLabels: this.sectors.map(p => this.formatNumber(this.roundNumber((p.count / this.summaries.sectors) * 100, 2), 0) + '% '),
                outLabels: this.sectors.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.sectors) * 100, 2), 0) + '% '),
                datasets: [
                    {
                        data: this.sectors.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };
        }

        this.formatSectors(this.paginations.sectors.skipCount, this.paginations.sectors.maxResultCount);
    }

    private loadStateInformation() {
        this.summaries.states = this.states.reduce((l, c) => c.count + l, 0);

        if (this.states.length > this.primengTableHelper.defaultRecordCountPerPie) {
            this.charts.states.type = this.chartTypes.bar;
            this.charts.states.bar = {
                labels: this.states.map(p => p.name),
                datasets: [
                    {
                        label: 'Estados de cierre',
                        tooltipLabels: this.states.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.states) * 100, 2), 0) + '% '),
                        data: this.states.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };

            this.StatesUnitsChartBar = [];
            for (var i of this.states) {
                this.StatesUnitsChartBar.push(
                    {    name:i.name,
                         y:i.count,
                         indexLabel: i.count + '; ' + this.formatNumber(this.roundNumber((i.count / this.summaries.states) * 100, 2), 0) + "%",
                         label: i.name
                    }
                )
            }
        } else {
            this.charts.states.type = this.chartTypes.pie;
            this.charts.states.pie = {
                totals: this.summaries.states,
                labels: this.states.map(p => p.name),
                tooltipLabels: this.states.map(p => this.formatNumber(this.roundNumber((p.count / this.summaries.states) * 100, 2), 0) + '% '),
                outLabels: this.states.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.states) * 100, 2), 0) + '% '),
                datasets: [
                    {
                        data: this.states.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };
        }

        this.formatStates(this.paginations.states.skipCount, this.paginations.states.maxResultCount);
    }

    private loadTerritorialUnitInformation() {
        this.territorialUnitsChart = [];
        this.territorialUnitsChartBar = [];
        this.summaries.territorialUnits = this.territorialUnits.reduce((l, c) => c.count + l, 0);

        if (this.territorialUnits.length > this.primengTableHelper.defaultRecordCountPerPie) {
            this.charts.territorialUnits.type = this.chartTypes.bar;
            this.charts.territorialUnits.bar = {
                labels: this.territorialUnits.map(p => p.name),
                datasets: [
                    {
                        label: 'Unidades territoriales',
                        tooltipLabels: this.territorialUnits.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.territorialUnits) * 100, 2), 0) + '% '),
                        data: this.territorialUnits.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            }; 
        
        } else {
            this.charts.territorialUnits.type = this.chartTypes.pie;
            this.charts.territorialUnits.pie = {
                totals: this.summaries.territorialUnits,
                labels: this.territorialUnits.map(p => p.name),
                tooltipLabels: this.territorialUnits.map(p => this.formatNumber(this.roundNumber((p.count / this.summaries.territorialUnits) * 100, 2), 0) + '% '),
                outLabels: this.territorialUnits.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.territorialUnits) * 100, 2), 0) + '% '),
                datasets: [
                    {
                        data: this.territorialUnits.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };
            for (var i of this.territorialUnits) {
                this.territorialUnitsChart.push(
                    {    
                         name:i.name,
                         y:i.count,
                         indexLabel: i.count + '; ' + this.formatNumber(this.roundNumber((i.count / this.summaries.territorialUnits) * 100, 2), 0) + "%",
                         label: i.name,
                         exploded: true 
                    }
                )
            }
        }
        this.formatTerritorialUnits(this.paginations.territorialUnits.skipCount, this.paginations.territorialUnits.maxResultCount);
    }

    private loadTypologyInformation() {
        this.summaries.typologies = this.typologies.reduce((l, c) => c.count + l, 0);

        if (this.typologies.length > this.primengTableHelper.defaultRecordCountPerPie) {
            this.charts.typologies.type = this.chartTypes.bar;
            this.charts.typologies.bar = {
                labels: this.typologies.map(p => p.name),
                datasets: [
                    {
                        label: 'Tipologías',
                        tooltipLabels: this.typologies.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.typologies) * 100, 2), 0) + '% '),
                        data: this.typologies.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };   

        } else {
            this.charts.typologies.type = this.chartTypes.pie;
            this.charts.typologies.pie = {
                totals: this.summaries.typologies,
                labels: this.typologies.map(p => p.name),
                tooltipLabels: this.typologies.map(p => this.formatNumber(this.roundNumber((p.count / this.summaries.typologies) * 100, 2), 0) + '% '),
                outLabels: this.typologies.map(p => p.count + '; ' + this.formatNumber(this.roundNumber((p.count / this.summaries.typologies) * 100, 2), 0) + '% '),
                datasets: [
                    {
                        data: this.typologies.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };
        }

        this.formatTypologies(this.paginations.typologies.skipCount, this.paginations.typologies.maxResultCount);
    }

    private formatTerritorialUnits(skipCount: number, maxResultCount: number) {
        let index: number = 0;
        let result: number = 0;
        for (let item of this.territorialUnits) {
            item.isHidden = true;
            if (index >= skipCount && result < maxResultCount) {
                item.isHidden = false;
                result++;
            }
            index++;
        }
    }

    private formatTypologies(skipCount: number, maxResultCount: number) {
        let index: number = 0;
        let result: number = 0;
        for (let item of this.typologies) {
            item.isHidden = true;
            if (index >= skipCount && result < maxResultCount) {
                item.isHidden = false;
                result++;
            }
            index++;
        }
    }

    private formatRisks(skipCount: number, maxResultCount: number) {
        let index: number = 0;
        let result: number = 0;
        for (let item of this.risks) {
            item.isHidden = true;
            if (index >= skipCount && result < maxResultCount) {
                item.isHidden = false;
                result++;
            }
            index++;
        }
    }

    private formatSectors(skipCount: number, maxResultCount: number) {
        let index: number = 0;
        let result: number = 0;
        for (let item of this.sectors) {
            item.isHidden = true;
            if (index >= skipCount && result < maxResultCount) {
                item.isHidden = false;
                result++;
            }
            index++;
        }
    }

    private formatStates(skipCount: number, maxResultCount: number) {
        let index: number = 0;
        let result: number = 0;
        for (let item of this.states) {
            item.isHidden = true;
            if (index >= skipCount && result < maxResultCount) {
                item.isHidden = false;
                result++;
            }
            index++;
        }
    }
}
export function canvasToBase64Png(canvas: HTMLCanvasElement): string {
    // Obtiene la imagen en base 64
    const dataUrl = canvas.toDataURL("image/png");
  
    // Devuelve la imagen en base 64
    return dataUrl;
  }