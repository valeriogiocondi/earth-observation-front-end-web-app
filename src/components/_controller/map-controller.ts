// REDUX - STORE
import reduxStore from '../_model/redux/redux-store';

// SERVICES
import rest from '../services/rest-service';

// MODEL
import Layer from '../_model/entity/layer';
import BoundingBox from '../_model/entity/bounding-box';

// TYPES
import HttpResponse from '../types/http-response';

// URLS
import urls from '../const/urls';

// OPEN LAYER
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';

// PROJ4
import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj';
import {register} from 'ol/proj/proj4';
import LayerGroup from 'ol/layer/Group';


class MapCustom {

    private map: any;
	private view: any; 
	private zoom: number;
	private location: any[];

    public constructor() {

		this.zoom = 5;
		this.location = [{center: [8.23, 46.86]}, {center: [400000, 650000]}];

		this.view = new View( {
			projection: 'EPSG:4326',
			center: this.location[0].center,
			zoom: this.zoom,
		});
		
		reduxStore.subscribe(() => {
			
			this.setLayer();
		});
	}
	
	public initMap = (): Map => {
		
		this.map = new Map({
			controls: [],
			layers: [
				new TileLayer({
					source: new OSM()
				}),
			],
			target: 'map',
			view: this.view
		});
		return this.map;
	}

	public setLayer = () => {

		/* 
		 *	Non esiste una funzione resetta tutt i livelli con una struttura nuova 
		 *
		 *	Passare tutta la struttura con Redux
		 */
		
		let layers: TileLayer[] = [];

		Object.assign([], reduxStore.getState().mapLayers).forEach((elem: Layer, index: number) => {

			if (elem.isSelected) {
			
				let tileWMS = new TileWMS({				
					url: urls.serverWMS.getMap,
					params: {
						'LAYERS': elem.name,
						'TILED': true
					}
				});
	
				layers.push(new TileLayer({ source: tileWMS }));
			}
		});

		layers.unshift(
			new TileLayer({ source: new OSM() }) 
		);

		this.map.setLayerGroup(
			new LayerGroup({
				layers: layers
			})
		);
	}

	public projectTo = (projectionSelected: BoundingBox, callback: any): void => {

		if (projectionSelected) {

			let projection = Object.assign([], projectionSelected);
			
			if (projection.crs != null) {
				
				rest.get("https://epsg.io/"+ (projection.crs.split(":")[1]) +".proj4").then((response: HttpResponse) => {
		
					if (projection.crs) {

						proj4.defs(projection.crs, response.payload);
						register(proj4);
						(getProjection(projection.crs)).setExtent([
							projection.westBoundLongitude,
							projection.southBoundLatitude,
							projection.eastBoundLongitude,
							projection.northBoundLatitude
						]);
					}
					
					this.updateView(projection);
					
				}).catch((error: string) => {
		
					callback();
				});
			}	
		}		
	}

	private updateView = (projection: any) => {

		this.view = new View({
			projection: projection.crs,
			center: this.location[1].center,
			zoom: this.view.getZoom()
		});
		this.map.setView(this.view);
	}

	public setZoomIn = () => {

		this.view.animate({ zoom: (this.view.getZoom() + 1) });
	}
	
	public setZoomOut = () => {

		this.view.animate({ zoom: (this.view.getZoom() - 1) });
	}
}

// SINGLETON
// Export an instance of the class directly
export default new MapCustom();