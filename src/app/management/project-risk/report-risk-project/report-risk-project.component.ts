import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PagedResultDtoOfProjectRiskListDto, ProjectRiskDto, ProjectRiskServiceProxy } from '@shared/service-proxies/application/project-risk-proxie';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng';
import { finalize } from 'rxjs/operators';

@Component({
  templateUrl: 'report-risk-project.component.html',
  styleUrls: ['report-risk-project.component.css']
})

export class ReportRiskProjectComponent extends AppComponentBase implements OnInit {

  constructor(_injector: Injector, private _projectRiskServiceProxy: ProjectRiskServiceProxy) { 
    super(_injector);
  }

  ngOnInit(): void {
    this.busy=false;
  }

  options : any ;
  busy: boolean = true;

  data: PagedResultDtoOfProjectRiskListDto = null;
  dateRange: Date[] = [moment().startOf('month').toDate(), moment().endOf('day').toDate()];

  getData(event?: LazyLoadEvent) {
    this.busy = true; 
    setTimeout(() => {
        this.showMainSpinner('Cargando información. Por favor espere...');
    this.primengTableHelper.showLoadingIndicator();
    this._projectRiskServiceProxy
        .getReportRiskProject(
          moment(this.dateRange[0]).startOf('day'))
        .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
        .subscribe((result) => {
            this.data = result;
            this.primengTableHelper.hideLoadingIndicator();
            this.mapaCalorProject(result);
            this.busy = false; 
            setTimeout(() => this.hideMainSpinner(), 800);
        });
    }, 500);  
}


chartTypes = {
  mapa: 0
}

charts = {
  project: {
      type: this.chartTypes.mapa,
      mapa: undefined
  }
}


mapaCalorProject(detail: PagedResultDtoOfProjectRiskListDto) {
  let proyect = [];
  for (const dato of detail.items) {
    proyect.push(dato.name);
  };

  const ejeX = [0, 0.25, 0.50, 0.75, 1.00];
  const ejeY = [0, 0.25, 0.50, 0.75, 1.00];

  
  let dataparams = [];
  let datosCompara : any[] = []
  let datodato = generatedato(detail.items, ejeX, ejeY);
  datosCompara = generatedato(detail.items, ejeX, ejeY, true);
  console.log(datodato);
  console.log(datosCompara);


  this.options = {

    tooltip: {
      position: 'top',
      formatter: function (params) { 
        return 'El valor es ' + "<strong>" + params.data[2] + "</strong>" + ' en:  ' +  "<strong>" + params.data[3] + "</strong>";
      }
    },
    xAxis: {
      name: 'Impacto',
      type: 'category',
      data: ejeX//datosX
    },
    yAxis: {
      name: 'Probabilidad Riesgo',
      type: 'category',
      data: ejeY//datosY
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: true,
      realtime: true,
      inRange: {
        color: [
          '#008000',
          '#FFFF00',
          '#FF0000'
        ]
      }
    },
    series: [
      {
        label: {
          show: true,
          formatter: function (params) {
             for (const item of datosCompara) {
              if (item[0] == params.data[0]  && item[1] == params.data[1] && item[2] == params.data[2]) {
                params.data.push(item[3]);  
              }
             }
            return params.data[2] + "";
          },
        },
        name: "Riesgo",
        type: 'heatmap',
        data: datodato,
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowOffsetY: 5,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        progressive: 1,
        animation: false
      }
    ]
  };
}

}




function generatedato(data: ProjectRiskDto[], ejeX:any, ejeY: any, type:boolean = false) {
  
  let dato: number[][] = [];

  for (var item of data) {
    let datoEjes: any[] = [];
    let countX = 0;
    for (var detail of ejeX) {
      if (+item.impact < +detail) {
        datoEjes.push(countX);
        break;
      }
      countX = countX + 1;
    }
    let countY = 0;
    for (var detail of ejeY) {
      if (+item.probability < +detail) {
        datoEjes.push(countY);
        break;
      }
      countY = countY + 1;
    }

    datoEjes.push(item.value);
    if (type) {
      datoEjes.push(item.name);
    }
    dato.push(datoEjes);


    // const elementosFiltrados = dato.filter(elemento => {
    //   return elemento[0] === datoEjes[0] && elemento[1] === datoEjes[1];
    // });
    
    // if (elementosFiltrados.length > 0) {
    //     elementosFiltrados[0][2] += item.value;
    // } else {
    //   dato.push(datoEjes);
    // }    
  }
  return dato;
}
