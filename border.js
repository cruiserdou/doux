/**
 * 
 */
Ext.require(['*']);
Ext.onReady(function(){
  var cw;
	var viewport = null;
	
	function closeRegion(e, target, header, toll){
		var region = header.ownerCt;
		newRegions.unshift(region.initialConfig);
		viewport.remove(region);
	}
	
	viewport = Ext.create('Ext.Viewport', {
		layout: {
			type: 'border',
			padding: 5
		},
		defaults: {
			split: true,
		},
		items: [{
			region: 'north',
			collapsible: true,
			title: 'North',
			split: true,
			minHeight: 60,
			html: 'north'
		},{
			region: 'west',
			collapsible: true,
			title: 'Starts at with 30%',
			split: true,
			width: '30%',
			minWidth: 100,
			minHeight: 140,
			html: 'west<br>I am floatabel'
		},{
			region: 'center',
			html: 'center center',
			title: 'Center',
			minHeight: 80,
			items: [cw = Ext.create('Ext.Window',{
				xtype: 'window',
				closable: false,
				minimizable: true,
				title: 'Constrained Window',
				height: 200,
				width: 400,
				constrain: true,
				html: 'I am in a container',
				itemId: 'center-window',
				minimize: function(){
					this.floatParent.down('button#toggleCw').toggle();
				}
			})],
			bbar: ['Text followed by a spacer', ' ', {
				itemsId: 'toggleCw',
				text: 'Constrained Window',
				enableToggle: true,
				toggleHandler: function(){
					cw.setVisible(!cw.isVisible());
				}
			},{
				text: 'Ajax Request',
				listeners: {
					click: function(){
						Ext.Ajax.request({
					        url : 'ajax_server.jsp',
					        params : {roleid:'me'},
				            success : function(xhr){
				               
				                	Ext.Msg.alert('alert', 'Success!');		               
		              	         
				              },
				            failure:function(xhr){
		    						Ext.Msg.alert("alert", "failure!");
		    				}
				            });	
					}
				}
			}]
		}]
	});
});









