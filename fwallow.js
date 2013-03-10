/*
 * 本文件包含以下功能：
 * 1.取水许可信息
 * 2.取水许可单位
 * 3.取水许可流程图
 */
function fwallowlicense(){
  var cw = null; /* 内部Window */
	var curRecord = null;
	var add_form = Ext.create('Ext.form.Panel', {
        bodyPadding: 15,
        border: false,
        fieldDefaults: {
            labelAlign: 'top',
            msgTarget: 'side'
        },
        defaults: {
            border: false,
            xtype: 'panel',
            flex: 1,
            layout: 'anchor'
        },

        layout: 'hbox',
        items: [{
            items: [{
                xtype:'textfield',
                fieldLabel: '取水单位名称',
                anchor: '-10',
                name: 'dfagnm',
                allowBlank: false,
            },{
                xtype:'textfield',
                fieldLabel: '登记号',
                anchor: '-10',
                name: 'regnum',
                allowBlank: false,
            },{
                xtype:'datefield',
                fieldLabel: '发证日期',
                name: 'grantdate',
                format: 'Y-m-d',
                anchor: '-10',
            },{
                xtype:'datefield',
                fieldLabel: '取水有效期开始日期',
                format: 'Y-m-d',
                anchor: '-10',
                name: 'validitysdate'
            }, {
                xtype:'fieldset',
				anchor: '-10',
                title: '年取水总量(万m³)',
                collapsible: true,
                defaults: {
					labelWidth: 89,
					anchor: '100%'
				},
				items: [{
					xtype: 'textfield',
					fieldLabel: '地表',
					name: 'surquantity'
				},{
					xtype: 'textfield',
					fieldLabel: '地下',
					name: 'underquantity',
				}]
            },{
				xtype: 'textareafield',
				anchor: '-10',
				name: 'nt',
				fieldLabel: '备注'
			}]
        }, {
            items: [{
                xtype:'textfield',
                fieldLabel: '所属市县',
                anchor: '100%',
                allowBlank: false,
                name: 'addvnm'
            },{
                xtype:'textfield',
                fieldLabel: '取水水源方式',
                anchor: '100%',
                name: 'fwstype'
            },{
                xtype:'datefield',
                fieldLabel: '收件日期',
                format: 'Y-m-d',
                anchor: '100%',
                name: 'getdate'
            }, {
                xtype:'datefield',
                fieldLabel: '取水有效期结束日期',
                format: 'Y-m-d',
                anchor: '100%',
                name: 'validityedate'
            }, {
                xtype:'fieldset',
				anchor: '100%',
                title: '取水用途(万m³)',
                collapsible: true,
                defaults: {
					labelWidth: 89,
					anchor: '100%'
				},
				items: [{
					xtype: 'textfield',
					fieldLabel: '农业',
					name: 'agriquantity',
				},{
					xtype: 'textfield',
					fieldLabel: '工业',
					name: 'industryquantity'
				},{
					xtype: 'textfield',
					fieldLabel: '生活',
					name: 'livequantity'
				},{
					xtype: 'textfield',
					fieldLabel: '其它',
					name: 'otherquantity'
				}]
            }]
        }]
    });
	
	//更新Panel
	var update_form = null;
	update_form = Ext.create('Ext.form.Panel', {
		baseCls : 'x-plain',
		autoScroll: true,
		autoHeight: true,
		padding : '20 0 20 20',
		width : 350,
		border : false,
		fieldDefaults : {
			msgTarget : 'side',
			labelAlign : 'top',
			labelWidth : 80
		},
		defaultType : 'textfield',
		defaults : {
			anchor : '100%'
		},
		items : [{
            fieldLabel: '取水单位名称',
            allowBlank: false,
            name: 'dfagnm'
        },{
            fieldLabel: '所属市县',
            allowBlank: false,
            name: 'addvnm'
        },{
            fieldLabel: '登记号',
            name: 'regnum',
            readOnly: true
        },{
            fieldLabel: '取水水源方式',
            name: 'fwstype'
        },{
            xtype:'datefield',
            fieldLabel: '发证日期',
            name: 'grantdate',
            format: 'Y-m-d'
        },{
            xtype:'datefield',
            fieldLabel: '收件日期',
            format: 'Y-m-d',
            name: 'getdate'
        },{
            xtype:'datefield',
            fieldLabel: '取水有效期开始日期',
            format: 'Y-m-d',
            name: 'validitysdate'
        }, {
            xtype:'datefield',
            fieldLabel: '取水有效期结束日期',
            format: 'Y-m-d',
            name: 'validityedate'
        }, {
            xtype:'fieldset',
            title: '年取水总量(万m³)',
            collapsible: true,
            defaults: {
				labelWidth: 89,
				anchor: '100%'
			},
			items: [{
				xtype: 'textfield',
				fieldLabel: '地表',
				name: 'surquantity'
			},{
				xtype: 'textfield',
				fieldLabel: '地下',
				name: 'underquantity',
			}]
        }, {
            xtype:'fieldset',
			anchor: '100%',
            title: '取水用途(万m³)',
            collapsible: true,
            defaults: {
				labelWidth: 89,
				anchor: '100%'
			},
			items: [{
				xtype: 'textfield',
				fieldLabel: '农业',
				name: 'agriquantity',
			},{
				xtype: 'textfield',
				fieldLabel: '工业',
				name: 'industryquantity'
			},{
				xtype: 'textfield',
				fieldLabel: '生活',
				name: 'livequantity'
			},{
				xtype: 'textfield',
				fieldLabel: '其它',
				name: 'otherquantity'
			}]
        }, {
			xtype : 'textarea',
			name : 'nt',
			fieldLabel : '备注'
		}, {
			xtype : 'button',
			iconCls : 'icon-save',
			text : '保存',
			handler : function(){
				if (update_form.form.isValid()){
					update_form.form.submit({
						waitTitle: '请稍后',
						waitMsg: '正在保存........',
						url: 'fwallowl_update.action',
						success: function(form, action){
							Ext.example.msg('系统提示', action.result.message);
							store.load();
						},
						failure: function(form, action){
							if(action.result)
								Ext.example.msg('系统提示', action.result.message);
							else
								Ext.example.msg('系统提示', '系统错误！');
						}
					});
				}
			}
		} ]
	});
	
	var fwallowlicense_update = Ext.create('Ext.Panel', { /* 更新面板 */
		region : 'east',
		layout : 'fit',
		collapseMode : 'mini',
		collapsed : true,
		useSplitTips : true,
		width : 260,
		minSize : 260,
		maxSize : 260,
		items : [ update_form ]
	});
	
	//取水许可grid数据源
	var store = Ext.create('Ext.data.Store', {
		fields : [{name : 'sernum'}, {name : 'dfagnm'}, {name : 'addvnm'}, {name : 'surquantity'}, {name : 'underquantity'}, {name : 'agriquantity'}, {name : 'industryquantity'}, {name : 'livequantity'},
		          {name: 'otherquantity'},  {name : 'nt'}, {name : 'regnum'}, {name : 'fwstype'}, {name : 'grantdate'}, {name : 'getdate'}, {name : 'validitysdate'}, {name : 'validityedate'},
		          {name: 'allquantity'}],
		proxy : {
			type : 'ajax',
			url : 'fwallowl_select.action',
			actionMethods: {
                read: 'POST'
            },
			reader : {
				type : 'json',
				root : 'list'
			}
		},
		autoLoad : true
    });
	
	//定义取水单位下拉框
	var store_wuer = Ext.create('Ext.data.Store', {
		fields : [{name : 'dfagnm'}],
		proxy : {
			type : 'ajax',
			url : 'fwallowl_select_wuser.action',
			actionMethods: {
                read: 'POST'
            },
			reader : {
				type : 'json',
				root : 'list'
			}
		},
		autoLoad : true
    });
	var wfuser_combo = Ext.create('Ext.form.ComboBox', {
    	store: store_wuer,
    	queryMode: 'local',
        triggerAction: 'all',
        valueField: 'dfagnm',
        displayField: 'dfagnm',
        name : 'dfagnm',
        selectOnFocus : true,
        fieldLabel: '取水单位'
    });
	//定义取水单位下拉框
	var store_addv = Ext.create('Ext.data.Store', {
		fields : [{name : 'addvnm'}],
		proxy : {
			type : 'ajax',
			url : 'fwallowl_select_addv.action',
			actionMethods: {
                read: 'POST'
            },
			reader : {
				type : 'json',
				root : 'list'
			}
		},
		autoLoad : true
    });
	var addv_combo = Ext.create('Ext.form.ComboBox', {
    	store: store_addv,
        mode : 'local',
        triggerAction: 'all',
        valueField: 'addvnm',
        displayField: 'addvnm',
        name : 'addvnm',
        selectOnFocus : true,
        fieldLabel: '所属市县'
    });
	
	var sdate_datefield = Ext.create('Ext.form.field.Date', {
		xtype : 'datefield',
		format: 'Y-m-d',
		fieldLabel : '有效期开始日期',
		name : 'validitysdate'
	});
	var edate_datefield = Ext.create('Ext.form.field.Date', {
		xtype : 'datefield',
		format: 'Y-m-d',
		fieldLabel : '有效期开始日期',
		name : 'validityedate'
	});
	
	var query_form = null;
	query_form = Ext.create('Ext.form.Panel', {
		border : false,
		bodyStyle : 'padding:20px 5px 0',
		width : 660,
		fieldDefaults : {
			labelAlign : 'right',
			msgTarget : 'side'
		},
		defaults : {
			border : false,
			xtype : 'panel',
			flex : 1,
			layout : 'anchor'
		},

		layout : 'hbox',
		items : [ {
			flex : 6,
			items : [ wfuser_combo, addv_combo]
		}, {
			flex : 6,
			items : [ sdate_datefield, edate_datefield]
		}, {
			bodyStyle : 'padding:3px 5px 0',
			flex : 2,
			layout : {
				type : 'vbox',
				align : 'stretch',
				pack : 'start'
			},
			items : [ {
				xtype : 'button',
				iconCls : 'find',
				text : '查找',
				handler: function(){
					store.load({
						params: {
							dfagnm: wfuser_combo.getValue(),
							addvnm: addv_combo.getValue(),
							validitysdate: sdate_datefield.getValue(),
							validityedate: edate_datefield.getValue()
						}
					});
				}
			}, {
				xtype : 'button',
				iconCls : 'silk-refresh',
				text : '重置',
				handler: function(){
					query_form.form.reset();
					store.load();
				}
			} ]
		} ]
	});

	var fwallowlicense_query = Ext.create('Ext.Panel', { /* 查询面板 */
		height : 100,
		region : 'north',
		items : [ query_form ]
	});

	/* ======================创建工具栏==================== */
	var action_add = Ext.create('Ext.Action', {
		text : '添加',
		iconCls : 'silk-add',
		handler : function() {
			cw.setVisible(!cw.isVisible());
		}
	});
	var action_update = Ext.create('Ext.Action', {
		text : '修改',
		iconCls : 'silk-modify',
		handler : function() {
			fwallowlicense_update.toggleCollapse();
		}
	});
	var action_del = Ext.create('Ext.Action', {
		text : '删除',
		iconCls : 'silk-delete',
		handler : function() {
			Ext.Ajax.request({
				url : 'fwallowl_delete.action',
				params : {
					regnum : curRecord.get('regnum')
				},
				success : function(xhr) {
					Ext.example.msg('系统提示', '已删除' + curRecord.get('regnum'));
					//重置更新Panel
					update_form.form.reset();
					store.load({
						params: {
							dfagnm: wfuser_combo.getValue(),
							addvnm: addv_combo.getValue()
						}
					});
				},
				failure : function(xhr) {
					Ext.example.msg('系统提示', '操作失败！');
				}
			});
		}
	});
	var action_export = Ext.create('Ext.Action', {
		text : '导出',
		iconCls : 'silk-excel',
		handler : function() {
			var map = new Map();
			map.put("dfagnm", "取水单位");
			map.put("regnum", "登记号");
			map.put("addvnm", "所属市县");
			map.put("surquantity", "地表水");
			map.put("underquantity", "地下水");
			map.put("allquantity", "小计");
			map.put("agriquantity", "农业");
			map.put("industryquantity", "工业");
			map.put("livequantity", "生活");
			map.put("otherquantity", "其他");
			map.put("nt", "备注");
			map.put("fwstype", "取水水源方式");
			map.put("grantdate", "发证日期");
			map.put("getdate", "收件日期");
			map.put("validityedate", "取水许可有效期开始时间");
			map.put("validityedate", "取水许可有效期结束日期");
			ExportExcel(store, map);
		}
	});
	var action_refresh = Ext.create('Ext.Action', {
		text : '刷新',
		iconCls : 'silk-refresh',
		handler : function() {
			store.load({
				params: {
					dfagnm: wfuser_combo.getValue(),
					addvnm: addv_combo.getValue()
				}
			});
		}
	});
	var toolbar = Ext.create('Ext.toolbar.Toolbar', {
		items : [ action_add, '-', action_update, '-', action_del, '-',
				action_export, '-', action_refresh ]
	});

	var fwallowlicense_grid = Ext.create('Ext.grid.Panel', {
		region : 'center',
		store : store,
		columns : [
       {
			header : "取水单位",
			width : 160,
			dataIndex : 'dfagnm',
			sortable : false,
			locked: true
		}, {
			header : "所属市县",
			width : 100,
			dataIndex : 'addvnm',
			sortable : false
		},{
			text: '年取水总量（万m³）',
			columns: [ {
				header : "地表水",
				width : 70,
				dataIndex : 'surquantity',
				sortable : false,
				renderer : function(v){
					if (v == 0)
						return '';
					else
						return v;
				}
			}, {
				header : "地下水",
				width : 70,
				dataIndex : 'underquantity',
				sortable : false,
				renderer : function(v){
					if (v == 0)
						return '';
					else
						return v;
				}
			}, {
				header : "小计",
				width : 70,
				dataIndex : 'allquantity',
				sortable : false,
				renderer : function(v){
					if (v == 0)
						return '';
					else
						return v;
				}
			}]
		},{
			text: '取水用途（万m³）',
			columns: [{
				header : "农业",
				width : 70,
				dataIndex : 'agriquantity',
				sortable : false,
				renderer : function(v){
					if (v == 0)
						return '';
					else
						return v;
				}
			}, {
				header : "工业",
				width : 70,
				dataIndex : 'industryquantity',
				sortable : false,
				renderer : function(v){
					if (v == 0)
						return '';
					else
						return v;
				}
			}, {
				header : "生活",
				width : 70,
				dataIndex : 'livequantity',
				sortable : false,
				renderer : function(v){
					if (v == 0)
						return '';
					else
						return v;
				}
			}, {
				header : "其它",
				width : 70,
				dataIndex : 'otherquantity',
				sortable : false,
				renderer : function(v){
					if (v == 0)
						return '';
					else
						return v;
				}
			}]
		}, {
			header : "备注",
			width: 160,
			dataIndex : 'nt',
			sortable : false
		}, {
			header : "登记号",
			width : 190,
			dataIndex : 'regnum',
			sortable : false,
			locked: true
		}, {
			header : "取水水源方式",
			width : 150,
			dataIndex : 'fwstype',
			sortable : false
		}, {
			header : "发证日期",
			width : 100,
			dataIndex : 'grantdate',
			sortable : false,
			renderer: function(v){
				if (v == '1949-10-01')
					return '';
				else 
					return v;
			}
		}, {
			header : "收件日期",
			width : 100,
			dataIndex : 'getdate',
			sortable : false,
			renderer: function(v){
				if (v == '1949-10-01')
					return '';
				else 
					return v;
			}
		}, {
			header : "取水许可有效期开始",
			width : 140,
			dataIndex : 'validitysdate',
			sortable : false,
			renderer: function(v){
				if (v == '1949-10-01')
					return '';
				else 
					return v;
			}
		}, {
			header : "取水许可有效期结束",
			width : 140,
			dataIndex : 'validityedate',
			sortable : false,
			renderer: function(v){
				if (v == '1949-10-01')
					return '';
				else 
					return v;
			}
		} ]
	});
	
	fwallowlicense_grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
        if (selectedRecord.length) {
        	curRecord = selectedRecord[0];
            update_form.getForm().loadRecord(selectedRecord[0]);
        }
	});
	var panel = Ext.create('Ext.Panel', {
		title : '取水许可信息管理',
		itemId : 'fwallowlicense_panel',
		layout : 'border',
		closable : true,
		items : [ fwallowlicense_query, fwallowlicense_grid, fwallowlicense_update,
				cw = Ext.create('Ext.Window', {
					xtype : 'window',
					padding : 5,
					closable : false,
					title : '添加取水许可信息',
					plain : true,
					resizable : false,
					buttonAlign : 'right',
					height : 520,
					width : 490,
					closable: true,
					closeAction: 'hide',
					constrain : true,
					layout : 'fit',
					items : [ add_form ],
					buttons : [ {
						text : '保存',
						iconCls : 'icon-save',
						handler: function(){
							if (add_form.form.isValid()){
								add_form.form.submit({
									waitTitle: '请稍后',
									waitMsg: '正在保存........',
									url: 'fwallowl_add.action',
									success: function(form, action){
										Ext.example.msg('系统提示', action.result.message);
										add_form.form.reset();
										store.load();
									},
									failure: function(form, action){
										if(action.result)
											Ext.example.msg('系统提示', action.result.message);
										else
											Ext.example.msg('系统提示', '系统错误！');
									}
								});
							}
						}
					}, {
						text : '重置'
					} ]
				}) ],
		dockedItems : toolbar
	});

	Ext.getCmp('tabs_panel').add(panel);
	Ext.getCmp('tabs_panel').setActiveTab('fwallowlicense_panel');
}


//查询并显示取水许可户
function fwallowlicense_wuser(){
	var store = Ext.create('Ext.data.Store', {
		fields : [{name : 'dfagnm'}, {name : 'addvnm'}],
		
		proxy : {
			type : 'ajax',
			url : 'fwallowl_select_fwallowlicense_wuser.action',
			actionMethods: {
                read: 'POST'
            },
			reader : {
				type : 'json',
				root : 'list'
			}
		},
		autoLoad : true
    });
	
	var tradepanel = Ext.create('Ext.grid.Panel', {
		title : '取水许可单位',
		itemId: 'fwallowlicense_wuser_panel',
		closable: true,
		store : store,
		columns : [ new Ext.grid.RowNumberer(), {
			header : "取水许可单位",
			width : 180,
			dataIndex : 'dfagnm',
			sortable : false,
		},  {
			header : "所属市县",
			flex: 1,
			dataIndex : 'addvnm',
			sortable : true
		}],
		dockedItems: [{
			dock: 'top',
			xtype: 'toolbar',
			items: {
				width: 400,
                fieldLabel: '查找',
                labelWidth: 50,
                xtype: 'searchfield',
                store: store
			}
		}]
	});
	Ext.getCmp('tabs_panel').add(tradepanel);
    Ext.getCmp('tabs_panel').setActiveTab('fwallowlicense_wuser_panel');
}

//显示取水许可流程图
function fwallowlicense_flow(){
	var panel = Ext.create('Ext.panel.Panel', {
		closable: true,
		autoScroll: true,
		title: '取水许可流程图',
		itemId: 'fwallowlicense_flow_panel',
		html: '<img src="images/fwallowlicense.png" / style="padding: 20px;">'
	});
	Ext.getCmp('tabs_panel').add(panel);
    Ext.getCmp('tabs_panel').setActiveTab('fwallowlicense_flow_panel');
}

//显示取水许可计划表
function fwallowlicense_plan(){
	var panel = Ext.create('Ext.panel.Panel', {
		closable: true,
		autoScroll: true,
		title: '取水许可计划表',
		itemId: 'fwallowlicense_plan_panel',
		html: '<img src="images/plan.jpg" / style="padding: 20px;">'
	});
	Ext.getCmp('tabs_panel').add(panel);
    Ext.getCmp('tabs_panel').setActiveTab('fwallowlicense_plan_panel');
}

//显示取水许可计划表
function fwallowlicense_count(){
	var panel = Ext.create('Ext.panel.Panel', {
		closable: true,
		autoScroll: true,
		title: '取水许可统计表',
		itemId: 'fwallowlicense_count_panel',
		html: '<img src="images/acount1.jpg" / style="padding: 20px;"><img src="images/acount2.jpg" / style="padding: 20px;">'
	});
	Ext.getCmp('tabs_panel').add(panel);
    Ext.getCmp('tabs_panel').setActiveTab('fwallowlicense_count_panel');
}
