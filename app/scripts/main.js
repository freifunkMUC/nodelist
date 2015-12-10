/* Freifunk Knoten Liste
 * Copyright (c) 2015  Skruppy <skruppy@onmars.eu>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var records = [];
var nodes = {};
var nodeCnt = 0;

// Try this: http://w2ui.com/web/demos/#!grid/grid-5
w2popup.lock('Loading', true);
var rawNodes = $.ajax({
	type: 'GET',
	url: nodelistconfig.dataPath + 'nodes.json',
	dataType: 'json',
	success: function() { },
	data: {},
	async: false,
}).responseJSON.nodes;

var rawGraph = $.ajax({
	type: 'GET',
	url: nodelistconfig.dataPath + 'graph.json',
	dataType: 'json',
	success: function() { },
	data: {},
	async: false,
}).responseJSON.batadv;

var enums = {gateways: {}, versions: {}, models: {}, sites: {}};

$.each(rawNodes, function(i, node){
	if(typeof node.nodeinfo == undefined) {
		//console.log('Useless node:', node);
		return;
	}
	if(i in nodes) {
		//console.log('Duplicate node:', nodes[i], node);
		return;
	}
	nodes[i] = node;
	nodes[i].recid = nodeCnt++;
	nodes[i].vpns = [];
	nodes[i].neighbours = [];
});

$.each(rawGraph.links, function(i, link) {
	var srcId = rawGraph.nodes[link.source].node_id;
	var dstId = rawGraph.nodes[link.target].node_id;
	
	if(!(srcId in nodes && dstId in nodes)) {
		return;
	}
	
	delete link.source;
	delete link.target;
	link.src = nodes[srcId].recid;
	link.dst = nodes[dstId].recid;
	
	if(link.vpn) {
		nodes[srcId].vpns.push(link);
		nodes[dstId].vpns.push(link);
	}
	else {
		nodes[srcId].neighbours.push(link);
		nodes[dstId].neighbours.push(link);
	}
});

$.each(nodes, function(i, node){
	var ni = node.nodeinfo;
	var row = {id: i, recid: node.recid, node: node};
	
	row.isOnline = node.flags.online;
	row.isGateway = node.flags.gateway;
	row.vpnCnt = node.vpns.length;
	row.neighbourCnt = node.neighbours.length;
	row.hasVpn = row.vpnCnt > 0;
	row.hasNeighbour = row.neighbourCnt > 0;
	row.hostname = ni.hostname;
	row.hasLocation = typeof ni.location != 'undefined';
	
	if(row.hasLocation) {
		row.loclat = ni.location.latitude;
		row.loclon = ni.location.longitude;
	}
	
	if(typeof ni.network != 'undefined') {
		if(typeof ni.network.addresses != 'undefined') {
			var row_netaddr = ni.network.addresses;
			row.netaddr = row_netaddr.sort();
			row.netaddrc = row.netaddr.length;
		}
	}
	
	if(typeof ni.hardware != 'undefined') {
		row.model = ni.hardware.model;
		row.nproc = ni.hardware.nproc;
		enums.models[row.model] = true;
	}
	if(typeof ni.software != 'undefined') {
		var sw = ni.software;
		if(typeof sw.autoupdater != 'undefined') {
			row.autoupdater = sw.autoupdater.enabled ? sw.autoupdater.branch : 'Off';
		}
		row.version = sw.firmware.release;
		enums.versions[row.version] = true;
	}
	row.owner = typeof ni.owner != 'undefined' ? ni.owner.contact : undefined;
	if(typeof node.statistics != 'undefined') {
		var stats = node.statistics;
		
		row.clients = stats.clients;
		row.gateway = stats.gateway;
		enums.gateways[row.gateway] = true;
		
		if(row.isOnline) {
			if (stats.uptime > 0) {
				row.traFwd        = stats.traffic.forward.bytes;
				row.traRx         = stats.traffic.rx.bytes;
				row.traTx         = stats.traffic.tx.bytes;
				row.traMgmtRx     = stats.traffic.mgmt_rx.bytes;
				row.traMgmtTx     = stats.traffic.mgmt_tx.bytes;
				row.traFwdRate    = row.traFwd    / stats.uptime;
				row.traRxRate     = row.traRx     / stats.uptime;
				row.traTxRate     = row.traTx     / stats.uptime;
				row.traMgmtRxRate = row.traMgmtRx / stats.uptime;
				row.traMgmtTxRate = row.traMgmtTx / stats.uptime;
			}
			
			row.uptime = moment().subtract(stats.uptime, 'seconds').toDate();
		}
		row.rootfsUsage = typeof stats.rootfs_usage != 'undefined' ? stats.rootfs_usage*100 : undefined;
		row.memoryUsage = typeof stats.memory_usage != 'undefined' ? stats.memory_usage*100 : undefined;
	}
	
	row.firstSeen = moment.utc(node.firstseen).local().toDate();
	row.lastSeen = moment.utc(node.lastseen).local().toDate();
	
	if(typeof ni.system != 'undefined') {
		row.site = ni.system.site_code;
		enums.sites[row.site] = true;
	}
	
	records.push(row);
});


var renderUptime = function(record, ind, col_ind) {
	var val = record[this.columns[col_ind].field];
	var color;
	var text;
	
	if(typeof val == 'undefined') {
		color = '#faaaaa';
		text  = '';
	}
	else {
		var secs = moment().diff(val, 'seconds');
		
		text = moment(val).fromNow(true);
		var p = Math.min(Math.pow(secs / (nodelistconfig.nodeUpDays*24*360), nodelistconfig.nodeUpGamma), 1.0);
		
		var s = nodelistconfig.nodeUpStartColor;
		var e = nodelistconfig.nodeUpEndColor;
		
		color = 'hsl('+
		        (s.h + (e.h - s.h) * p)+', ' +
		        (s.s + (e.s - s.s) * p)+'%, ' +
		        (s.l + (e.l - s.l) * p)+'%)';
	}
	
	return '<div style="position: absolute; left: 0px; top:0px; right: 0px; bottom: 0px; padding: 0px; background: '+color+';"></div>' +
	       '<div style="position: relative;">'+text+'</div>';
}

var renderBool = function(record, ind, col_ind) {
	var val = record[this.columns[col_ind].field];
	if(typeof val == 'undefined') return;
	return val ? '&#x2714;' : '&#x2718;';
}

var renderAddresses = function(record, ind, col_ind) {
	var val = record[this.columns[col_ind].field];
	if(typeof val == 'undefined') return;
	
	var html = '';
	val.forEach(function(address, i) {
		if(i > 0) {
			html += ', ';
		}
		html += '<a href="http://[' + address + ']">' + address + '</a>';
	});
	
	return html;
}

var renderData = function(record, col_ind, tab, suffix) {
	var val = record[tab.columns[col_ind].field];
	if(typeof val == 'undefined') return;
	
	var i = 0;
	while(val > nodelistconfig.dataMagnitudes[i].threshold && i <= nodelistconfig.dataMagnitudes.length - 1) {
		i++;
	}
	
	var magnitude = nodelistconfig.dataMagnitudes[i];
	return (val/magnitude.scale).toFixed(magnitude.tailing) + ' ' + magnitude.suffix + suffix;
}

var renderDataAbs = function(record, ind, col_ind) {
	return renderData(record, col_ind, this, '');
}

var renderDataRel = function(record, ind, col_ind) {
	return renderData(record, col_ind, this, '/s');
}

var renderPercent = function(record, ind, col_ind) {
	var val = record[this.columns[col_ind].field];
	if(typeof val == 'undefined') return;
	
	return '<div style="position: absolute; left: 0px; top:2px; right: 0px; bottom: 2px; padding: 0px;">' +
	       '    <div style="background: linear-gradient(to right, rgba(129,181,234,1) 0%,rgba(202,223,246,1) 100%); height: 100%; width:'+val+'%; overflow: hidden;"></div>' +
	       '</div>' +
	       '<div style="position: relative;">'+val.toFixed(1)+'%</div>';
}

var cols = [
	{ resizable: true, sortable: true, field: 'isOnline'      , caption: 'Online'         , size:  '40px', render: renderBool,         style: 'text-align: center;'},
	{ resizable: true, sortable: true, field: 'isGateway'     , caption: 'Gateway'        , size:  '40px', render: renderBool,         style: 'text-align: center;'},
	{ resizable: true, sortable: true, field: 'hasVpn'        , caption: 'VPN'            , size:  '40px', render: renderBool,         style: 'text-align: center;'},
	{ resizable: true, sortable: true, field: 'hasNeighbour'  , caption: 'Link'           , size:  '40px', render: renderBool,         style: 'text-align: center;'},
	{ resizable: true, sortable: true, field: 'hasLocation'   , caption: 'Location'       , size:  '40px', render: renderBool,         style: 'text-align: center;'},
	{ resizable: true, sortable: true, field: 'vpnCnt'        , caption: 'VPNs'           , size:  '50px',                             style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'neighbourCnt'  , caption: 'Links'          , size:  '50px',                             style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'clients'       , caption: 'Clients'        , size:  '50px',                             style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'id'            , caption: 'Node ID'        , size: '100px',                             style: 'font-family: monospace;'},
	{ resizable: true, sortable: true, field: 'hostname'      , caption: 'Hostname'       , size: '200px'},
	{ resizable: true, sortable: true, field: 'owner'         , caption: 'Owner'          , size: '200px'},
	{ resizable: true, sortable: true, field: 'version'       , caption: 'Gluon Vers.'    , size: '140px'},
	{ resizable: true, sortable: true, field: 'model'         , caption: 'HW model'       , size: '200px'},
	{ resizable: true, sortable: true, field: 'nproc'         , caption: 'Procs'          , size:  '40px',                             style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'autoupdater'   , caption: 'Updates'        , size:  '90px'},
	{ resizable: true, sortable: true, field: 'gateway'       , caption: 'Gateway'        , size:  '50px',                             style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'site'          , caption: 'Site'           , size: '100px'},
	{ resizable: true, sortable: true, field: 'uptime'        , caption: 'Uptime'         , size:  '70px', render: renderUptime,       style: 'text-align: right; position: relative;'},
	{ resizable: true, sortable: true, field: 'firstSeen'     , caption: 'First seen'     , size:  '80px', render: 'date: DD.MM.YYYY', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'lastSeen'      , caption: 'Last seen'      , size:  '80px', render: 'date: DD.MM.YYYY', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'rootfsUsage'   , caption: '\%root'         , size:  '50px', render: renderPercent,      style: 'text-align: right; position: relative;'},
	{ resizable: true, sortable: true, field: 'memoryUsage'   , caption: '\%Mem'          , size:  '50px', render: renderPercent,      style: 'text-align: right; position: relative;'},
	{ resizable: true, sortable: true, field: 'loclat'        , caption: 'Latitude'       , size:  '80px'},
	{ resizable: true, sortable: true, field: 'loclon'        , caption: 'Longitude'      , size:  '80px'},
	{ resizable: true, sortable: true, field: 'netaddr'       , caption: 'Addresses'      , size: '700px', render: renderAddresses,    style: 'font-family: monospace; text-decoration: none; letter-spacing: -0.07em;'},
	{ resizable: true, sortable: true, field: 'netaddrc'      , caption: 'Addr\#'         , size:  '50px',                             style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traFwd'        , caption: 'Data Fwd.'      , size: '100px', render: renderDataAbs,      style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traRx'         , caption: 'Data RX'        , size: '100px', render: renderDataAbs,      style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traTx'         , caption: 'Data TX'        , size: '100px', render: renderDataAbs,      style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traMgmtRx'     , caption: 'Mgmt. RX'       , size: '100px', render: renderDataAbs,      style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traMgmtTx'     , caption: 'Mgmt. TX'       , size: '100px', render: renderDataAbs,      style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traFwdRate'    , caption: 'Data Fwd. Rate' , size: '100px', render: renderDataRel,      style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traRxRate'     , caption: 'Data RX Rate'   , size: '100px', render: renderDataRel,      style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traTxRate'     , caption: 'Data TX Rate'   , size: '100px', render: renderDataRel,      style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traMgmtRxRate' , caption: 'Mgmt. RX Rate'  , size: '100px', render: renderDataRel,      style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'traMgmtTxRate' , caption: 'Mgmt. TX Rate'  , size: '100px', render: renderDataRel,      style: 'text-align: right;'},
];

cols.forEach(function(el) {
	el.hidden = nodelistconfig.showCols.indexOf(el.field) < 0;
});


$('#grid').w2grid({
	name: 'grid',
	header: document.title = nodelistconfig.siteName + ' Knotenliste',
	show: {
		header:        true,
		toolbar:       true,
		toolbarReload: false,
		footer:        true,
		lineNumbers:   true,
	},
	toolbar: {
		items: [
			{ type: 'spacer' },
			{ type: 'button', id: 'about', caption: 'About', icon: 'w2ui-icon-question' },
		],
		onClick: function (tgt, data) {
			// This is some strange bug. Depending on weather this script is uglified or not, tgt is a string or an object.
			if(tgt == 'about' || tgt.target == 'about') {
				w2popup.open({
					title: 'About',
					body: `
	<h1>About</h1>
	This is <em>node list</em>,
	a webfrontend for the node data of a <a href="https://freifunk.net">Freifunk</a> <a href="https://freifunk.net/wie-mache-ich-mit/community-finden">Community</a>.
	It's beeing developed by the <a href="http://ffmuc.net">Freifunk München</a>.
	Its <a href="https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)">AGPL 3</a> licensed source code can be found on <a href="https://github.com/freifunkMUC/nodelist">Github</a>.
	
	
	<h1>License</h1>
	<p>
		<a href="https://github.com/freifunkMUC/nodelist">Freifunk node list</a></br>
		Copyright &copy; 2015  <a href="https://github.com/Skrupellos">Skruppy</a>
	</p>
	
	<p>
		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU Affero General Public License as
		published by the Free Software Foundation, either version 3 of the
		License, or (at your option) any later version.
	</p>
	
	<p>
		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU Affero General Public License for more details.
	</p>
	
	<p>
		You should have received a copy of the GNU Affero General Public License
		along with this program.  If not, see <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/</a>.
	</p>
	
	
	<h1>Software credits</h1>
	<h2><a href="http://www.w2ui.com/">w2ui</a></h2>
	Licensed under <a href="https://tldrlegal.com/license/mit-license">MIT License</a> by vitmalina@gmail.com.
	
	<h2><a href="http://momentjs.com/">Moment.js</a></h2>
	Licensed under <a href="https://tldrlegal.com/license/mit-license">MIT License</a> by Tim Wood, Iskren Chernev and Moment.js contributors.
	
	<h2><a href="https://jquery.com/">jQuery</a></h2>
	Licensed under <a href="https://tldrlegal.com/license/mit-license">MIT License</a> by jQuery Foundation and other contributors.
	
	
	<h1>Contributors</h1>
	<ul>
		<li><a href="https://github.com/Skrupellos">Skruppy</a></li>
		<li><a href="https://github.com/freifunkMUC/nodelist/graphs/contributors">Other contributors</a>
	</ul>
`,
				});
			}
		},
	},
	multiSelect: false,
	reorderColumns: true,
	records: records,
	columns: cols,
	searches: [
		//{field: 'isOnline'    , caption: 'Is online?', type: 'combo', options: {items: [true, false]}},
		//{field: 'isGateway'   , caption: 'Is gateway?', type: 'combo', options: {items: [true, false]}},
		//{field: 'hasVpn'   , caption: 'Is gateway?', type: 'combo', options: {items: [true, false]}},
		//{field: 'hasNeighbour'   , caption: 'Is gateway?', type: 'combo', options: {items: [true, false]}},
		//{field: 'hasLocation'   , caption: 'Is gateway?', type: 'combo', options: {items: [true, false]}},
		{field: 'vpnCnt'        , caption: 'VPNs'           , type: 'int',  options: {min: 0}},
		{field: 'neighbourCnt'  , caption: 'Links'          , type: 'int',  options: {min: 0}},
		{field: 'clients'       , caption: '# clients'      , type: 'int',  options: {min: 0}},
		{field: 'id'            , caption: 'Node ID'        , type: 'text'},
		{field: 'hostname'      , caption: 'Hostname'       , type: 'text'},
		{field: 'owner'         , caption: 'Owner'          , type: 'text'},
		{field: 'version'       , caption: 'Gluon Version'  , type: 'enum', options: {items: Object.keys(enums.versions)}},
		{field: 'model'         , caption: 'Hardware model' , type: 'enum', options: {items: Object.keys(enums.models)}},
		{field: 'nproc'         , caption: '# proc'         , type: 'int',  options: {min: 0}},
		{field: 'autoupdater'   , caption: 'Updates'        , type: 'enum', options: {items: ['Off', 'stable', 'experimental']}},
		{field: 'gateway'       , caption: 'Gateway'        , type: 'enum', options: {items: Object.keys(enums.gateways)}},
		{field: 'site'          , caption: 'Site'           , type: 'enum', options: {items: Object.keys(enums.sites)}},
		//{field: 'uptime'        , caption: 'Uptime'         , type: 'float'},
		{field: 'firstSeen'     , caption: 'First seen'     , type: 'date'},
		{field: 'lastSeen'      , caption: 'Last seen'      , type: 'date'},
		{field: 'rootfsUsage'   , caption: 'Root FS usage'  , type: 'percent', outTag: '%'},
		{field: 'memoryUsage'   , caption: 'Memory usage'   , type: 'percent', outTag: '%'},
		{field: 'loclat'        , caption: 'Latitude'       , type: 'float'},
		{field: 'loclon'        , caption: 'Longitude'      , type: 'float'},
		{field: 'netaddr'       , caption: 'Addresses'      , type: 'text'},
		{field: 'netaddrc'      , caption: '# Addresses'    , type: 'int',  options: {min: 0}},
		{field: 'traFwd'        , caption: 'Data Fwd.'      , type: 'int',  options: {min: 0}},
		{field: 'traRx'         , caption: 'Data RX'        , type: 'int',  options: {min: 0}},
		{field: 'traTx'         , caption: 'Data TX'        , type: 'int',  options: {min: 0}},
		{field: 'traMgmtRx'     , caption: 'Mgmt. RX'       , type: 'int',  options: {min: 0}},
		{field: 'traMgmtTx'     , caption: 'Mgmt. TX'       , type: 'int',  options: {min: 0}},
		{field: 'traFwdRate'    , caption: 'Data Fwd. Rate' , type: 'float',  options: {min: 0}},
		{field: 'traRxRate'     , caption: 'Data RX Rate'   , type: 'float',  options: {min: 0}},
		{field: 'traTxRate'     , caption: 'Data TX Rate'   , type: 'float',  options: {min: 0}},
		{field: 'traMgmtRxRate' , caption: 'Mgmt. RX Rate'  , type: 'float',  options: {min: 0}},
		{field: 'traMgmtTxRate' , caption: 'Mgmt. TX Rate'  , type: 'float',  options: {min: 0}},
	],
	onExpand: function (event) {
		if (w2ui.hasOwnProperty('subgrid-' + event.recid)) w2ui['subgrid-' + event.recid].destroy();
		$('#'+ event.box_id).css({ margin: '0px', padding: '0px', width: '100%' }).animate({ height: '105px' }, 100);
		setTimeout(function () {
			subRecords = [];
			
			$.each(records[event.recid].node.neighbours, function(i, link) {
				subRecords.push(records[event.recid == link.src ? link.dst : link.src]);
			});
			
			$('#'+ event.box_id).w2grid({
				name: 'subgrid-' + event.recid,
				show: { columnHeaders: true },
				fixedBody: false,
				columns: cols,
				records: subRecords,
			});
			w2ui['subgrid-' + event.recid].resize();
		}, 300);
	},
	onDblClick: function(event) {
		window.open(nodelistconfig.mapPath + '/#!v:m;n:'+records[event.recid].id, '_blank');
	},
});

w2popup.unlock();
