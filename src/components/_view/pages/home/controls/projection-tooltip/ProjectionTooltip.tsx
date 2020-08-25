import React, { Fragment } from 'react';

// CONTROLLER
import projectionsController from '../../../../../_controller/projection-controller';

// TYPE
import BoundingBox from '../../../../../types/bounding-box';

// CSS
import './ProjectionTooltip.less';

// CUSTOM REACT COMPONENT
import Popup from '../../../../ui_components/popup/Popup';


/* 
 *	<ProjectionTooltip />
 */

type ProjectionTooltipProps = {
	projectTo: any,
}

type ProjectionTooltipState = {
	projectionsList: BoundingBox[],
	layersSidebarOpened: boolean,
	projectionSelectedID: string,
	openErrorPopup: any,
}

export default class ProjectionTooltip extends React.PureComponent<ProjectionTooltipProps, ProjectionTooltipState> {
	
	constructor(props: ProjectionTooltipProps) {
		
		super(props);
		this.state = {
			projectionsList: null,
			layersSidebarOpened: false,
			projectionSelectedID: '',
			openErrorPopup: null,
		}
	}
	
    componentDidMount() { 

		projectionsController.subscribeToStore((resultReduxStore: any) => {

			this.setState({ projectionsList: Object.values(resultReduxStore) });
		});
	}

	bindPopupFunc = (callback: any): void => {

		this.setState({ openErrorPopup: callback });
	}

	getProjectionID = (projectionID: string) => {

		/*
		 *	We get selected projection's ID
		 *  We need to apply selected-style just to one item
		 */		
		this.setState({ projectionSelectedID: projectionID}, () => {

			/*
			 *	Call to the effettive map-projetion
			 *	And passing to it CRS and Extent
			 */
			this.props.projectTo(
				projectionsController.getProjectionByID(projectionID),
				this.state.openErrorPopup.bind(this)
			);
		});
	}
	
	openPopup = () => {

		// this.setState({ popupShow: true });
	}
	
	// closePopup = () => {

	// 	this.setState({ popupShow: false });
	// }

	render() {
		
		let classStyle: string = '';
		if (this.state.layersSidebarOpened) classStyle = ' layers-sidebar-opened';
		
		let projectionsListJSON = [];
		if (this.state.projectionsList != null) {
			
			this.state.projectionsList.map((elem: BoundingBox) => {
						
				if (this.state.projectionSelectedID === elem.crs) {

					projectionsListJSON.push(
						<ProjectionList 
							id={elem.crs} 
							key={elem.crs} 
							selected={true} 
							giveProjectionID2Parent={this.getProjectionID} 
						/>
					);
				
				} else {

					projectionsListJSON.push(
						<ProjectionList 
							id={elem.crs} 
							key={elem.crs} 
							selected={false} 
							giveProjectionID2Parent={this.getProjectionID} 
						/>
					);
				}
			});
		}

		return (
			<Fragment>
				<Popup 
					message="Proiezione non disponibile"
					parentRef={ this.bindPopupFunc.bind(this) }
				/>
				<div id="projections-tooltip" className={ "over-map" + classStyle }>
					<div className="content">
						<ul className="list-group">
							{projectionsListJSON}
						</ul>
					</div>
					<div className="triangle"></div>
				</div>
			</Fragment>
        );
    }
}


/* 
 *	<ProjectionList />
 */

type ProjectionListProps = {
	id: string,
	selected: boolean,
	giveProjectionID2Parent: any,
}

type ProjectionListState = {
	projectionSelected: boolean,
}

class ProjectionList extends React.PureComponent<ProjectionListProps, ProjectionListState> {

	constructor(props: ProjectionListProps) {
    
		super(props);
		this.state = {
			projectionSelected: false,
		}
	}

	private selectProjection = (projectionID: string) => {
		
		/*
		 *	We JUST give the selected projection's ID to the parent component
		 *
		 *	Parent  component will be in charge to call map-projection
		 *	it will pass the entire BoundingBox structure, we haven't 
		 */		
		this.props.giveProjectionID2Parent(projectionID);

		this.setState({ projectionSelected: true }, () => {
		
			/*
			 *  Close the tooltip and sidebar
			*/			
			document.getElementById("projections-tooltip").style.visibility = "hidden";
		});
	}
	
	render() {
		
		let classStyle: string = '';
		if (this.props.selected) classStyle = ' selected';

		return (
			<Fragment>
				<li 
					key={this.props.id} 
					className={"list-group-item" + classStyle}
					onClick={() => this.selectProjection(this.props.id)}
				>
					{this.props.id}
				</li>
			</Fragment>
        );
    }
}