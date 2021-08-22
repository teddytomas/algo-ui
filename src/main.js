import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store/store.js'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import More from 'highcharts/highcharts-more'
import stockInit from 'highcharts/modules/stock'
import Annotation from 'highcharts/modules/annotations.js'

//import darkUnica from 'highcharts/themes/dark-unica'

Annotation(Highcharts)
stockInit(Highcharts)
More(Highcharts)

Vue.use(HighchartsVue)



Highcharts.theme = {
  colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
   '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
  chart: {
   backgroundColor: {
      linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
      stops: [
         [0, '#363636'],
         [1, '#363636']
      ]
   },
   style: {
      //fontFamily: '\'Unica One\', sans-serif'
      fontFamily: 'Roboto'
   },
   plotBorderColor: '#606063'
  },
  title: {
   style: {
      color: '#E0E0E3',
      textTransform: 'uppercase',
      fontSize: '20px'
   }
  },
  subtitle: {
   style: {
      color: '#E0E0E3',
      textTransform: 'uppercase'
   }
 },
 xAxis: {
   gridLineColor: '#707073',
   labels: {
      style: {
         color: '#E0E0E3'
      }
   },
   lineColor: '#707073',
   minorGridLineColor: '#505053',
   tickColor: '#707073',
   title: {
      style: {
         color: '#A0A0A3'
 
      }
   }
 },
 yAxis: {
   gridLineColor: '#707073',
   labels: {
      style: {
         color: '#E0E0E3'
      }
   },
   lineColor: '#707073',
   minorGridLineColor: '#505053',
   tickColor: '#707073',
   tickWidth: 1,
   title: {
      style: {
         color: '#A0A0A3'
      }
   }
 },
 tooltip: {
   backgroundColor: 'rgba(0, 0, 0, 0.85)',
   style: {
      color: '#F0F0F0'
   }
 },
 plotOptions: {
   series: {
      dataLabels: {
         color: '#B0B0B3'
      },
      marker: {
         lineColor: '#333'
      }
   },
   boxplot: {
      fillColor: '#505053'
   },
   candlestick: {
      lineColor: 'white'
   },
   errorbar: {
      color: 'white'
   }
 },
 legend: {
   itemStyle: {
      color: '#E0E0E3'
   },
   itemHoverStyle: {
      color: '#FFF'
   },
   itemHiddenStyle: {
      color: '#606063'
   }
 },
 credits: {
   style: {
      color: '#666'
   }
 },
 labels: {
   style: {
      color: '#707073'
   }
 },
 
 drilldown: {
   activeAxisLabelStyle: {
      color: '#F0F0F3'
   },
   activeDataLabelStyle: {
      color: '#F0F0F3'
   }
 },
 
 navigation: {
   buttonOptions: {
      symbolStroke: '#DDDDDD',
      theme: {
         fill: '#505053'
      }
   }
 },
 
 // scroll charts
 rangeSelector: {
   buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: {
         color: '#CCC'
      },
      states: {
         hover: {
            fill: '#707073',
            stroke: '#000000',
            style: {
               color: 'white'
            }
         },
         select: {
            fill: '#000003',
            stroke: '#000000',
            style: {
               color: 'white'
            }
         }
      }
   },
   inputBoxBorderColor: '#505053',
   inputStyle: {
      backgroundColor: '#333',
      color: 'silver'
   },
   labelStyle: {
      color: 'silver'
   }
 },
 
 navigator: {
   handles: {
      backgroundColor: '#666',
      borderColor: '#AAA'
   },
   outlineColor: '#CCC',
   maskFill: 'rgba(255,255,255,0.1)',
   series: {
      color: '#7798BF',
      lineColor: '#A6C7ED'
   },
   xAxis: {
      gridLineColor: '#505053'
   }
 },
 
 scrollbar: {
   barBackgroundColor: '#808083',
   barBorderColor: '#808083',
   buttonArrowColor: '#CCC',
   buttonBackgroundColor: '#606063',
   buttonBorderColor: '#606063',
   rifleColor: '#FFF',
   trackBackgroundColor: '#404043',
   trackBorderColor: '#404043'
 },
 
 // special colors for some of the
 legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
 background2: '#505053',
 dataLabelsColor: '#B0B0B3',
 textColor: '#C0C0C0',
 contrastTextColor: '#F0F0F3',
 maskColor: 'rgba(255,255,255,0.3)'
 };
 
 // Apply the theme
 Highcharts.setOptions(Highcharts.theme);
 

 // override the smoothing constant on the area spline chart. Larger means straighter
 Highcharts.Series.prototype.getConnectors = function(segment, index, calculateNeighbours, connectEnds) {
  var i, prevPointInd, nextPointInd, previousPoint, nextPoint, previousX, previousY, nextX, nextY, plotX, plotY, ret,
    // 1 means control points midway between points, 2 means 1/3 from
    // the point, 3 is 1/4 etc;
    smoothing = 1.9,
    denom = smoothing + 1,
    leftContX, leftContY, rightContX, rightContY, dLControlPoint, // distance left control point
    dRControlPoint, leftContAngle, rightContAngle, jointAngle, addedNumber = connectEnds ? 1 : 0;
  // Calculate final index of points depending on the initial index value.
  // Because of calculating neighbours, index may be outisde segment
  // array.
  if (index >= 0 && index <= segment.length - 1) {
    i = index;
  } else if (index < 0) {
    i = segment.length - 1 + index;
  } else {
    i = 0;
  }
  prevPointInd = (i - 1 < 0) ? segment.length - (1 + addedNumber) : i - 1;
  nextPointInd = (i + 1 > segment.length - 1) ? addedNumber : i + 1;
  previousPoint = segment[prevPointInd];
  nextPoint = segment[nextPointInd];
  previousX = previousPoint.plotX;
  previousY = previousPoint.plotY;
  nextX = nextPoint.plotX;
  nextY = nextPoint.plotY;
  plotX = segment[i].plotX; // actual point
  plotY = segment[i].plotY;
  leftContX = (smoothing * plotX + previousX) / denom;
  leftContY = (smoothing * plotY + previousY) / denom;
  rightContX = (smoothing * plotX + nextX) / denom;
  rightContY = (smoothing * plotY + nextY) / denom;
  dLControlPoint = Math.sqrt(Math.pow(leftContX - plotX, 2) + Math.pow(leftContY - plotY, 2));
  dRControlPoint = Math.sqrt(Math.pow(rightContX - plotX, 2) + Math.pow(rightContY - plotY, 2));
  leftContAngle = Math.atan2(leftContY - plotY, leftContX - plotX);
  rightContAngle = Math.atan2(rightContY - plotY, rightContX - plotX);
  jointAngle = (Math.PI / 2) + ((leftContAngle + rightContAngle) / 2);
  // Ensure the right direction, jointAngle should be in the same quadrant
  // as leftContAngle
  if (Math.abs(leftContAngle - jointAngle) > Math.PI / 2) {
    jointAngle -= Math.PI;
  }
  // Find the corrected control points for a spline straight through the
  // point
  leftContX = plotX + Math.cos(jointAngle) * dLControlPoint;
  leftContY = plotY + Math.sin(jointAngle) * dLControlPoint;
  rightContX = plotX + Math.cos(Math.PI + jointAngle) * dRControlPoint;
  rightContY = plotY + Math.sin(Math.PI + jointAngle) * dRControlPoint;
  // push current point's connectors into returned object
  ret = {
    rightContX: rightContX,
    rightContY: rightContY,
    leftContX: leftContX,
    leftContY: leftContY,
    plotX: plotX,
    plotY: plotY
  };
  // calculate connectors for previous and next point and push them inside
  // returned object
  if (calculateNeighbours) {
    ret.prevPointCont = this.getConnectors(segment, prevPointInd, false, connectEnds);
  }
  return ret;
};

new Vue({
  vuetify,
  el:'#app',
  store,
  render: h => h(App)
})
