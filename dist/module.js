define(["lodash","jquery","app/core/core","app/core/config","app/plugins/sdk"],function(e,t,n,r,o){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=30)}([function(t,n){t.exports=e},function(e,n){e.exports=t},,function(e,t){e.exports=n},,,,function(e,t){e.exports=r},function(e,t){e.exports=o},,,,,function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();function o(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){return function r(o,a){try{var i=t[o](a),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}("next")})}}var a=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),console.info("DashboardLoader"),this.backendSrv=t,this.dashboards=[],this.uids=[]}return r(e,[{key:"searchDashboards",value:function(){var e=o(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.backendSrv.get("/api/search?tag=bayesian-network").then(function(e){t.uids=e}).catch(function(e){return console.log(e)}));case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"importSingleDashboard",value:function(){var e=o(regeneratorRuntime.mark(function e(t){var n=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.backendSrv.getDashboardByUid(t).then(function(e){n.dashboards.push(e.dashboard)}).catch(function(e){e.isHandled=!0});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"importDashboards",value:function(){var e=this;this.dashboards=[];var t=this.uids.map(function(t){return e.importSingleDashboard(t.uid)});return Promise.all(t)}},{key:"getDashboards",value:function(){var e=o(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.searchDashboards().then(function(){return t.importDashboards().then(function(){return t.dashboards})}).catch(function(e){return console.info(e)}));case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"extract",value:function(e){for(var t=[],n=0;n<e.length;n++)t.push(e[n].network);return t}},{key:"getNets",value:function(){var e=o(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.getDashboards().then(function(){return t.extract(t.dashboards)}));case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()}]),e}();e.exports=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();(t.DreamCorpAppConfigCtrl=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.$location=t}return e.$inject=["$location"],r(e,[{key:"redirect",value:function(){console.info("redirect to importNet"),this.$location.url("plugins/dreamcorp-app/page/import-bayesian-network")}}]),e}()).templateUrl="components/config.html"},function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1));function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){return function r(o,a){try{var i=t[o](a),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}("next")})}}var i=n(29),s=n(33),u=function(e){function t(e,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n,r));return o.influx=null,o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i),r(t,[{key:"checkConnection",value:function(){var e=a(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this,e.abrupt("return",o.ajax({url:t.host+t.port+"/ping?verbose=true",type:"HEAD",success:function(){null===t.influx&&(t.influx=new s(t.host,t.port,t.database))},error:function(e,n,r){t.influx=null}}));case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"createDB",value:function(){var e=a(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.checkConnection().then(function(){if(null!==t.influx)return t.influx.createDB();throw"Connection Error"}).catch(function(e){return console.info(e)});case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"insert",value:function(){var e=a(regeneratorRuntime.mark(function e(t,n,r){var o=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.checkConnection().then(function(){if(null!==o.influx)return o.influx.insert(t,n,r);throw"Connection Error"}).catch(function(e){return console.info(e)});case 1:case"end":return e.stop()}},e,this)}));return function(t,n,r){return e.apply(this,arguments)}}()},{key:"drop",value:function(){var e=a(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.checkConnection().then(function(){if(null!==t.influx)return t.influx.drop();throw"Connection Error"});case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()}]),t}();e.exports=u},,,,,,,,,,,,,,function(e,t,n){"use strict";e.exports=function e(t,n,r){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),console.info("New DatabaseConnection"),null===t)throw"Host null Error";if(this.host=t,null===n)throw"Port null Error";if(this.port=n,null===r)throw"Database null Error";this.database=r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Control=t.ImportNetCtrl=t.ConfigCtrl=void 0,n(44),n(50);var r=n(14),o=n(31),a=n(35);(0,n(8).loadPluginCss)({dark:"plugins/dreamcorp-app/css/grafana-zabbix.dark.css",light:"plugins/dreamcorp-app/css/grafana-zabbix.light.css"}),t.ConfigCtrl=r.DreamCorpAppConfigCtrl,t.ImportNetCtrl=o.ImportNetCtrl,t.Control=a.Control},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ImportNetCtrl=void 0;var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=u(n(0)),a=u(n(7)),i=u(n(32)),s=n(3);function u(e){return e&&e.__esModule?e:{default:e}}var l=n(15),c={__inputs:[{name:"DS_INFLUXDB-RETE",label:"InfluxDB-rete",description:"",type:"datasource",pluginId:"influxdb",pluginName:"InfluxDB"}],__requires:[{type:"grafana",id:"grafana",name:"Grafana",version:"5.4.0"},{type:"panel",id:"graph",name:"Graph",version:"5.0.0"},{type:"datasource",id:"influxdb",name:"InfluxDB",version:"5.0.0"}],annotations:{list:[{builtIn:1,datasource:"-- Grafana --",enable:!0,hide:!0,iconColor:"rgba(0, 211, 255, 1)",name:"Annotations & Alerts",type:"dashboard"}]},editable:!1,gnetId:null,graphTooltip:0,id:null,iteration:1551364330292,links:[],panels:[{aliasColors:{},bars:!1,dashLength:10,dashes:!1,datasource:"${DS_INFLUXDB-RETE}",fill:1,gridPos:{h:8,w:7,x:0,y:0},id:2,legend:{avg:!1,current:!1,max:!1,min:!1,show:!0,total:!1,values:!1},lines:!0,linewidth:1,links:[],minSpan:7,nullPointMode:"null",percentage:!1,pointradius:5,points:!1,renderer:"flot",repeat:"nodo",repeatDirection:"h",seriesOverrides:[],spaceLength:10,stack:!1,steppedLine:!1,targets:[{groupBy:[],measurement:"$nodo",orderByTime:"DESC",policy:"default",refId:"A",resultFormat:"time_series",select:[[{params:["*"],type:"field"}]],tags:[]}],thresholds:[],timeFrom:null,timeRegions:[],timeShift:null,title:"Nodo: $nodo",tooltip:{shared:!0,sort:0,value_type:"individual"},type:"graph",xaxis:{buckets:null,mode:"time",name:null,show:!0,values:[]},yaxes:[{format:"short",label:null,logBase:1,max:null,min:null,show:!0},{format:"short",label:null,logBase:1,max:null,min:null,show:!0}],yaxis:{align:!1,alignLevel:null}}],refresh:"10s",schemaVersion:16,style:"dark",tags:["bayesian-network"],templating:{list:[{allValue:null,current:{tags:[],text:"nodo1 + nodo2 + nodo3 + nodo4 + nodo5 + nodo6",value:["nodo1","nodo2","nodo3","nodo4","nodo5","nodo6"]},hide:0,includeAll:!1,label:"Nodi",multi:!0,name:"nodo",options:[{selected:!0,text:"nodo1",value:"nodo1"},{selected:!0,text:"nodo2",value:"nodo2"},{selected:!0,text:"nodo3",value:"nodo3"},{selected:!0,text:"nodo4",value:"nodo4"},{selected:!0,text:"nodo5",value:"nodo5"},{selected:!0,text:"nodo6",value:"nodo6"}],query:"nodo1,nodo2,nodo3,nodo4,nodo5,nodo6",skipUrlSync:!1,type:"custom"}]},time:{from:"now-5m",to:"now"},timepicker:{refresh_intervals:["5s","10s","30s","1m","5m","15m","30m","1h","2h","1d"],time_options:["5m","15m","1h","6h","12h","24h","2d","7d","30d"]},timezone:"",title:"Inference Dashboard",uid:"mjtTRCrmzFds2",version:7,network:null};(t.ImportNetCtrl=function(){function e(t,n,r,o,a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.backendSrv=t,this.validationSrv=n,this.$location=o,this.$routeParams=a,this.step=1,this.nameExists=!1,this.uidExists=!1,this.autoGenerateUid=!0,this.autoGenerateUidValue="auto-generated",this.folderId=a.folderId?Number(a.folderId)||0:null,this.initialFolderTitle="Select a folder",this.default_host="http://localhost",this.host=this.default_host,this.default_port=":8086",this.port=this.default_port,this.default_password="",this.password=this.default_password,this.default_user="",this.user=this.default_user="",this.datasource=null}return e.$inject=["backendSrv","validationSrv","navModelSrv","$location","$routeParams"],r(e,[{key:"setHost",value:function(e){this.host=e}},{key:"setPort",value:function(e){this.port=e}},{key:"setUser",value:function(e){this.user=e}},{key:"setPassword",value:function(e){this.password=e}},{key:"personalizeTemplating",value:function(e,t){for(var n="",r="",o=[],a=[],i=void 0,s=0;s<e.nodi.length;s++){n+=i=e.nodi[s].id,r+=i,o.push(i);var u={selected:!0,text:"",value:""};u.text=i,u.value=i,a.push(u),s!==e.nodi.length-1&&(n+=",",r+=" + ")}t.templating.list[0].current.text=r,t.templating.list[0].current.value=o,t.templating.list[0].options=a,t.templating.list[0].query=n}},{key:"setUpDatasource",value:function(e,t){t.panels[0].datasource="InfluxDB-"+e.id}},{key:"createDatasource",value:function(e,t){var n=this,r={name:"InfluxDB-"+e.id,type:"influxdb",access:"proxy",url:this.host+this.port,password:this.password,user:this.user,database:e.id,basicAuth:!1,withCredentials:!1,isDefault:!1,version:3,readOnly:!1};return this.backendSrv.post("/api/datasources/",r).then(function(e){return n.datasource=e,t.panels[0].datasource=e.name,e}).catch(function(e){return console.info(e)})}},{key:"boxing",value:function(e,t){return this.personalizeTemplating(e,t),this.setUpDatasource(e,t),t.title=e.id,t.network=e,t}},{key:"createDB",value:function(){new l(this.host,this.port,this.dash.network.id).createDB().then(function(){s.appEvents.emit("alert-success",["Database created",""])}).catch(function(e){s.appEvents.emit("alert-error",["Database creation error",e])})}},{key:"checkSematic",value:function(e){return n(34).checkSemantic(e)}},{key:"onUpload",value:function(e){if(console.info("onUpload"),this.checkSematic(e)){if(this.network=e,this.dash=this.boxing(e,c),this.dash.id=null,this.step=2,this.inputs=[],this.dash.__inputs){var t=!0,n=!1,r=void 0;try{for(var o,a=this.dash.__inputs[Symbol.iterator]();!(t=(o=a.next()).done);t=!0){var i=o.value,s={name:i.name,label:i.label,info:i.description,value:i.value,type:i.type,pluginId:i.pluginId,options:[]};"datasource"===i.type?this.setDatasourceOptions(i,s):s.info||(s.info="Specify a string constant"),this.inputs.push(s),this.inputs[0].value="InfluxDB-"+this.dash.network.id}}catch(e){n=!0,r=e}finally{try{!t&&a.return&&a.return()}finally{if(n)throw r}}}this.inputsValid=0===this.inputs.length,this.inputValueChanged(),this.titleChanged(),this.uidChanged(!0)}}},{key:"addDatasourceOption",value:function(){var e=a.default.datasources,t={id:this.datasource.id,name:this.datasource.name,type:"influxdb",database:this.network.id,jsonData:{keepCookies:[]},url:"/api/datasources/proxy/"+this.datasource.id,meta:{alerting:!0,annotations:!0,baseUrl:"public/app/plugins/datasource/influxdb",dependencies:{grafanaVersion:"*",plugins:[]},explore:!1,hasQueryHelp:!0,id:"influxdb",includes:null,info:{author:{name:"Grafana Project",url:"https://grafana.com"},description:"InfluxDB Data Source for Grafana",links:null,logos:{small:"public/app/plugins/datasource/influxdb/img/influxdb_logo.svg",large:"public/app/plugins/datasource/influxdb/img/influxdb_logo.svg"},screenshots:null,updated:"",version:"5.0.0"},logs:!1,metrics:!0,module:"app/plugins/datasource/influxdb/module",name:"InfluxDB",queryOptions:{minInterval:!0},routes:null,type:"datasource"}};e[this.datasource.name]=t}},{key:"setDatasourceOptions",value:function(e,t){var n=o.default.filter(a.default.datasources,function(t){return t.type===e.pluginId});0===n.length?t.info="No data sources of type "+e.pluginName+" found":t.info||(t.info="Select a "+e.pluginName+" data source"),t.options=n.map(function(e){return{text:e.name,value:e.name}})}},{key:"inputValueChanged",value:function(){this.inputsValid=!0;var e=!0,t=!1,n=void 0;try{for(var r,o=this.inputs[Symbol.iterator]();!(e=(r=o.next()).done);e=!0){r.value.value||(this.inputsValid=!1)}}catch(e){t=!0,n=e}finally{try{!e&&o.return&&o.return()}finally{if(t)throw n}}}},{key:"titleChanged",value:function(){var e=this;this.titleTouched=!0,this.nameExists=!1,this.validationSrv.validateNewDashboardName(this.folderId,this.dash.title).then(function(){e.nameExists=!1,e.hasNameValidationError=!1}).catch(function(t){"EXISTING"===t.type&&(e.nameExists=!0),e.hasNameValidationError=!0,e.nameValidationError=t.message})}},{key:"uidChanged",value:function(e){var t=this;this.uidExists=!1,this.hasUidValidationError=!1,!0===e&&this.dash.uid&&(this.autoGenerateUidValue="value set"),this.backendSrv.getDashboardByUid(this.dash.uid).then(function(e){t.uidExists=!0,t.hasUidValidationError=!0,t.uidValidationError="Dashboard named '"+e.dashboard.title+"' in folder '"+e.meta.folderTitle+"' has the same uid"}).catch(function(e){e.isHandled=!0})}},{key:"onFolderChange",value:function(e){this.folderId=e.id,this.titleChanged()}},{key:"onEnterFolderCreation",value:function(){this.inputsValid=!1}},{key:"onExitFolderCreation",value:function(){this.inputValueChanged()}},{key:"isValid",value:function(){return this.inputsValid&&null!==this.folderId}},{key:"saveDashboard",value:function(){var e=this;this.dash.network.id=this.dash.title,this.createDatasource(this.dash.network,this.dash).then(function(){e.addDatasourceOption(),e.inputs[0].value=e.datasource.name;var t=e.inputs.map(function(e){return{name:e.name,type:e.type,pluginId:e.pluginId,value:e.value}}),n={id:e.dash.title,host:e.host,port:e.port,samples:1e4,time:1e4,monitored:!1,nodi:e.dash.network.nodi};return e.dash.network=n,e.dash.panels[0].datasource=e.datasource.name,e.createDB(),e.backendSrv.post("api/dashboards/import",{dashboard:e.dash,overwrite:!0,inputs:t,folderId:e.folderId}).then(function(t){var n=i.default.stripBaseFromUrl(t.importedUrl);e.$location.url(n)}).catch(function(e){s.appEvents.emit("alert-error",["Network saving failed",e])})}).catch(function(e){return console.info(e)})}},{key:"loadJsonText",value:function(){try{this.parseError="",this.onUpload(JSON.parse(this.jsonText))}catch(e){console.log(e),this.parseError=e.message}}},{key:"back",value:function(){this.gnetUrl="",this.step=1}}]),e}()).templateUrl="components/importNet.html"},function(e,t,n){"use strict";n.r(t),n.d(t,"stripBaseFromUrl",function(){return a});var r=n(7),o=n.n(r),a=function(e){var t=o.a.appSubUrl,n=t.endsWith("/")?1:0;return e.length>0&&0===e.indexOf(t)?e.slice(t.length-n):e};t.default={stripBaseFromUrl:a}},function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1));function a(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){return function r(o,a){try{var i=t[o](a),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}("next")})}}var i=n(29),s=function(e){function t(e,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n,r));return console.info("New Influx"),o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i),r(t,[{key:"createDB",value:function(){var e=a(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.info("createDB()"),t="q=CREATE DATABASE "+this.database,e.abrupt("return",o.ajax({url:this.host+this.port+"/query?",type:"GET",contentType:"application/octet-stream",data:t,processData:!1,success:function(e){console.info(e),console.info("database created")},error:function(e,t,n){console.log("Error: "+n)}}));case 3:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"insertSingle",value:function(){var e=a(regeneratorRuntime.mark(function e(t,n,r){var a,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:for(a=t+",",i=0;i<n.length;i++)a+=n[i]+"="+r[i],i<n.length-2?a+=",":a+=" ";return e.abrupt("return",o.ajax({url:this.host+this.port+"/write?db="+this.database,type:"POST",contentType:"application/octet-stream",data:a,processData:!1,error:function(e,t,n){console.log("Error: "+n)}}));case 3:case"end":return e.stop()}},e,this)}));return function(t,n,r){return e.apply(this,arguments)}}()},{key:"insert",value:function(){var e=a(regeneratorRuntime.mark(function e(t,n,r){var o,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:for(o=[],a=0;a<t.length;a++)o.push(this.insertSingle(t[a],n[a],r[a]));return e.abrupt("return",Promise.all(o));case 3:case"end":return e.stop()}},e,this)}));return function(t,n,r){return e.apply(this,arguments)}}()},{key:"drop",value:function(){var e=a(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t="q=DROP DATABASE "+this.database,e.abrupt("return",o.ajax({url:this.host+this.port+"/query?",type:"GET",contentType:"application/octet-stream",data:t,processData:!1,success:function(e){console.info(e),console.info("database dropped")},error:function(e,t,n){console.log("Error: "+n)}}));case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()}]),t}();e.exports=s},function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),console.info("NetParser()"),this.jsonNet=null,this.hasErrors=!1}return r(e,[{key:"getParentIndex",value:function(e,t){for(var n=-1,r=0;r<t.length;r++)e===t[r].id&&(n=r);return n}},{key:"ascendingOrder",value:function(e){for(var t=0;t<e.length-1;t++)if(e[t]>e[t+1])return console.info("Not ascending order in the thresholds given: "),console.info("threshold "+t+" >  threshold "+(t+1)),console.info(e[t]+" > "+e[t+1]),!1;return!0}},{key:"isOk",value:function(e){return e.stati.length===e.soglie.length&&this.ascendingOrder(e.soglie)}},{key:"controlNameNodes",value:function(e){for(var t=0;t<e.nodi.length;t++)for(var n=0;n<e.nodi.length;n++)if(n!==t&&e.nodi[t].id===e.nodi[n].id)return console.info("Duplicate id between node n°"+t+" and node n°"+n+" with id="+e.nodi[n].id),!0;return!1}},{key:"checkNormalize",value:function(e){for(var t=0,n=0;n<e.length;n++)t+=e[n];return console.info(t),t>=.99&&t<=1}},{key:"checkCpt",value:function(e,t){if(1===e)return 1===t.length&&this.checkNormalize(t[0]);if(e!==t.length)return!1;for(var n=0;n<t.length;n++)if(this.checkNormalize(t[n]))return console.info("Not normalized probability"),!1;return!0}},{key:"checkSemantic",value:function(e){console.info("checkSemantic()"),this.jsonNet=e;var t=void 0,n=void 0;for(this.hasErrors=this.controlNameNodes(this.jsonNet),t=0;t<this.jsonNet.nodi.length;t++)if(!this.isOk(this.jsonNet.nodi[t]))return this.hasErrors=!0,!1;if(this.hasErrors)return!1;var r=void 0,o=void 0;for(t=0;t<this.jsonNet.nodi.length;t++)if(1,null!==(o=this.jsonNet.nodi[t]).parents)for(n=0;n<o.parents.length;n++){if(-1===(r=this.getParentIndex(o.parents[n],this.jsonNet.nodi)))return console.info("Missing parent n°"+n+" for node: "+o.id),this.hasErrors=!0,!1;this.jsonNet.nodi[r].stati.length}return!0}}]),e}();e.exports=new o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Control=void 0;var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(3);var a=n(36),i=n(13),s=n(15);(t.Control=function(){function e(t,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.$location=r,this.backendSrv=n,this.panel=t.ctrl.panel,this.loader=new i(n),this.onInitData(),this.load()}return e.$inject=["$scope","backendSrv","$location"],r(e,[{key:"load",value:function(){var e=this;this.loader.getDashboards().then(function(t){e.dashboards=t,e.networks=e.loader.extract(t),e.setDataFromNets(),e.wait()})}},{key:"wait",value:function(){this.backendSrv.get("/api/search?")}},{key:"onInitData",value:function(){this.samples=[],this.time=[],this.networks=[],this.dashboards=[],this.hasStarted=[]}},{key:"save",value:function(e){return this.backendSrv.saveDashboard(this.dashboards[e],{overwrite:!0}).then(function(){o.appEvents.emit("alert-success",["Salvataggio della rete avvenuto correttamente",""])}).catch(function(e){o.appEvents.emit("alert-error",["Impossibile salvare le modifiche alla rete",e])})}},{key:"setDataFromNets",value:function(){for(var e=void 0,t=void 0,n=void 0,r=0;r<this.networks.length;r++)console.info(this.networks[r].id),(e=this.networks[r].monitored)?this.hasStarted.push(e):this.hasStarted.push(!1),null!==(t=this.networks[r].samples)?this.samples.push(t):this.samples.push(1e4),null!==(n=this.networks[r].time)?this.time.push(n):this.time.push(1e4)}},{key:"setSamples",value:function(e,t){null!==e&&(this.samples[t]=e)}},{key:"setTime",value:function(e,t){null!==e&&(this.time[t]=e)}},{key:"start",value:function(e){var t=this;this.hasStarted[e]=!0,this.networks[e].monitored=!0,this.networks[e].time=this.time[e],this.networks[e].samples=this.samples[e],this.save(e).then(function(){a.setBackendSrv(t.backendSrv),a.start(t.networks[e],e)})}},{key:"stop",value:function(e){var t=this;this.hasStarted[e]=!1,this.networks[e].monitored=!1,this.save(e).then(function(){a.setBackendSrv(t.backendSrv),a.stop(t.networks[e],e)})}},{key:"delete",value:function(e){var t=this;this.stop(e);var n=this.dashboards[e].uid;console.info({uid:n}),this.backendSrv.getDashboardByUid(n).then(function(r){console.info(r.dashboard.network.id),new s(t.networks[e].host,t.networks[e].port,t.networks[e].id).drop().then(function(){t.networks.splice(e,1),t.backendSrv.deleteDashboard(n).then(function(){t.deleteDatasource(r.dashboard.network.id).then(function(){location.reload()})})}).catch(function(e){return console.info(e)})}).catch(function(e){o.appEvents.emit("alert-error",["An error occurred","Try refreshing this page"]),e.isHandled=!0})}},{key:"deleteDatasource",value:function(e){return this.backendSrv.delete("/api/datasources/name/InfluxDB-"+e).then(function(e){return console.info(e)}).catch(function(e){return console.info(e)})}},{key:"redirect",value:function(){this.$location.url("plugins/dreamcorp-app/page/import-bayesian-network")}}]),e}()).templateUrl="components/control.html"},function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(3);var a=n(15),i=n(13),s=n(37),u=n(40),l=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.backendSrv=null,this.networks=[],this.logic_networks=[],this.influxes=[]}return r(e,[{key:"setBackendSrv",value:function(e){null===this.backendSrv&&(this.backendSrv=e,u.addBackend(e))}},{key:"loopAsync",value:function(e){var t=this;console.info("loopAsync()");var n=new i(this.backendSrv);n.getNets().then(function(r){t.networks=r,t.linkDatabases(),t.logic_networks=s.buildAllNets(t.networks),t.timer=setInterval(function(){t.stopLoop&&setTimeout(function(){return clearInterval(t.timer)},0),n.getNets().then(function(e){t.networks=e;for(var n=void 0,r=void 0,o=void 0,a=void 0,i=function(e){if(!t.networks[e].monitored)return"continue";a=[];for(var i=function(o){if(null===(r=t.networks[e].nodi[o].panel))return t.logic_networks[e].unobserve(t.networks[e].nodi[o].id),"continue";a.push(u.getValueFromAlert(e,o,r).then(function(r){null!==r&&(n=t.decideState(e,o,r),t.logic_networks[e].observe(t.networks[e].nodi[o].id,t.networks[e].nodi[o].stati[n]))}))},s=0;s<t.networks[e].nodi.length;s++)i(s);Promise.all(a).then(function(){t.samplingNet(e).then(function(){for(var n=[],r=[],a=[],i=0;i<t.networks[e].nodi.length;i++)n.push(t.networks[e].nodi[i].id),r.push(t.networks[e].nodi[i].stati),a.push(t.logic_networks[e].node(t.networks[e].nodi[i].id).probs());o=t.findDatabase(t.networks[e].id),t.influxes[o].insert(n,r,a).catch(function(e){return console.info(e)})})})},s=0;s<t.networks.length;s++)i(s)})},e)})}},{key:"findDatabase",value:function(e){for(var t=0;t<this.influxes.length;t++)if(e===this.influxes[t].database)return t}},{key:"linkDatabases",value:function(){for(var e=0;e<this.networks.length;e++)this.influxes.push(new a(this.networks[e].host,this.networks[e].port,this.networks[e].id))}},{key:"start",value:function(e,t){this.stopLoop=!1,o.appEvents.emit("alert-success",["Started Loop Net "+(t+1),""]),this.loopAsync(e.time)}},{key:"stop",value:function(e,t){var n=this;o.appEvents.emit("alert-success",["Stopped Loop Net "+(t+1),""]),new i(this.backendSrv).getNets().then(function(e){for(var t=0,r=0;r<e.length;r++)e[r].monitored&&t++;0===t&&(n.stopLoop=!0)})}},{key:"decideState",value:function(e,t,n){for(var r=0,o=0;o<this.networks[e].nodi[t].soglie.length-1&&n>this.networks[e].nodi[t].soglie[o];o++)r++;return r}},{key:"samplingNet",value:function(){var e,t=(e=regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.logic_networks[t].sample(1e6);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e,this)}),function(){var t=e.apply(this,arguments);return new Promise(function(e,n){return function r(o,a){try{var i=t[o](a),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}("next")})});return function(e){return t.apply(this,arguments)}}()}]),e}();e.exports=new l},function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var o=n(38),a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),console.info("LogicNetBuilder"),this.logicNet=null,this.logicNets=[]}return r(e,[{key:"buildLogicNet",value:function(t){this.logicNet=o.newGraph();var n=void 0,r=void 0,a=[];for(n=0;n<t.nodi.length;n++)a.push(this.logicNet.addNode(t.nodi[n].id,t.nodi[n].stati));var i=void 0,s=void 0;for(n=0;n<t.nodi.length;n++){if(null!==(s=t.nodi[n]).parents)for(r=0;r<s.parents.length;r++)i=e.getParentIndex(s.parents[r],a),a[n].addParent(a[i]);a[n].setCpt(t.nodi[n].cpt)}return this.logicNet}},{key:"buildAllNets",value:function(e){this.logicNets=[];for(var t=0;t<e.length;t++)this.logicNets.push(this.buildLogicNet(e[t]));return this.logicNets}}],[{key:"getParentIndex",value:function(e,t){for(var n=-1,r=0;r<t.length;r++)e===t[r].name&&(n=r);return n}}]),e}();e.exports=new a},function(e,t,n){"use strict";(function(e){var n,r,o,a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(i){function s(e){for(var t=[],n=0,r=0;r<e;r++)t[r]=Math.random(),n+=t[r];for(r=0;r<e;r++)t[r]=t[r]/n;return t}function u(e,t,n){if(t&&t.length>0){if(1===t.length||n===t.length-1){for(var r=t[1===t.length?0:n].values.length,o=[],a=0;a<r;a++){var i=s(e.length);o.push(i)}return o}for(o=[],r=t[n].values.length,a=0;a<r;a++){i=u(e,t,n+1);o.push(i)}return o}return s(e.length)}function l(e,t){return new Promise(function(n,r){try{n(e.apply(void 0,t))}catch(e){r(e)}})}function c(e){return e.constructor===Array}function h(e,t,n){if(c(a=e)&&a.length>0&&c(a[0])){var r=n;for(o=0;o<e.length;o++)r=h(e[o],t,r);return r}for(var o=0;o<e.length;o++)e[o]=t[n][o];var a;return n+1}function f(e){for(var t=[],n=0,r=0;r<e.length;r++)t[r]=e[r]+.001,n+=t[r];for(r=0;r<e.length;r++)t[r]=t[r]/n;return t}function d(){var e={};return e.newGraph=function(){return{nodes:[],saveSamples:!1,samples:[],reinit:function(){return l(function(e){for(var t=0;t<e.nodes.length;t++){var n=e.nodes[t];(void 0===n.dirty||n.dirty)&&(n.cpt=u(n.values,n.parents,0),n.dirty=!1)}},[this])},samplesAsCsv:function(e){for(var t=e||{},n=t.rowDelimiter||"\n",r=t.fieldDelimiter||",",o="",a="",i=0;i<this.nodes.length;i++)a+=this.nodes[i].name,i<this.nodes.length-1&&(a+=r);o+=a+n;for(i=0;i<this.samples.length;i++){var s=this.samples[i];a="";for(var u=0;u<this.nodes.length;u++){a+=s[this.nodes[u].name],u<this.nodes.length-1&&(a+=r)}o+=a,i<this.samples.length-1&&(o+=n)}return o},sample:function(e){return l(function(e,t){e.saveSamples&&(e.samples=[]);for(var n=e.nodes.length-1;n>=0;n--)e.nodes[n].initSampleLw();for(var r=0,o=0;o<t;o++){for(n=e.nodes.length-1;n>=0;n--)(s=e.nodes[n]).isObserved||(s.value=-1),s.wasSampled=!1;var a=1;for(n=e.nodes.length-1;n>=0;n--)a*=(s=e.nodes[n]).sampleLw();for(r+=a,n=e.nodes.length-1;n>=0;n--)(s=e.nodes[n]).saveSampleLw(a);if(e.saveSamples){var i={};for(n=e.nodes.length-1;n>=0;n--){var s;i[(s=e.nodes[n]).name]=s.values[s.value]}e.samples.push(i)}}return r},[this,e])},update:function(e){for(var t=0;t<this.nodes.length;t++){var n=this.nodes[t],r=e[n.name];r&&(n.value=r.value,n.wasSampled=r.wasSampled,n.sampledLw=r.sampledLw)}},node:function(e){if(!this.nodeMap){this.nodeMap={};for(var t=0;t<this.nodes.length;t++){var n=this.nodes[t];this.nodeMap[n.name]=n}}return this.nodeMap[e]},observe:function(e,t){var n=this.node(e);if(n){var r=n.valueIndex(t);r>=0?(n.isObserved=!0,n.value=r):console.error("could not find value "+t+" for node "+e)}else console.error("could not find node with name "+e)},unobserve:function(e){var t=this.node(e);t&&(t.isObserved=!1,t.value=-1)},addNode:function(e,t){var n={name:e,values:t,value:-1,parents:[],wasSampled:!1,sampledLw:void 0,addParent:function(e){return this.parents.push(e),this.dirty=!0,this},valueIndex:function(e){if(!this.valueIndexMap){this.valueIndexMap={};for(var t=0;t<this.values.length;t++){var n=this.values[t];this.valueIndexMap[n]=t}}return this.valueIndexMap[e]},initSampleLw:function(){this.sampledLw=void 0},sampleLw:function(){if(this.wasSampled)return 1;for(var e=1,t=0;t<this.parents.length;t++){e*=this.parents[t].sampleLw()}this.wasSampled=!0;var n=this.cpt;for(t=0;t<this.parents.length;t++){n=n[this.parents[t].value]}if(-1!=this.value)e*=n[this.value];else{var r=Math.random();for(t=0;t<n.length;t++){if((r-=n[t])<0){this.value=t;break}}}return e},saveSampleLw:function(e){if(!this.sampledLw){this.sampledLw=new Array(this.values.length);for(var t=this.values.length-1;t>=0;t--)this.sampledLw[t]=0}this.sampledLw[this.value]+=e},setCpt:function(e){0===this.parents.length?this.cpt=f(e):this.cpt=function(e,t,n){var r=u(e,t,0);return h(r,n,0),r}(this.values,this.parents,function(e){for(var t=[],n=0;n<e.length;n++)t.push(f(e[n]));return t}(e))},probs:function(){if(!this.sampledLw)return[];for(var e=0,t=[],n=0;n<this.sampledLw.length;n++){var r=this.sampledLw[n];e+=r,t.push(r)}for(n=0;n<this.sampledLw.length;n++)t[n]=t[n]/e;return t}};return this.nodes.push(n),n}}},e.toMessage=function(e){for(var t={},n={},r=0;r<e.nodes.length;r++){var o=e.nodes[r],a={name:o.name,values:o.values,value:o.value,parents:[],wasSampled:o.wasSampled,sampledLw:o.sampledLw,cpt:o.cpt};t[o.name]=a;for(var i=[],s=0;s<o.parents.length;s++){var u=o.parents[s];i.push(u.name)}n[o.name]=i}var l={samples:1e4,nodes:t,parents:n};return JSON.stringify(l)},e}"object"===a(e)&&e&&"object"===a(e.exports)?e.exports=d():("undefined"==typeof jsbayes&&(i.jsbayes=d()),r=[],n=d(),void 0===(o="function"==typeof n?n.apply(t,r):n)||(e.exports=o))}(void 0)}).call(this,n(39)(e))},function(e,t,n){"use strict";e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();function o(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){return function r(o,a){try{var i=t[o](a),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}("next")})}}var a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),console.info("AlertData"),this.backend=null,this.data=[]}return r(e,[{key:"addBackend",value:function(e){this.backend=e}},{key:"getDataFromAlert",value:function(){var e=o(regeneratorRuntime.mark(function e(t,n,r){var o=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.backend.get("/api/alerts/?panelId="+r).then(function(e){var r={value:null,node:null,net:null};null!==e&&0!==e.length&&null!==e[0]&&0!==e[0].length&&null!==e[0].evalData&&null!==e[0].evalData.evalMatches&&0!==e[0].evalData.evalMatches.length&&null!==e[0].evalData.evalMatches[0].value&&(r.value=e[0].evalData.evalMatches[0].value,r.node=n,r.net=t),o.data.push(r)}).catch(function(e){return e.isHandled=!0});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e,this)}));return function(t,n,r){return e.apply(this,arguments)}}()},{key:"getValueFromAlert",value:function(){var e=o(regeneratorRuntime.mark(function e(t,n,r){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.backend.get("/api/alerts/?panelId="+r).then(function(e){var t=null;return null!==e&&0!==e.length&&null!==e[0]&&0!==e[0].length&&null!==e[0].evalData&&null!==e[0].evalData.evalMatches&&0!==e[0].evalData.evalMatches.length&&null!==e[0].evalData.evalMatches[0].value&&(t=e[0].evalData.evalMatches[0].value),t}).catch(function(e){return e.isHandled=!0});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e,this)}));return function(t,n,r){return e.apply(this,arguments)}}()},{key:"getDataFromAllAlerts",value:function(e){var t=this;this.networks=e;for(var n=[],r=null,o={value:null,net:null,node:null},a=0;a<this.networks.length;a++)if(this.networks[a].monitored)for(var i=0;i<this.networks[a].nodi.length;i++)(r=this.networks[a].nodi[i].panel)?n.push(this.getDataFromAlert(a,i,r)):(o.net=a,o.node=i,this.data.push(o));Promise.all(n).then(function(){return t.data})}}]),e}();e.exports=new a},,,,function(e,t){},,,,,,function(e,t){}])});
//# sourceMappingURL=module.js.map