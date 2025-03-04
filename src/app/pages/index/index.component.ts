import { Component } from '@angular/core';
import { FilterComponent } from '../../filter/filter.component';
import { MapComponent } from '../../map/map.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-index',
  imports: [FilterComponent, MapComponent, BaseChartDirective],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {
  capasAConsultar =  [
    { nombre: "Últimas emergencias", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_emergencias/MapServer/0" },
    { nombre: "Activas", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_emergencias/MapServer/1" },
    { nombre: "Inactivas", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_emergencias/MapServer/2" },
    { nombre: "PNC_Operativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/1" },
    { nombre: "PNC_Inoperativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/2" },
    { nombre: "PNSU_Operativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/4" },
    { nombre: "PNSU_Inoperativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/5" },
    { nombre: "PNSR_Operativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/7" },
    { nombre: "PNSR_Inoperativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/8" },
    { nombre: "OTASS_Operativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/10" },
    { nombre: "OTASS_Inoperativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/11" },
    { nombre: "SEDAPAL_Operativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/13" },
    { nombre: "SEDAPAL_Inoperativo", url: "https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/14" }
  ]

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        label: 'Mensual',
        data: [65, 59, 80, 81, 56],
        backgroundColor: '#4A90E2',
      },
    ],
  };

  donutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Activos', 'Inactivos'],
    datasets: [
      {
        data: [300, 500],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  public donutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true, // Habilita la responsividad
    maintainAspectRatio: false, // Permite que el gráfico se ajuste al contenedor
    plugins: {
      legend: { position: 'top' }
    }
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true, // Habilita la responsividad
    maintainAspectRatio: false, // Permite que el gráfico se ajuste al contenedor
    plugins: {
      legend: { position: 'top' }
    }
  };
}
