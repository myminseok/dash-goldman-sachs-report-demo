!function(t,e){"use strict";var n=Plotly.d3,a=e.Embed=function(){var t=this;t.inited=!1,t.initPromise=new Promise(function(e){t.resolveInit=e}),t.isReady=!1,t.readyPromise=new Promise(function(e){t.resolveReady=e}),t.graphDiv=n.select("#embedded-graph").node(),t.graphDiv.fid=n.select("#plot-fid").text(),t.graphDiv.fn=n.select("#plot-filename").text(),t.layout=null,t.plotResizeTimeout=null,t.externalScripts=[],t.svgContainer=null,t.initialAutosize=null,t.initialWidth=null,t.initialHeight=null},o=a.prototype;o.getRavenConfig=function(){var t={};return t.tags={host:location.host,server:"browser",ie:this.getIEVersion()},t},o.getLayoutAutosize=function(){switch(n.select("#plot-autosize").text()){case"true":return!0;case"false":return!1;default:return null}},o.getLayoutWidth=function(){var t=n.select("#plot-width").text();return t=parseInt(t,10),isNaN(t)?null:t},o.getLayoutHeight=function(){var t=n.select("#plot-height").text();return t=parseInt(t,10),isNaN(t)?null:t},o.getData=function(){return JSON.parse(n.select("#plot-data").text())},o.getLayout=function(){var t=this;if(t.layout)return t.layout;var e=JSON.parse(n.select("#plot-layout").text()),a=t.getLayoutAutosize(),o=t.getLayoutWidth(),i=t.getLayoutHeight();return null!==o||null!==i?(o&&(e.width=o),i&&(e.height=i),e.autosize=!1):null!==a&&(e.autosize=a),t.initialAutosize=e.autosize,t.initialWidth=e.width,t.initialHeight=e.height,e.autosize&&(delete e.width,delete e.height),e},o.getFrames=function(){return JSON.parse(n.select("#plot-frames").text())},o.getDisplayLogo=function(){return"true"===n.select("#plot-logo").text()},o.getDisplayModeBar=function(){switch(n.select("#plot-modebar").text()){case"false":return!1;case"hover":return"hover";default:return!0}},o.getMapboxAccessToken=function(){return n.select("#plot-mapbox-access-token").text()},o.getDisplayLink=function(){return"true"===n.select("#plot-link").text()},o.getIEVersion=function(){return document.documentMode?document.documentMode:0},o.stopLoading=function(){n.select("#plotlybars").remove()},o.initStream=function(e,n){if("undefined"!=typeof StreamHead){var a=new StreamHead(n,e,{autoreload:!0});a.init(),a.connect({host:t.WEBSOCKET_HOST,port:t.WEBSOCKET_PORT})}},o.initPostMessage=function(){var t=this;e.addEventListener("message",function(e){t.onMessage(e,t)})},o.isShareplot=function(){if(e.self===e.top)return!1;try{var t=e.location.href;return 0===e.parent.location.href.indexOf(t.split(".embed")[0])}catch(t){return!1}},o.getConfig=function(){var t=this.isShareplot(),n=e===e.top,a=document.body.style;return{displaylogo:this.getDisplayLogo(),displayModeBar:this.getDisplayModeBar(),mapboxAccessToken:this.getMapboxAccessToken(),autosizable:!0,fillFrame:!0,sendData:!1,showLink:this.getDisplayLink(),scrollZoom:t,setBackground:n?function(t,e){a.backgroundColor=Plotly.Color.combine(e,"white"),a.backgroundColor||(a.backgroundColor="white")}:function(t,e){a.backgroundColor=e,a.backgroundColor||(a.backgroundColor="white")}}},o.init=function(){if(!this.inited){var t=!0;-1!==e.location.href.indexOf("link=false")&&(t=!1),t&&(document.getElementById("js-edit-link").style.display="block");var n=this;return n.data=n.getData(),n.layout=n.getLayout(),n.frames=n.getFrames(),n.config=n.getConfig(),n.inited=!0,n.resolveInit(),n.initialPlot()}},o.setUp=function(){var t=this;t.initPostMessage(),document.addEventListener("DOMContentLoaded",function(){Raven.context(t.getRavenConfig(),function(){t.init()})})},o.initialPlot=function(){var t=this,a=t.graphDiv;return new Promise(function(t){if(a.clientWidth>100)t();else var e=0,n=setInterval(function(){e+=50,(a.clientWidth>100||e>3e3)&&(clearInterval(n),t())},50)}).then(function(){var e=Plotly.plot(a,{data:t.data,layout:t.layout,frames:t.frames,config:t.config});return t.isReady=!0,t.resolveReady(),e}).then(function(){return t.stopLoading(),t.svgContainer=n.select(a).select(".svg-container"),e.addEventListener("resize",function(){t.resizePlot()}),n.select("html").classed("is-iframe",!0),t.svgContainer.style("margin","auto"),t.initStream(a,Plotly),Plotly.Breakpoints.apply(a)}).then(function(){return Plotly.Plots.redrawText(a)})},o.resizePlot=function(){var t=this,e=t.graphDiv;return t.afterReady(function(){if(t.layout.autosize)return delete t.layout.width,delete t.layout.height,Plotly.Plots.resize(e).then(function(){return e.style.background="none",Plotly.Breakpoints.apply(e)})})};var i=a.handlers={};o.onMessage=function(t,e){var n={source:t.source,origin:t.origin,data:t.data},a=i[n.data.task];a?e.initPromise=e.initPromise.then(function(){return a(e,n)}):n.data.task&&console.warn("Supplied task attribute not recognized",n.data)},o.clonePoints=function(t){for(var e,n=[],a=0;a<t.length;a++)e=t[a],n[a]={data:e.data,curveNumber:e.curveNumber,pointNumber:e.pointNumber,x:e.x,y:e.y};return n},o.sendData=function(){this.graphDiv._context.sendData=!0,Plotly.Plots.addLinks(this.graphDiv)},o.afterReady=function(t){var e=this;return e.readyPromise=e.readyPromise.then(t),e.readyPromise},i.newPlot=function(t,e){return t.afterReady(function(){t.sendData(),Plotly.newPlot(t.graphDiv,e.data.data,e.data.layout)})},i.restyle=function(t,e){return t.afterReady(function(){t.sendData(),Plotly.restyle(t.graphDiv,e.data.update,null,e.data.indices)})},i.relayout=function(t,e){var n,a=e.data.update;if(t.isReady)n=Plotly.relayout(t.graphDiv,a).then(function(){if(a.autosize||a.width||a.height)return Plotly.Breakpoints.apply(t.graphDiv)});else{var o=t.layout;Object.keys(a).forEach(function(t){Plotly.Lib.nestedProperty(o,t).set(a[t])})}return!1!==e.data.sendData&&t.afterReady(function(){t.sendData()}),n},i.hover=function(t,e){return t.afterReady(function(){Plotly.Fx.hover(t.graphDiv,e.data.selection,e.data.subplot)})},i.listen=function(t,e){return t.afterReady(function(){var n=t.graphDiv,o=function(){a.postRanges(t,e)},i=function(t){a.postPoints("hover",t,e)},r=function(t){a.postPoints("unhover",t,e)},s=function(t){a.postPoints("click",t,e)};n.removeListener("plotly_relayout",o),n.removeListener("plotly_hover",i),n.removeListener("plotly_unhover",r),n.removeListener("plotly_click",s),-1!==e.data.events.indexOf("zoom")&&n.on("plotly_relayout",o),-1!==e.data.events.indexOf("hover")&&(n.on("plotly_hover",i),n.on("plotly_unhover",r)),-1!==e.data.events.indexOf("click")&&n.on("plotly_click",s)})},i.addTraces=function(t,e){return t.afterReady(function(){t.sendData(),Plotly.addTraces(t.graphDiv,e.data.traces,e.data.newIndices)})},i.deleteTraces=function(t,e){return t.afterReady(function(){t.sendData(),Plotly.deleteTraces(t.graphDiv,e.data.indices)})},i.moveTraces=function(t,e){return t.afterReady(function(){t.sendData(),Plotly.moveTraces(t.graphDiv,e.data.currentIndices,e.data.newIndices)})},i.extendTraces=function(t,e){return t.afterReady(function(){var n=e.data;Plotly.extendTraces(t.graphDiv,n.update,n.indices,n.maxPoints)})},i.getLayout=function(t,e){var o=t.getLayout();o.width&&o.height||!e.data.layout||(n.select("#plot-width").text(e.data.layout.width),n.select("#plot-height").text(e.data.layout.height),n.select("#plot-autosize").text("true"),o=t.getLayout()),a.postMessage(e,{layout:o,id:e.data.id})},i.getInitialSize=function(t,e){a.postMessage(e,{id:e.data.id,initialSize:{width:t.initialWidth,height:t.initialHeight,autosize:t.initialAutosize}})},i.getAttributes=function(t,e){return t.afterReady(function(){var n,o,i,r,s={};if(i=Plotly.Plots.graphJson(t.graphDiv,!1,null,"object",!0),o="string"==typeof e.data.attributes?[e.data.attributes]:e.data.attributes||["data","layout"],Array.isArray(o))for(r=0;r<o.length;r++)n=Plotly.Lib.nestedProperty(i,o[r]).get(),s[o[r]]=n;else s=i;a.postMessage(e,{task:"getAttributes",response:s})})},i.setAutosize=function(t,e){t.layout.autosize=!!e.data.value},i.ping=function(t,e){a.postMessage(e,{pong:!0})},i.redraw=function(t){if(t.isReady)return Plotly.redraw(t.graphDiv)},a.postRanges=function(t,e){var n={type:"zoom",ranges:{}};Plotly.Axes.list(t.graphDiv).forEach(function(t){n.ranges[t._id]=t.range.map(t.l2c)}),a.postMessage(e,n)},a.postPoints=function(t,e,n){var i={type:t,points:o.clonePoints(e.points)};a.postMessage(n,i)},a.postMessage=function(t,e){t.source.postMessage(e,t.origin)}}(ENV,window);