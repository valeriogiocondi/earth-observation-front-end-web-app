import React, { Fragment } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// CONTROLLER
import layersController from '../../../../../_controller/layers-controller';
import projectionsController from '../../../../../_controller/projection-controller';

// MODEL
import Layer from '../../../../../_model/entity/layer';
import layersWMS from '../../../../../_model/dao/layer-wms';

// CSS
import './LayersSidebar.less';
import { KeyboardTab, Done, DoneAll } from '@material-ui/icons';


/* 
 *  <LayersSidebar />
 */

type LayersSidebarState = {
	layersJSON: Layer[],
}

class LayersSidebar extends React.PureComponent<{}, LayersSidebarState> {

	constructor(props: {}) {
    
		super(props);
		this.state = {
			layersJSON: null,
		}
		this.hideSidebar = this.hideSidebar.bind(this);
    }
	
    componentDidMount() { 

		this.getLayersWMS();

		layersController.subscribeToStore((resultReduxStore: any) => {

			this.setState({ layersJSON: Object.values(resultReduxStore) });
		});
	}
	
	hideSidebar = () => {

		document.getElementById("layers-sidebar").style.marginRight = "-300px";
		document.getElementById("controls-bar").style.marginRight = "15px";
		document.getElementById("projections-tooltio").style.marginRight = "15px";
	}
    
	getLayersWMS = () => {

		layersWMS.fetchData().then((resultLayers) => {
			
			/* 
			 *	it's better to save the layers just in the redux store
			 *	in order to have just one source and manage it
			 *	
			 *	when we'll change order and select of the layers
			 *	we'll change the redux store
			 *	
			 *	the component state it's a link to the redux store
			 *	none action will edit the component state
			 *	
			 */

			this.setState( { layersJSON: resultLayers }, () => {

				/*  
				*	Store Laysers and Projection
				*/
				layersController.storeLayersList(resultLayers);
				projectionsController.storeProjectionsList(resultLayers[0].boundingBox);
			});
			
		}).catch(() => {
			
			this.setState({ layersJSON: [] });
		});
	}
    
	render() {

		let layersList = [];
		if (this.state.layersJSON) {
			
			this.state.layersJSON.forEach((elem) => {
	
				layersList.push(elem);
			});
		}

		return (
			<Fragment>
				<div id="layers-sidebar" className="over-map">
					<header>
						<KeyboardTab 
							className="hide-layers-sidebar" 
							onClick={this.hideSidebar}
						/>
					</header>
					<section>
						<LayersList data={layersList} />
					</section>
				</div>
			</Fragment>
        );
    }
}


/* 
 *	<LayersList />
 */

type LayersListProps = {
	data: Layer[],
};

type LayersListState = {
	allSelected: boolean,
	layersSidebarOpened: boolean,
};

class LayersList extends React.PureComponent<LayersListProps, LayersListState> {

	constructor(props: LayersListProps) {

		super(props);
		this.state = {
			allSelected: false,
			layersSidebarOpened: false,
		}
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	selectAllItems = ():void => {
		
		this.setState({ allSelected: !this.state.allSelected}, () => {

			layersController.markAllLayersAsSelected(this.state.allSelected);
		});
	}

	onDragEnd = (result): void => {
		
		layersController.swapLayers(result.source.index, result.destination.index);
	}

	render() {

		let classStyle: string = '';
		if (this.state.allSelected) classStyle = ' selected';

		let layerItemList = [];
		this.props.data.map((elem) => {

			layerItemList.push(
				<LayersListItem 
					id={ elem.id } 
					name={ elem.name } 
					isSelected={ elem.isSelected } 
				/>
			);
		});

		return (
			<Fragment>
				<div className="layer-list">
					<header>
						<div 
							className={"selectable "+ classStyle }
							onClick={() => this.selectAllItems()}
						>
							<div className="row">
								<div className="col-2 icon">
									<DoneAll />
								</div>
								<div className="col-10 label">
									
								</div>
							</div>
						</div>
					</header>
					<section>
						<DragDropContext onDragEnd={this.onDragEnd}>
							<Droppable droppableId="droppable">
								{(provided, snapshot) => (
									<div {...provided.droppableProps} ref={provided.innerRef}>
										{this.props.data.map((item, index) => (
											<Draggable key={item.id} draggableId={item.id} index={index}>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<LayersListItem 
															id={ item.id } 
															name={ item.name } 
															isSelected={ item.isSelected } 
														/>
													</div>
												)}
											</Draggable>
										))}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</section>
				</div>
			</Fragment>
		);
	}	
}


/* 
 *	<LayersListItem /> 
 */

type LayersListItemProps = {
	id: string,
	name: string,
	isSelected: boolean,
};

type LayersListItemState = {
	isSelected: boolean,
};

class LayersListItem extends React.Component<LayersListItemProps, LayersListItemState> {

	constructor(props: LayersListItemProps) {
    
		super(props);
		this.state = {
			isSelected: false,
		}
		this.selectLayer = this.selectLayer.bind(this);
	}
	
	private selectLayer = (id: string, status: boolean) => {

		this.setState({ isSelected: true }, () => {

			/* 
			 *  Passing selected layer's id to controller
			 *	whereas we'll change the just the respective layer
			 */

			layersController.markLayerAsSelected(id, status);
		});
	}

	private openDetails = (id: string) => {

		this.setState({ isSelected: true }, () => {

			/* 
			 *  Passing selected layer's id to controller
			 *	whereas we'll change the just the respective layer
			 */

			layersController.changeLegendLayer(id);
		});
	}

	render() {

		let classStyle: string = '';
		if (this.props.isSelected) classStyle = ' selected';

		return (
			<Fragment>
				<div 
					className={"row selectable dnd-list-item" + classStyle}
					onClick={() => this.selectLayer(this.props.id, this.props.isSelected)}
				>
					<div className="col-2 icon">
						<Done />
					</div>
					<div className="col-10">
						<div className="label">
							{this.props.name}
						</div>
						<div 
							className="details"
							onClick={(e) => {this.openDetails(this.props.id); e.stopPropagation(); }}
						>
							VIEW DETAILS
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}
  
export default LayersSidebar;