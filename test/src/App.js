import React from 'react';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Signup from './components/account/signup';
import Login from './components/account/login';
import Weather from './components/pages/weather';
import Stocks from './components/pages/stocks';
import Profile from './components/account/userProfile';
import Home from './components/pages/home';
import Navbar from './components/layout/navbar'

import Footer from './components/layout/footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/" exact component={Home}></Route>
      <Route path="/signup" exact component={Signup}></Route>
      <Route path="/login" exact component={Login}></Route> 
      <Route path="/weather" exact component={Weather}></Route>
      <Route path="/stocks" exact component={Stocks}></Route>
      <Route path="/profile" exact component={Profile}></Route>
      <Footer />
    </Router>
  );
}

export default App;
