import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

import * as esri from 'esri-leaflet';

import 'leaflet/dist/leaflet.css';
import { QueryService } from '../query.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private quebradasLayer!: L.TileLayer.WMS;

  constructor(private readonly queryService: QueryService) {
  }

  // GeoJSON cuadrado de Perú
  private peruGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-81.326, -18.349], // Suroeste
          [-81.326, -0.039],  // Noroeste
          [-68.652, -0.039],  // Noreste
          [-68.652, -18.349], // Sureste
          [-81.326, -18.349]  // Cierre
        ]
      ]
    }
  } as any;

  // Lista de servicios a consultar
  private capasAConsultar = [
    {
      nombre: 'Últimas emergencias',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_emergencias/MapServer/0'
    },
    {
      nombre: 'Activas',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_emergencias/MapServer/1'
    },
    {
      nombre: 'Inactivas',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_emergencias/MapServer/2'
    },
    {
      nombre: 'PNC_Operativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/1'
    },
    {
      nombre: 'PNC_Inoperativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/2'
    },
    {
      nombre: 'PNSU_Operativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/4'
    },
    {
      nombre: 'PNSU_Inoperativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/5'
    },
    {
      nombre: 'PNSR_Operativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/7'
    },
    {
      nombre: 'PNSR_Inoperativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/8'
    },
    {
      nombre: 'OTASS_Operativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/10'
    },
    {
      nombre: 'OTASS_Inoperativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/11'
    },
    {
      nombre: 'SEDAPAL_Operativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/13'
    },
    {
      nombre: 'SEDAPAL_Inoperativo',
      url: 'https://portalgis.vivienda.gob.pe/servergis/rest/services/OGEI/Mapa_visor_maquinarias_gps/MapServer/14'
    }
  ];

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-9.19, -75.0152], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    // Agregar GeoJSON de Perú
    const baseLayer = L.geoJSON(this.peruGeoJSON, {
      style: {
        color: '#ff7800',
        weight: 2,
        fillOpacity: 0,
      }
    }).addTo(this.map);

    // Consultar servicios
    this.consultarAServicio(this.peruGeoJSON).then(capas => {
      this.agregarCapasConIconos(capas).then();
    });

    this.quebradasLayer = L.tileLayer.wms(
      'https://idesep.senamhi.gob.pe/geoserver/g_acti_quebrada/wms',
      {
        layers: 'g_acti_quebrada:view_av_activ_qdra',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: 'SENAMHI'
      }
    );

    const baseMaps = {
      'Mapa base': baseLayer
    };

    const overlayMaps = {
      "A. de Quebradas - SENAMHI": this.quebradasLayer
    };

    L.control.layers(baseMaps, overlayMaps).addTo(this.map);
    this.quebradasLayer.addTo(this.map);
  }

  private async consultarAServicio(geojson: any): Promise<{
    url: string;
    capa: any
  }[]> {
    const queries = this.capasAConsultar.map(({url}) => {
      return {
        url,
        query: new Promise<any>((resolve, reject) => {
          esri
            .query({url})
            .intersects(geojson)
            .fields(['*'])
            .run((error: any, featureCollection: any) => {
              if (error) reject(error);
              else resolve(featureCollection);
            });
        })
      };
    });

    const capas = await Promise.all(queries.map(({query}) => query));
    return queries.map(({url}, index) => ({
      url,
      capa: capas[index]
    }));
  }

  private async agregarCapasConIconos(capas: { url: string; capa: GeoJSON.FeatureCollection }[]): Promise<void> {
    for (const capa of capas) {
      try {
        const response = await this.queryService.search(capa.url);
        const imageData = response?.drawingInfo?.renderer?.symbol?.imageData;

        if (!imageData) {
          console.warn('No se encontró imageData para la capa:', capa.url);
          continue;
        }

        const iconUrl = `data:image/png;base64,${imageData}`;
        const icon = L.icon({
          iconUrl,
          iconSize: [25, 25]
        });

        L.geoJSON(capa.capa, {
          pointToLayer: (feature, latlng) => {
            const marker = L.marker(latlng, {icon});
            const properties = feature.properties || {};
            let tableHTML = '<table border="1"><tr><th>Campo</th><th>Valor</th></tr>';

            for (const key in properties) {
              if (Object.prototype.hasOwnProperty.call(properties, key)) {
                tableHTML += `<tr><td>${key}</td><td>${properties[key]}</td></tr>`;
              }
            }
            tableHTML += '</table>';

            marker.bindPopup(tableHTML);
            return marker;
          }
        }).addTo(this.map);
      } catch (error) {
        console.error('Error al procesar capa:', error);
      }
    }
  }
}
