import React, { Fragment } from 'react';

// CONTROLLER
import mapController from '../../../_controller/map-controller';

// TYPES
import Layer from '../../../types/layer';

// CSS
import './Home.less';

// CUSTOM REACT COMPONENT
import ControlsBar from './controls/controls-bar/ControlsBar';
import LayersSidebar from './controls/layers-sidebar/LayersSidebar';
import LegendWidget from './controls/legend-widget/LegendWidget';
import ProjectionTooltip from './controls/projection-tooltip/ProjectionTooltip';


type HomeState = {
	responseCall: string
	url: string
	resultWMS: string
	name: string
	mainLayer: Layer,
	mapStyle: {
		height: string,
		width: string,
	}
}

class Home extends React.Component<{}, HomeState> {

	constructor(props: {}) {
    
		super(props);
		this.state = {
            responseCall: "--",
			url: "fakeURL",
			resultWMS: "",
			name: "",
			mainLayer: undefined,
			mapStyle: {
				width: window.innerWidth+"px",
				height: window.innerHeight+"px",
			}
		}
    }

    componentWillMount() {

		window.addEventListener('resize', () => {
			
			this.setState({ 
				mapStyle: {
					width: window.innerWidth+"px",
					height: window.innerHeight+"px",
				} 
			});
		});
    }

    componentDidMount() {

		mapController.initMap();
	}
	
	render() {

		return (
			<Fragment>
				<div id="map" style={ this.state.mapStyle }></div>
				<LegendWidget></LegendWidget>
				<ProjectionTooltip
					projectTo={ mapController.projectTo.bind(mapController) }
				>
				</ProjectionTooltip>
				<ControlsBar 
					zoomInMap={ mapController.setZoomIn.bind(mapController) }
					zoomOutMap={ mapController.setZoomOut.bind(mapController) }
				>
				</ControlsBar>
				<LayersSidebar></LayersSidebar>
			</Fragment>
        );
    }
}

export default Home;