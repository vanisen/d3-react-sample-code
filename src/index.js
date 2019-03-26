import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import D3Demo from './d3-demo';
import registerServiceWorker from './registerServiceWorker';
import EnergyData from './data/energy.json';
ReactDOM.render(<D3Demo
    EnergyData = {EnergyData}
    width = {960}
    height = {500}
    tickTime = {1000}
    dragAllowed = {true}
    margin = {{top: 1, right: 1, bottom: 6, left: 1}}
/>, document.getElementById('root'));
registerServiceWorker();
