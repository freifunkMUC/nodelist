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
	if(row.isOnline == false) {
		row.style = 'background: #ff0000;'
	}
	row.hostname = ni.hostname;

	if(typeof ni.location != 'undefined') {
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

	if(typeof node.statistics != 'undefined') {
		var stats = node.statistics;
		if(typeof stats.traffic != 'undefined') {
			if(typeof stats.traffic.forward != 'undefined') {
				row.trafor = stats.traffic.forward.bytes;
			}
			if(typeof stats.traffic.forward != 'undefined') {
				row.tramgrx = stats.traffic.mgmt_rx.bytes;
			}
			if(typeof stats.traffic.forward != 'undefined') {
				row.tramgtx = stats.traffic.mgmt_tx.bytes;
			}
			if(typeof stats.traffic.forward != 'undefined') {
				row.trarx = stats.traffic.rx.bytes;
			}
			if(typeof stats.traffic.forward != 'undefined') {
				row.tratx = stats.traffic.tx.bytes;
			}
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
		row.clients = stats.clients;
		row.gateway = stats.gateway;
		enums.gateways[row.gateway] = true;
		if(row.isOnline) {
			row.uptime = ~~(stats.uptime);
			if (row.uptime == 0) {row.uptime = 999999999;}

			row.tramgrxu = ~~(row.tramgrx / row.uptime);
			row.tramgtxu = ~~(row.tramgtx / row.uptime);

			row.style = 'background: #ffff00;';

			if (row.uptime >= 3*60) {row.style = 'background: #ffff44;'}
			if (row.uptime >= 10*60) {row.style = 'background: #ffff88;'}
			if (row.uptime >= 30*60) {row.style = 'background: #ffffcc;'}
			if (row.uptime >= 1*3600) {row.style = 'background: #eeffee;'}
			if (row.uptime >= 3*3600) {row.style = 'background: #ddffdd;'}
			if (row.uptime >= 6*3600) {row.style = 'background: #ccffcc;'}
			if (row.uptime >= 12*3600) {row.style = 'background: #bbffbb;'}
			if (row.uptime >= 1*24*3600) {row.style = 'background: #aaffaa;'}
			if (row.uptime >= 3*24*3600) {row.style = 'background: #99ff99;'}
			if (row.uptime >= 10*24*3600) {row.style = 'background: #88ff88;'}
			if (row.uptime >= 30*24*3600) {row.style = 'background: #77ff77;'}

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

var renderBool = function(record, ind, col_ind) {
	var val = record[this.columns[col_ind].field];
	if(typeof val == 'undefined') return;
	return val ? '&#x2714;' : '&#x2718;';
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
	{ resizable: true, sortable: true, field: 'isOnline'    , caption: 'Online'      , size: '40px', render: renderBool, style: 'text-align: center;', hidden: true},
	{ resizable: true, sortable: true, field: 'isGateway'   , caption: 'Gateway'     , size: '40px', render: renderBool, style: 'text-align: center;', hidden: true},
	{ resizable: true, sortable: true, field: 'hasVpn'      , caption: 'VPN'         , size: '40px', render: renderBool, style: 'text-align: center;'},
	{ resizable: true, sortable: true, field: 'hasNeighbour', caption: 'Link'        , size: '40px', render: renderBool, style: 'text-align: center;', hidden: true},
	{ resizable: true, sortable: true, field: 'vpnCnt'      , caption: 'VPNs'        , size: '50px', style: 'text-align: right;', hidden: true},
	{ resizable: true, sortable: true, field: 'neighbourCnt', caption: 'Links'       , size: '50px', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'clients'     , caption: 'Clients'     , size: '50px', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'id'          , caption: 'Node ID'     , size: '100px', style: 'font-family: monospace;'},
	{ resizable: true, sortable: true, field: 'hostname'    , caption: 'Hostname'    , size: '200px'},
	{ resizable: true, sortable: true, field: 'owner'       , caption: 'Owner'       , size: '200px'},
	{ resizable: true, sortable: true, field: 'version'     , caption: 'Gluon Vers.' , size: '140px'},
	{ resizable: true, sortable: true, field: 'model'       , caption: 'HW model'    , size: '200px'},
	{ resizable: true, sortable: true, field: 'nproc'       , caption: 'Procs'       , size: '40px', style: 'text-align: right;', hidden: true},
	{ resizable: true, sortable: true, field: 'autoupdater' , caption: 'Updates'     , size: '90px'},
	{ resizable: true, sortable: true, field: 'gateway'     , caption: 'Gateway'     , size: '50px', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'site'        , caption: 'Site'        , size: '60px'},
	{ resizable: true, sortable: true, field: 'uptime'      , caption: 'Uptime'      , size: '70px', render: 'age'},
	{ resizable: true, sortable: true, field: 'firstSeen'   , caption: 'First seen'  , size: '80px', render: 'date: DD.MM.YYYY', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'lastSeen'    , caption: 'Last seen'   , size: '80px', render: 'date: DD.MM.YYYY', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'rootfsUsage' , caption: '\%root'      , size: '50px', render: renderPercent, style: 'text-align: right; position: relative;'},
	{ resizable: true, sortable: true, field: 'memoryUsage' , caption: '\%Mem'       , size: '50px', render: renderPercent, style: 'text-align: right; position: relative;'},
	{ resizable: true, sortable: true, field: 'loclat'      , caption: 'Latitude'    , size: '100px'},
	{ resizable: true, sortable: true, field: 'loclon'      , caption: 'Longitude'   , size: '100px'},
	{ resizable: true, sortable: true, field: 'netaddr'     , caption: 'Addresses'   , size: '700px', hidden: true},
	{ resizable: true, sortable: true, field: 'netaddrc'    , caption: 'Addr\#'      , size: '50px', style: 'text-align: right;', hidden: true},
	{ resizable: true, sortable: true, field: 'trafor'      , caption: 'ForwardBytes', size: '100px', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'tramgrx'     , caption: 'MgmtRXBytes' , size: '100px', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'tramgtx'     , caption: 'MgmtTXBytes' , size: '100px', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'trarx'       , caption: 'RXBytes'     , size: '100px', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'tratx'       , caption: 'TXBytes'     , size: '100px', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'tramgrxu'    , caption: 'MgmtRXBpU'   , size: '100px', style: 'text-align: right;'},
	{ resizable: true, sortable: true, field: 'tramgtxu'    , caption: 'MgmtTXBpU'   , size: '100px', style: 'text-align: right;'},
];

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
		onClick: function (target, data) {
			if(target.target == 'about') {
				$('#about-popup').w2popup();
			}
		},
	},
	multiSelect: false,
	reorderColumns: true,
	records: records,
	columns: cols,
	searches: [
		{field: 'isOnline'    , caption: 'Is online?', type: 'combo', options: {items: [true, false]}},
		{field: 'isGateway'   , caption: 'Is gateway?', type: 'combo', options: {items: [true, false]}},
		{field: 'vpnCnt'      , caption: 'VPNs'          , type: 'int',  options: {min: 0}},
		{field: 'neighbourCnt', caption: 'Links'         , type: 'int',  options: {min: 0}},
		{field: 'id'          , caption: 'Node ID'       , type: 'text'},
		{field: 'hostname'    , caption: 'Hostname'      , type: 'text'},
		{field: 'owner'       , caption: 'Owner'         , type: 'text'},
		{field: 'version'     , caption: 'Gluon Version' , type: 'enum', options: {items: Object.keys(enums.versions)}},
		{field: 'model'       , caption: 'Hardware model', type: 'enum', options: {items: Object.keys(enums.models)}},
		{field: 'nproc'       , caption: '# proc'        , type: 'int',  options: {min: 0}},
		{field: 'autoupdater' , caption: 'Updates'       , type: 'enum', options: {items: ['Off', 'stable', 'experimental']}},
		{field: 'clients'     , caption: '# clients'     , type: 'int',  options: {min: 0}},
		{field: 'gateway'     , caption: 'Gateway'       , type: 'enum', options: {items: Object.keys(enums.gateways)}},
		{field: 'site'        , caption: 'Site'          , type: 'enum', options: {items: Object.keys(enums.sites)}},
		{field: 'uptime'      , caption: 'Uptime'        , type: 'float'},
		{field: 'firstSeen'   , caption: 'First seen'    , type: 'date'},
		{field: 'lastSeen'    , caption: 'Last seen'     , type: 'date'},
		{field: 'rootfsUsage' , caption: 'Root FS usage' , type: 'percent', outTag: '%'},
		{field: 'memoryUsage' , caption: 'Memory usage'  , type: 'percent', outTag: '%'},
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
