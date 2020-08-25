/*
 *	Strato di controller tra LayersSidebar.tsx e il server WMS
 *	Gestisce i dati presi dal server e li passa allo strato Presentation
 *	
 *	LayersSidebar.tsx -> layer-wms.ts -> rest-service.ts -> serverWMS
 */

// SERVICES
import rest from '../../services/rest-service';
import { xmlParser } from '../../utils/xml-parser';

// MODEL
import BoundingBox from '../entity/bounding-box';
import Layer from '../entity/layer';

// TYPES
import HttpResponse from '../../types/http-response';

// URLS
import urls from '../../const/urls';


class LayersWMS {

	public constructor() {

	}

	async fetchData(): Promise<Layer[]> {

		let subLayers: Layer[] = new Array<Layer>();

		await rest.get(urls.serverWMS.getCapabilities).then((response: HttpResponse) => {

			let wmsResponseXML = xmlParser.getXML(response.payload);
			let mainLayersHTML;
			let subLayersHTML;
		
			if (wmsResponseXML != null) {

				mainLayersHTML = wmsResponseXML.querySelector("WMS_Capabilities > Capability > Layer");
				
				if (mainLayersHTML !== null) { 
					
					subLayersHTML = mainLayersHTML.getElementsByTagName("Layer");
					
					// FETCH SubLayer
					if (subLayersHTML !== null) { 
						
						for (let i=0; i<subLayersHTML.length; i++) {
			
							let layerID = this.generateRandomID();
							let subLayerObj: Layer = {
			
								id: layerID,
								isQueryable : Number(subLayersHTML[i].getAttribute("queryable")),
								name : subLayersHTML[i].getElementsByTagName("Name")[0].textContent,
								abstract : subLayersHTML[i].getElementsByTagName("Abstract")[0].textContent,
								boundingBox : new Array<BoundingBox>(),
								style : {
									name: subLayersHTML[i].getElementsByTagName("Style")[0].getElementsByTagName("Name")[0].textContent,
									title: subLayersHTML[i].getElementsByTagName("Style")[0].getElementsByTagName("Title")[0].textContent,
									legendUrl: subLayersHTML[i].getElementsByTagName("Style")[0].getElementsByTagName("LegendURL")[0].getElementsByTagName("OnlineResource")[0].getAttribute("xlink:href"),
									legendFormat: subLayersHTML[i].getElementsByTagName("Style")[0].getElementsByTagName("LegendURL")[0].getElementsByTagName("Format")[0].textContent,
									width: subLayersHTML[i].getElementsByTagName("Style")[0].getElementsByTagName("LegendURL")[0].getAttribute("width"),
									height: subLayersHTML[i].getElementsByTagName("Style")[0].getElementsByTagName("LegendURL")[0].getAttribute("height"),
								},
								minScaleDenominator : "",
								maxScaleDenominator : "",
								index: i,
								isSelected: false,
							};
			
							// BoundingBox HTML
							let boundingBoxHTML = subLayersHTML[i].getElementsByTagName("BoundingBox");
							for (let j=0; j<boundingBoxHTML.length; j++) {
			
								subLayerObj.boundingBox.push({
									crs: boundingBoxHTML[j].getAttribute("CRS"),
									westBoundLongitude: (Number) (boundingBoxHTML[j].getAttribute("minx")),
									eastBoundLongitude: (Number) (boundingBoxHTML[j].getAttribute("maxx")),
									southBoundLatitude: (Number) (boundingBoxHTML[j].getAttribute("miny")),
									northBoundLatitude: (Number) (boundingBoxHTML[j].getAttribute("maxy"))
								});
							}
							
							// MinScaleDenominator HTML
							if (subLayersHTML[i].getElementsByTagName("MinScaleDenominator")[0] !== undefined)
								subLayerObj.minScaleDenominator = subLayersHTML[i].getElementsByTagName("MinScaleDenominator")[0].textContent;
			
							// MaxScaleDenominator HTML
							if (subLayersHTML[i].getElementsByTagName("MaxScaleDenominator")[0] !== undefined)
								subLayerObj.maxScaleDenominator = subLayersHTML[i].getElementsByTagName("MaxScaleDenominator")[0].textContent;
							
							subLayers.push(subLayerObj);
						}
					}
				}
			}
		});

		return subLayers;
	}

	private generateRandomID = (): string => {

		return "layer-" + ((new Date()).getTime()) + "-" + (Math.random());
	}
}

// SINGLETON
// Export an instance of the class directly
export default new LayersWMS();