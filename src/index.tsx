import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// REDUX
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// REDUX - STORE
import store from './components/_model/redux/redux-store';

// CSS
import './index.css';

// COMPONENTS
import Home from './components/_view/pages/home/Home';


const Index = ({ store }) => (
  <Provider store={store}>
    <Router>
	    <div>
	    	<article id="main-article">
      		<Switch>
		      	<Route exact path="/" component={Home} />
		      	{/* <Route path="/login" component={Login} /> */}
		      	{/* <Route path="/logout" component={Logout} /> */}
		      	{/* <Route path="/utenti-registrati" component={UtentiRegistrati} /> */}
		      	{/* <Route path="/utente/:id" component={ProfiloUtente} /> */}
	        	{/* <Route component={Page404} /> */}
      		</Switch>
	    	</article>
	    </div>
    </Router>
  </Provider>
)

ReactDOM.render(<Index store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
