import React from 'react';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Signup from './components/account/signup';
import Login from './components/account/login';
import Sports from './components/pages/sports';
import Weather from './components/pages/weather';
import Welcome from './components/pages/welcome';
import Stocks from './components/pages/stocks';
import Profile from './components/account/profile';

import Footer from './components/layout/footer';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Welcome}></Route>
      <Route path="/signup" exact component={Signup}></Route>
      <Route path="/login" exact component={Login}></Route>
      <Route path="/sports" exact component={Sports}></Route>
      <Route path="/weather" exact component={Weather}></Route>
      <Route path="/stocks" exact component={Stocks}></Route>
      <Route path="/profile" exact component={Profile}></Route>
      <Footer />
    </Router>
  );
}

export default App;
