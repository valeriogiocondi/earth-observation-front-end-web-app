import React, { Fragment } from 'react';

// CONTROLLER
import layersController from '../../../../../_controller/layers-controller';

// MODEL
// import LayersWMS from '../../../../../_model/layer-wms';

// REDUX - STORE
import reduxStore from '../../../../../_model/redux/redux-store';

// TYPES
import Layer from '../../../../../types/layer';
import Style from '../../../../../types/style';

// CSS
import './LegendWidget.less';
import { ListAlt, Description, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';


type LayersSidebarState = {
	tab1: boolean,
    tab2: boolean,
    content: {
        style: Style,
        abstract: string,
        legendDescription: string,
        openTabsContainer: boolean,
    },
    notAvailable: string
}

class LegendWidget extends React.PureComponent<{}, LayersSidebarState> {

	constructor(props: {}) {
    
		super(props);
		this.state = {
            tab1: true,
            tab2: false,
            content: {
                style: null,
                abstract: '',
                legendDescription: '',
                openTabsContainer: false,
            },
            notAvailable: 'Contenuto non disponibile'
		}
		this.selectTab = this.selectTab.bind(this);
    }
	
    componentDidMount() { 

		reduxStore.subscribe(() => {
            
			this.setState({ content: reduxStore.getState().changeLegendLayer });
		});
    }
    
    selectTab = (value: boolean): void => {

        this.setState({ tab1: value });
        this.setState({ tab2: !value });
        this.toogleTabs(true);
    }

    toogleTabs = (forceOpen?: boolean): void => {

        this.setState({
            content: {
                style: this.state.content.style,
                abstract: this.state.content.abstract,
                legendDescription: this.state.content.legendDescription,
                openTabsContainer: (forceOpen) ? forceOpen : !this.state.content.openTabsContainer,
            }
        });
    }

	render() {

        let tab1Selected = '';
        let tab2Selected = '';
        let tabsOpened = '';

        if (this.state.tab1)
            tab1Selected = 'selected';
        else
            tab2Selected = 'selected';
            
        if (this.state.content.openTabsContainer)
            tabsOpened = 'show';

        if (!this.state.content.style || !this.state.content.style.legendUrl)
            this.state.content.legendDescription = this.state.notAvailable;

        if (!this.state.content.abstract)
            this.state.content.abstract = this.state.notAvailable;
        
        if (!this.state.content.style)
            this.state.content.style = {
                name: '',
                title: '',
                legendUrl: '',
                legendFormat: '',
                width: '',
                height: '',  
            };

		return (
			<Fragment>
                <div id="legend-widget" className={ "over-map " +  tabsOpened }>
                    <header>
                        {/* <ul className="list list-group list-group-horizontal"> */}
                        <div className="row">
                            <div 
                                className={ "col-5 " + tab1Selected }
                                onClick={() => this.selectTab(true) }
                            >
                                <span className="icon"><ListAlt /></span>
                                <span className="label">LEGEND</span>
                            </div>
                            <div 
                                className={ "col-5 " + tab2Selected }
                                onClick={() => this.selectTab(false) }
                            >
                                <span className="icon"><Description /></span>
                                <span className="label">ABSTRACT</span>
                            </div>
                            <div 
                                className="col-2 widget-toogle"
                                onClick={() => this.toogleTabs()}
                            >
                                <div className={ "arrows-toggle " + tabsOpened}>
                                    <KeyboardArrowDown />
                                </div>
                            </div>
                        </div>
                        {/* </ul> */}
                    </header>
                    <section>
                        <div className={ "content legend " + tab1Selected }>
                            <img 
                                src={this.state.content.style.legendUrl} 
                                alt={this.state.content.legendDescription}
                            />
                        </div>
                        <div className={ "content abstract " + tab2Selected}>
                            {this.state.content.abstract}
                        </div>
                    </section>
                </div>
			</Fragment>
		);
	}
}
  
export default LegendWidget;