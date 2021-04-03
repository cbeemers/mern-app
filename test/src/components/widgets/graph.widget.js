import React, {Component} from 'react';


import CanvasJSReact from './canvasjs-2.3.2/canvasjs.react';
// import CanvasJSReact from './canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;



export default class StockGraph extends Component {
    
    constructor(props) {
        super(props);

        this.days = [31, props.year%4 == 0 && props.year%100 != 0? 29 : 28, 
                     31, 30, 31, 30, 31, 31, 30, 31, 30, 31];   

        let today = new Date()
        let day = today.getDate()
        this.months = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
          ];


        let data = [];
        let d = 1;
        let volume = 0;
        let count = 0;

        if (props.type == "monthly") {
            let start = props.json["Time Series (Daily)"][props.year+"-"+props.month+"-0"+d];
            while (start == undefined && (today.getMonth()!= props.month && today.getDate() != d) ) {
                d++;
                if (d < 10) { d = "0" + d; }
                start = props.json["Time Series (Daily)"][props.year+"-"+props.month+"-"+d];
            }

            while (d<=this.days[props.month-1]) {
                if (start != undefined) {
                    count++;
                    volume+= parseFloat(start["5. volume"]);
                    data.push({   
                        x: new Date(props.year + " " + props.month + " "+ d),
                        y: parseFloat(start["4. close"]),
                    });
                }
                d++;
                if (d < 10) { d = "0" + d; }
                start = props.json["Time Series (Daily)"][props.year+"-"+props.month+"-"+d];
            }

        } else {
            let month = 1;
            let start = props.json["Time Series (Daily)"][props.year+"-01-0"+d];
            
            while (start == undefined) {
                d++;
                start = props.json["Time Series (Daily)"][props.year+"-01-0"+d];
            }
            
            while (month <= today.getMonth()+1) {
                if (month<10) { month = "0" + month; }
                while (d<=this.days[month-1]) {
                    
                    if (start != undefined) {
                        count++;
                        volume+= parseFloat(start["5. volume"]);
                        data.push({   
                            x: new Date(props.year + " " + month + " " + d),
                            y: parseFloat(start["4. close"]),
                        });
                    }
                    d++;
                    if (d < 10) { d = "0" + d; }
                    start = props.json["Time Series (Daily)"][props.year+"-"+month+"-"+d];
                }
                d=1;
                month++;
            }
        }

        this.state= {
            stock: props.stock,
            json: props.json,
            end: props.year + "-" + props.month + "-" + props.day,
            type: props.type,
            year: props.year, 
            month: props.month,
            data: data,
            average: volume/count,
        }
    }


    render() {
        const {data, stock, month, year, type, average} = this.state;

        let title = type=="monthly" ? this.months[month-1] + " " : "";
        title += year;

		const options = {
			animationEnabled: true,
			theme: "dark1",
			title:{
				text: "Stock Price of " + stock.toUpperCase() + " - " + title,
			},
            subtitles: [{
                text: "Average volume/day: " + Math.round(average*100)/100,  
            }],
			axisX:{
				valueFormatString: "DD MMM",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY: {
				title: "Closing Price (in US)",
				includeZero: false,
				valueFormatString: "$##0.00",
				crosshair: {
					enabled: true,
					snapToDataPoint: true,
					labelFormatter: function(e) {
						return "$" + CanvasJS.formatNumber(e.value, "##0.00");
					}
				}
			},
			data: [{
				type: "area",
				xValueFormatString: "DD MMM",
				yValueFormatString: "$##0.00",
				dataPoints: data
			}]
		}
		
		return (
		<div className="graph">
			<CanvasJSChart options = {options} 
				onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}