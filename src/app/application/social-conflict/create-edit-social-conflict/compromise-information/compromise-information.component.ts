import { AfterViewInit, Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SocialConflictDto, SocialConflictServiceProxy } from '@shared/service-proxies/application/social-conflict-proxie';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize } from 'rxjs/operators';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartOutsideLabels from 'chartjs-plugin-piechart-outlabels';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DashboardServiceProxy, ReportDashboardStatusDto } from '@shared/service-proxies/application/dashboard-proxie';
import { OptionDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
    selector: 'compromise-information-social-conflict',
    templateUrl: 'compromise-information.component.html',
    styleUrls: [
        'compromise-information.component.css'
    ],
     animations: [
        appModuleAnimation()
    ]
    
})

export class CompromiseInformationSocialConflictComponent extends AppComponentBase implements AfterViewInit {
    
    private _busy: boolean;
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    
    @Input() get busy(): boolean {
        return this._busy;
    }

    set busy(value: boolean) {
        this._busy = value;
    }

    @Input() socialConflict: SocialConflictDto;
    @Input() hasPermission: boolean;
    
    filterText: string;

    chartTypes = {
        pie: 0,
        bar: 1
    }

    charts = {
        compromiseStates: {
            type: this.chartTypes.pie,
            pie: undefined,
            bar: undefined
        },
       
    }

    optionsPieDefault: any = {
        legend: {
            display: true,
            position: 'bottom',
            align: 'center',
            labels: {
                boxWidth: 15
            },
            onClick: (event: any, legendItem: any, legend: any) => {
            }
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem: any, data: any) => {
                    return `${data.labels[tooltipItem.index]}`;
                }
            }
        },
        layout: {
            padding: {
                left: 20,
                right: 20,
                bottom: 20,
                top: 40,
            },
        },
        plugins: {
            datalabels: {
                display: false
            },
            outlabels: {
                display: true,
                text: (context: any) => {
                    return `${context.chart.data.outLabels[context.dataIndex]}`;
                },
                color: 'white',
                stretch: 12,
                font: {
                    resizable: true,
                    minSize: 12,
                    maxSize: 12
                }
            }
        }
    };

    typeCompromise: OptionDto[] = [
        { name: 'PIP', value: 1 },
        { name: 'Actividad', value: 2 },
       
    ];

    typeSelected = -1;
    statusList = [];
    statusSelected = -1;

    dateRange: Date[] = [moment().startOf('month').toDate(), moment().endOf('day').toDate()];
    dateRangeFulfillment: Date[] = [moment().startOf('month').toDate(), moment().endOf('day').toDate()];


    constructor(_injector: Injector, private _socialConflictServiceProxy: SocialConflictServiceProxy
        , private _dashboardServiceProxy: DashboardServiceProxy) {
        super(_injector);


        Chart.pluginService.register({
            beforeDraw: (chart: any) => {

                if (chart.chart.config.type == 'horizontalBar')
                    return;

                if (!chart.chart.legend?.formatted) {
                    chart.chartArea.top = 100;
                    chart.chart.legend.defaultTop = chart.chart.legend.top;
                    chart.chart.legend.formatted = true;
                    chart.chart.legend.top = chart.chart.legend.defaultTop + 30;
                }
            }
        });

        Chart.plugins.register(ChartDataLabels);
        Chart.plugins.register(ChartOutsideLabels);
    }

    ngAfterViewInit(): void {
        this.primengTableHelper.adjustScroll(this.dataTable);
    }

    getData(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._socialConflictServiceProxy.getAllCompromises(
            this.filterText,
            this.socialConflict?.id,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });


        this._dashboardServiceProxy
        .GetAllCompromises(
            this.socialConflict?.id)
        .pipe(finalize(() => this.busy = false))
        .subscribe(response => {
            response.status = response.status.sort(p => p.count);
            this.statusList = response.statusList;

            this.formatStatus(response.status);
           
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }


    private formatStatus(data: ReportDashboardStatusDto[]) {
        const total: number = data.reduce((p, c) => p + c.count, 0);
        if (data.length > this.primengTableHelper.defaultRecordCountPerPie) {
            this.charts.compromiseStates.type = this.chartTypes.bar;
            this.charts.compromiseStates.bar = {
                labels: data.map(p => p.status),
                datasets: [
                    {
                        label: 'Total compromisos abiertos vs cerrados',
                        tooltipLabels: data.map(p => this.formatNumber(p.count, 0)),
                        data: data.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };
        } else {
            this.charts.compromiseStates.type = this.chartTypes.pie;
            this.charts.compromiseStates.pie = {
                totals: total,
                labels: data.map(p => p.status),
                tooltipLabels: data.map(p => this.formatNumber(p.count, 0)),
                outLabels: data.map(p => p.count),
                datasets: [
                    {
                        data: data.map(p => p.count),
                        backgroundColor: this.backgroundColors(),
                        hoverBackgroundColor: this.hoverBackgroundColor()
                    }
                ]
            };
        }
    }

}