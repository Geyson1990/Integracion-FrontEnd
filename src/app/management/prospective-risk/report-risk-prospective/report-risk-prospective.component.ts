import { AfterContentInit, AfterViewInit, Component, Injector, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PagedResultDtoOfProspectiveRiskListDto, ProspectiveRiskDetailReportDto, ProspectiveRiskDto, ProspectiveRiskServiceProxy } from '@shared/service-proxies/application/prospective-risk-proxie';
import * as moment from 'moment';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { finalize, debounceTime } from 'rxjs/operators';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartOutsideLabels from 'chartjs-plugin-piechart-outlabels';

import * as echarts from 'echarts';
import { ChartModule } from 'primeng/chart';


@Component({
  selector: 'app-report-risk-prospective',
  templateUrl: './report-risk-prospective.component.html',
  styleUrls: ['./report-risk-prospective.component.css']
})
export class ReportRiskProspectiveComponent extends AppComponentBase implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  busy: boolean = true;
  reportDetail: boolean = false;
  provinceId: any = 0;
  options: any = null;
  detalle:ProspectiveRiskDetailReportDto[];
  data: ProspectiveRiskDto[];
  provincia: any = null;
  dateRange: Date[] = [moment().startOf('month').toDate(), moment().endOf('day').toDate()];


  constructor(_injector: Injector, private _prospectiveRiskServiceProxy: ProspectiveRiskServiceProxy) {
    super(_injector);
    this.data = [];
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


  ngOnInit(): void {
    this.data = null;
}



 getData() {  
        this.busy = true; 
        // this.showMainSpinner('Cargando información. Por favor espere...');
        this.primengTableHelper.showLoadingIndicator();

        this._prospectiveRiskServiceProxy.getReportRiskProvince(
          moment(this.dateRange[0]).startOf('day')
        )
        .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.data = result.items;
            console.log(this.data);
            this.radarChart(result);
            this.primengTableHelper.hideLoadingIndicator();
            setTimeout(() => this.hideMainSpinner(), 500);
      });
      this.busy = false; 
}


radarChart(data: PagedResultDtoOfProspectiveRiskListDto) {
  const total: number = data.totalCount;
  this.charts.prospectivoProvincial.type = this.chartTypes.radar;
  this.charts.prospectivoProvincial.radar = {
    labels: data.items.map(p => p.province.name),
    datasets : [
      {
        label:'Riesgo Prospectivo Provincial',
        tooltipLabels: data.items.map(p => p.value),
        data: data.items.map(x => x.value),
        backgroundColor: this.backgroundColors(),
        hoverBackgroundColor: this.hoverBackgroundColor()
      }
    ]
  }
}


optionsRadarDefault: any = {
  legend: {
      display: true,
      position: 'bottom',
      align: 'center',
      labels: {
          boxWidth: 15
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
              console.log(context.chart.data.outLabels[context.dataIndex]);
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



optionsRadarDetailDefault: any = {
  legend: {
    position: 'bottom',
    align: 'center',
    labels: {
        boxWidth: 15
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
        display: true
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

 chartTypes = {
    radar: 0,
    detailradar: 1
}

  charts = {
    prospectivoProvincial: {
        type: this.chartTypes.radar,
        radar: undefined,
        radardetail: undefined
    }
}

selectData(event) {
  this.charts.prospectivoProvincial.type = this.chartTypes.detailradar;
  this.provinceId=event.element._index + 1;
  this.detalle = this.data.find(x => x.province.id == this.provinceId).prospectiveDetail;
  this.provincia = this.data.find(x => x.province.id == this.provinceId).province.name;
  console.log(this.detalle);

  let datosCuantitative = this.detalle.filter(x => x.typeVariable=="Cuantitative");
  let  datosCualitative = this.detalle.filter(x => x.typeVariable=="Cualitative");
  console.log(datosCuantitative);
  console.log(datosCualitative);
  this.charts.prospectivoProvincial.radardetail = {

    labels:  this.detalle.map(p => p.nameVariable.substr(0, 55)),
    
    datasets: [
        {
            label: "Cualitative",
            backgroundColor: this.backgroundColors(),
            hoverBackgroundColor: this.hoverBackgroundColor(),
            data: datosCualitative.map(x => x.value),
        },
        {
            label: "Cuantitative",
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            data: datosCuantitative.map(x => x.value),
        }
    ]
  }
}

retornarGraph() {
    this.detalle = null;
    this.charts.prospectivoProvincial.type == this.chartTypes.radar
    this.getData();
}

}

