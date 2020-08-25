import React, { Fragment } from 'react';

// CSS
import './Popup.less';
import { Close } from '@material-ui/icons';


type PopupProps = {
	message: string,
	parentRef: any,
}

type PopupState = {
	isOpen: boolean,
}

export default class Popup extends React.PureComponent<PopupProps, PopupState> {

	constructor(props: PopupProps) {
    
		super(props);
		this.state = { 
			isOpen: false
		}
		this.close = this.close.bind(this);
		
		/*
		 *  Passing function to parent
		 */
		this.props.parentRef(this.open.bind(this));
		this.bindKeyEsc2Close();
	}
	
	public open = () => {

		this.setState({ isOpen: true });
	}

	public close = () => {

		this.setState({ isOpen: false });
	}

	public bindKeyEsc2Close = () => {

		document.addEventListener("keypress", (e) => {

			if (e.which == 27)
				this.close();
		}); 
	}

	render() {
		
		let classStyle: string = '';
		if (this.state.isOpen) classStyle = ' show';

		return (
			<Fragment>
				<div id="popup" className={ "over-map" + classStyle }>
					<div id="popup-content">
						<header>
							<span 
								className="icon"
								onClick={ this.close.bind(this) }
							>
								<Close />
							</span>
						</header>
						<section>
							<p> 
								{this.props.message}
							</p>
						</section>
					</div>
					<div 
						id="background-popup"
						onClick={ this.close.bind(this) }
					>
					</div>
				</div>
			</Fragment>
        );
    }
}