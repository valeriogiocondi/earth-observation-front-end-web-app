import React, { Fragment } from 'react';

// CSS
import './ControlsBar.less';
import { Add, Layers, Remove, Transform } from '@material-ui/icons';
import mapController from '../../../../../_controller/map-controller';


type ControlsBarProps = {
	zoomInMap: any,
	zoomOutMap: any,
}

type ControlsBarState = {
	layersSidebarOpened: boolean,
}

export default class ControlsBar extends React.PureComponent<ControlsBarProps, ControlsBarState> {

	constructor(props: ControlsBarProps) {
    
		super(props);
		this.state = {
			layersSidebarOpened: false,
		}
		this.showProjections = this.showProjections.bind(this);
    }

	showLayers = () => {

		this.setState({layersSidebarOpened: !this.state.layersSidebarOpened}, () => {

			if (this.state.layersSidebarOpened) {

				document.getElementById("layers-sidebar").style.marginRight = "0px";
				document.getElementById("projections-tooltip").style.marginRight = "315px";
			}
			else {

				document.getElementById("layers-sidebar").style.marginRight = "-300px";
				document.getElementById("projections-tooltip").style.marginRight = "15px";
			}
		});
	}
	
	showProjections = () => {
		
		if (document.getElementById("projections-tooltip").style.visibility === "visible")
			document.getElementById("projections-tooltip").style.visibility = "hidden";
		else
			document.getElementById("projections-tooltip").style.visibility = "visible";
	}

	render() {
		
		let classStyle: string = '';
		if (this.state.layersSidebarOpened) classStyle = ' layers-sidebar-opened';

		return (
			<Fragment>
				<div id="controls-bar" className={ "over-map" + classStyle }>
					<ul className="list-group list-group-horizontal">
						<li className="list-group-item" onClick={ this.props.zoomOutMap.bind(mapController) } >
							<Remove />
						</li>
						<li className="list-group-item" onClick={ this.props.zoomInMap.bind(mapController) } >
							<Add />
						</li>
						<li className={"list-group-item " + classStyle} onClick={ this.showLayers } >
							<Layers />
						</li>
						<li className="list-group-item" onClick={ this.showProjections } >
							<Transform />
						</li>
					</ul>
				</div>
			</Fragment>
        );
    }
}