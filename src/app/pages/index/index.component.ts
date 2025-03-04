import { Component } from '@angular/core';
import { FilterComponent } from '../../filter/filter.component';
import { MapComponent } from '../../map/map.component';
import { ApexOptions, NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: 'app-index',
  imports: [FilterComponent, MapComponent, NgApexchartsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {
  barChart: ApexOptions = {
    series: [
      {
        name: 'Ventas',
        data: [50, 80, 65]
      }
    ],
    chart: {
      type: 'bar',
      height: 350
    },
    xaxis: {
      categories: ['Enero', 'Febrero', 'Marzo']
    },
    colors: ['#5A67D8'],
    title: {
      text: 'Ventas Mensuales'
    }
  };

  donutChart: ApexOptions = {
    series: [40, 30, 30],
    chart: {
      type: 'donut',
      height: 350
    },
    labels: ['Producto A', 'Producto B', 'Producto C'],
    colors: ['#E53E3E', '#3182CE', '#38A169'],
    title: {
      text: 'Distribución de Productos'
    }
  };
}
