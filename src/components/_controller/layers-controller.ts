// REDUX - ACTION_CREATORS
import { storeAllLayersAction, changeLegendLayerAction } from '../../components/_model/redux/actions/actions-creators';

// REDUX - STORE
import reduxStore from '../../components/_model/redux/redux-store';

// MODEL
import Layer from '../_model/entity/layer';


class LayersController {

    private reducer = "mapLayers";

    public constructor() {
        
    }

    public storeLayersList = (layersArray: Layer[]): void => {

        reduxStore.dispatch(
            storeAllLayersAction(layersArray)
        );
    }

    public markLayerAsSelected = (layerID: string, status: boolean): void => {

        /* 
         *  We can't use Map<string, Layer> to store into redux because 
         *  the reducer reset the state in input
         */

        let layersArray: Layer[] = Object.values(reduxStore.getState()[this.reducer]);
        for (let layer of layersArray) {

            if (layer.id === layerID) {

                layer.isSelected = !status;
                break;
            }
        }
        
        /* 
         *  After changes, we save the entire layers array into redux store
         */

        this.storeLayersList(layersArray);
    }

    public markAllLayersAsSelected = (status: boolean) => {

        let layersArray: Layer[] = Object.values(reduxStore.getState()[this.reducer]);
        for (let layer of layersArray) {

            layer.isSelected = status;
        }
        
        /* 
         *  After changes, we save the entire layers array into redux store
         */

        this.storeLayersList(layersArray);
    }

    public changeLegendLayer = (layerID: string) => {
        
        let layersArray: Layer[] = Object.values(reduxStore.getState()[this.reducer]);
        for (let layer of layersArray) {

            if (layer.id === layerID) {

                reduxStore.dispatch(
                    changeLegendLayerAction({style: layer.style, abstract: layer.abstract, openTabsContainer: true})
                );
                break;
            }
        }
    }

    public swapLayers = (indexSource: number, indexDestination: number) => {
        
        let layersArray: Layer[] = Object.values(reduxStore.getState()[this.reducer]);
        let layerTemp: Layer;

        // SWAP
        layerTemp = Object.assign({}, layersArray[indexSource]);
        layersArray[indexSource] = Object.assign({}, layersArray[indexDestination]);
        layersArray[indexDestination] = Object.assign({}, layerTemp);

        reduxStore.dispatch(
            storeAllLayersAction(layersArray)
        );
    }

    public subscribeToStore = (callback: any): any => {

		reduxStore.subscribe(() => {
            
            callback(reduxStore.getState().mapLayers);
		});
    }
}

// SINGLETON
// Export an instance of the class directly
export default new LayersController();