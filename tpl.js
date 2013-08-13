var index = null;
function wpayment(){
	var curRecord = null;
	//流水序号
	var ordernum = null;
	var unit = null;
	var feestandard = null;
	var unit2 = null;
	var feestandard2 = null;
	var cw = null; /* 内部Window */
	var pay_win = null;
	var store = null;
	var dt = new Date();
	
	Ext.QuickTips.init();    
    
    /*  xwQ	2012-7-27
    	添加去水资源费征收数据
    	经办人不显示在添加界面中，直接取Cookie中的数据出送到后台
    */
    
    var store_wuser = Ext.create('Ext.data.Store', {
		fields : [{name : 'dfagcd'}, {name : 'adag'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_wuser.action',
			extraParams: {
				usercd : userid,
				roleid: roleid
			},
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
    
    /*==================取水用途①处理==============*/
    var store_fwintention = Ext.create('Ext.data.Store', {
		fields : [{name : 'tradecd'}, {name : 'tradenm'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_fwintentionr.action',
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
    var store_wtype = Ext.create('Ext.data.Store', {
		fields : [{name : 'wtypecd'}, {name : 'wtypenm'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_wtype.action',
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
    
    var store_getFeeStandard = Ext.create('Ext.data.Store', {
		fields : [{name : 'feestandard'}, {name: 'unit'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_wfstandard.action',
			actionMethods: {
                read: 'POST'
            },
			reader : {
				type : 'json',
				root : 'list'
			}
		}
    });
	
	store_getFeeStandard.on("load", function(){
		feestandard = store_getFeeStandard.getAt(0).get('feestandard');
		unit = store_getFeeStandard.getAt(0).get('unit');
		fstandard_textfield.setValue(store_getFeeStandard.getAt(0).get('feestandard'));
	});
    
    /*创建缴费通知单流水编号输入框*/
    var pay_ser_num = Ext.create('Ext.form.field.Text', {
        xtype     : 'textfield',
        name      : 'sernum',
        fieldLabel: '流水编号',
        labelWidth: 120,
        msgTarget: 'side',
        readOnly: true,
        allowBlank: false
    });
    //缴费单位下拉框
    var wfuser_combo = null;
    var fwintention_combo1 = null;
    var fwstype_combo1 = null;
    var quantity1_textfield = null;
    var money1_textfield = null;
    var fstandard_textfield = null;
    var bdate_datefield = null;
    wfuser_combo = Ext.create('Ext.form.ComboBox', {
    	store: store_wuser,
        editable: false,
        mode : 'local',
        triggerAction: 'all',
        valueField: 'dfagcd',
        displayField: 'adag',
        name : 'dfagcd',
        fieldLabel: '缴费单位',
        labelWidth: 120,
        msgTarget: 'under',
        allowBlank: false,
        listeners: {
        	select: function(){
        		
        		if ((fwintention_combo1.getValue() != null && fwintention_combo1.getValue() != '') && 
        				(fwstype_combo1.getValue() != null && fwstype_combo1.getValue() != '')){
        			store_getFeeStandard.load({
            			params: {
            				dfagcd : wfuser_combo.getValue(),
            				fwintention1: fwintention_combo1.getValue(),
            				wtype1: fwstype_combo1.getValue()
            			}
            		});
        		}
        	}
        }
    });
    //取水用途下拉框
    fwintention_combo1 = Ext.create('Ext.form.ComboBox', {
    	labelWidth: 120,
        fieldLabel: '取水用途',
        mode : 'local',
        triggerAction: 'all',
        store: store_fwintention,
        valueField: 'tradecd',
        displayField: 'tradenm',
        anchor: '100%',
        emptyText: '选择取水用途',
        name: 'fwintention1',
        editable: false,
        listeners: {
        	select: function(){
        		if ((wfuser_combo.getValue() != null && wfuser_combo.getValue() != '') && 
        				(fwstype_combo1.getValue() != null && fwstype_combo1.getValue() != '')){
        			store_getFeeStandard.load({
            			params: {
            				dfagcd : wfuser_combo.getValue(),
            				fwintention1: fwintention_combo1.getValue(),
            				wtype1: fwstype_combo1.getValue()
            			}
            		});
        		}
        	}
        }
    });
    //水资源类型下拉框
    fwstype_combo1 = Ext.create('Ext.form.ComboBox',{
    	labelWidth: 120,
        xtype:'combo',
        fieldLabel: '水资源类型',
        mode : 'local',
        triggerAction: 'all',
        store: store_wtype,
        valueField: 'wtypecd',
        displayField: 'wtypenm',
        emptyText: '选择取水资源类型',
        anchor: '100%',
        name: 'wtype1',
        editable: false,
        listeners: {
        	select: function(){
        		if ((wfuser_combo.getValue() != null && wfuser_combo.getValue() != '') && 
        				(fwintention_combo1.getValue() != null && fwintention_combo1.getValue() != '')){
        			store_getFeeStandard.load({
            			params: {
            				dfagcd : wfuser_combo.getValue(),
            				fwintention1: fwintention_combo1.getValue(),
            				wtype1: fwstype_combo1.getValue()
            			}
            		});
        		}
        	}
        }
    } );
    /*创建取水量、发电量输入框*/
    quantity1_textfield = Ext.create('Ext.form.field.Text', {
    	labelWidth: 120,
        xtype:'textfield',
        fieldLabel: '发电量/取水量',
        anchor: '100%',
        name: 'quantity1',
        listeners: {
        	change: function(){
        		if ((wfuser_combo.getValue() != null && wfuser_combo.getValue() != '') && 
        				(fwintention_combo1.getValue() != null && fwintention_combo1.getValue() != '') && 
        				(fwstype_combo1.getValue() != null && fwstype_combo1.getValue() != '')){
        			/*计算缴费金额*/
        			money1_textfield.setValue(toDecimal(quantity1_textfield.getValue() * feestandard));
        		}else{
        			Ext.example.msg('系统提示', '请选择缴费单位、取水用途或水资源类型……');
        		}
        	}
        }
    });
    
    //将浮点数保留为两位小数
    function toDecimal(x){
    	var f = parseFloat(x);
    	if (isNaN(f))
    		return;
    	f = Math.round(x * 100) / 100;
    	return f;
    }
    /*创建缴费金额输入框*/
    money1_textfield = Ext.create('Ext.form.field.Text', {
    	labelWidth: 120,
        xtype:'textfield',
        readOnly: true,
        fieldLabel: '缴费金额',
        anchor: '100%',
        name: 'nmoney1'
    });
    
    fstandard_textfield = Ext.create('Ext.form.field.Text', {
    	labelWidth: 120,
        xtype:'textfield',
        readOnly: true,
        fieldLabel: '水资源收费征收标准',
        anchor: '100%',
        value: 0.0,
        name: 'fstandard',
        listeners: {
        	change: function(){
        		if ((wfuser_combo.getValue() != null && wfuser_combo.getValue() != '') && 
        				(fwintention_combo1.getValue() != null && fwintention_combo1.getValue() != '') && 
        				(fwstype_combo1.getValue() != null && fwstype_combo1.getValue() != '')){
        			/*技巧：计算缴费金额*/
        			money1_textfield.setValue(toDecimal(quantity1_textfield.getValue() * fstandard_textfield.getValue()));
        		}
        	}
        }
    });
    
    /*==================取水用途②处理==============*/
    var store_fwintention2 = Ext.create('Ext.data.Store', {
		fields : [{name : 'tradecd'}, {name : 'tradenm'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_fwintentionr.action',
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
    var store_wtype2 = Ext.create('Ext.data.Store', {
		fields : [{name : 'wtypecd'}, {name : 'wtypenm'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_wtype.action',
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
    
    var store_getFeeStandard2 = Ext.create('Ext.data.Store', {
		fields : [{name : 'feestandard'}, {name: 'unit'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_wfstandard.action',
			actionMethods: {
                read: 'POST'
            },
			reader : {
				type : 'json',
				root : 'list'
			}
		}
    });
	
	store_getFeeStandard2.on("load", function(){
		feestandard2 = store_getFeeStandard2.getAt(0).get('feestandard');
		unit2 = store_getFeeStandard2.getAt(0).get('unit');
		fstandard_textfield2.setValue(store_getFeeStandard2.getAt(0).get('feestandard'));
	});
    
    //缴费单位下拉框
    var fwintention_combo2 = null;
    var fwstype_combo2 = null;
    var quantity1_textfield2 = null;
    var money1_textfield2 = null;
    var fstandard_textfield2 = null;
    
    //取水用途下拉框
    fwintention_combo2 = Ext.create('Ext.form.ComboBox', {
    	labelWidth: 120,
        fieldLabel: '取水用途',
        mode : 'local',
        triggerAction: 'all',
        store: store_fwintention2,
        valueField: 'tradecd',
        displayField: 'tradenm',
        anchor: '100%',
        emptyText: '选择取水用途',
        name: 'fwintention2',
        editable: false,
        listeners: {
        	select: function(){
        		if ((wfuser_combo.getValue() != null && wfuser_combo.getValue() != '') && 
        				(fwstype_combo2.getValue() != null && fwstype_combo2.getValue() != '')){
        			store_getFeeStandard2.load({
            			params: {
            				dfagcd : wfuser_combo.getValue(),
            				fwintention1: fwintention_combo2.getValue(),
            				wtype1: fwstype_combo2.getValue()
            			}
            		});
        		}
        	}
        }
    });
    //水资源类型下拉框
    fwstype_combo2 = Ext.create('Ext.form.ComboBox',{
    	labelWidth: 120,
        xtype:'combo',
        fieldLabel: '水资源类型',
        mode : 'local',
        triggerAction: 'all',
        store: store_wtype2,
        valueField: 'wtypecd',
        displayField: 'wtypenm',
        emptyText: '选择取水资源类型',
        anchor: '100%',
        name: 'wtype2',
        editable: false,
        listeners: {
        	select: function(){
        		if ((wfuser_combo.getValue() != null && wfuser_combo.getValue() != '') && 
        				(fwintention_combo2.getValue() != null && fwintention_combo2.getValue() != '')){
        			store_getFeeStandard2.load({
            			params: {
            				dfagcd : wfuser_combo.getValue(),
            				fwintention1: fwintention_combo2.getValue(),
            				wtype1: fwstype_combo2.getValue()
            			}
            		});
        		}
        	}
        }
    } );
    /*创建取水量、发电量输入框*/
    quantity1_textfield2 = Ext.create('Ext.form.field.Text', {
    	labelWidth: 120,
        xtype:'textfield',
        fieldLabel: '发电量/取水量',
        anchor: '100%',
        name: 'quantity2',
        listeners: {
        	change: function(){
        		if ((wfuser_combo.getValue() != null && wfuser_combo.getValue() != '') && 
        				(fwintention_combo2.getValue() != null && fwintention_combo2.getValue() != '') && 
        				(fwstype_combo2.getValue() != null && fwstype_combo2.getValue() != '')){
        			/*计算缴费金额*/
        			money1_textfield2.setValue(toDecimal(quantity1_textfield2.getValue() * feestandard2));
        		}else{
        			Ext.example.msg('系统提示', '请选择缴费单位、取水用途或水资源类型……');
        		}
        	}
        }
    });

    /*创建缴费金额输入框*/
    money1_textfield2 = Ext.create('Ext.form.field.Text', {
    	labelWidth: 120,
        xtype:'textfield',
        readOnly: true,
        fieldLabel: '缴费金额',
        anchor: '100%',
        name: 'nmoney2'
    });
    
    fstandard_textfield2 = Ext.create('Ext.form.field.Text', {
    	labelWidth: 120,
        xtype:'textfield',
        readOnly: true,
        fieldLabel: '水资源收费征收标准',
        anchor: '100%',
        value: 0.0,
        name: 'fstandard2',
        listeners: {
        	change: function(){
        		if ((wfuser_combo.getValue() != null && wfuser_combo.getValue() != '') && 
        				(fwintention_combo2.getValue() != null && fwintention_combo2.getValue() != '') && 
        				(fwstype_combo2.getValue() != null && fwstype_combo2.getValue() != '')){
        			/*技巧：计算缴费金额*/
        			money1_textfield2.setValue(toDecimal(quantity1_textfield2.getValue() * fstandard_textfield2.getValue()));
        		}
        	}
        }
    });
    
    bdate_datefield = Ext.create('Ext.form.field.Date', {
    	xtype     : 'datefield',
        format: 'Y-m',
        editable : false,
        name      : 'bdate',
        labelWidth: 120,
        fieldLabel: '所属年月',
        msgTarget: 'under'
    });
    
    var add_form = Ext.create('Ext.form.Panel', {
        autoHeight: true,
        border: false,
        width   : 800,
        bodyPadding: 20,
        autoScroll : true,
        defaults: {
            anchor: '100%',
            labelWidth: 120
        },
        items   : [pay_ser_num
            , wfuser_combo, bdate_datefield, 
            {
                xtype: 'fieldset',
                title: '取水用途①',
                collapsible: true,
                defaults: {
                    labelWidth: 40,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items: [{
                	border: false,
                	defaults: {
                        border: false,
                        xtype: 'panel',
                        flex: 1,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    layout: 'hbox',
                    items: [{
                        items: [fwintention_combo1, fwstype_combo1, fstandard_textfield,quantity1_textfield , money1_textfield, {
                            xtype:'textfield',
                            labelWidth: 120,
                            readOnly: true,
                            fieldLabel: '计划取水量/发电量',
                            anchor: '100%',
                            value: 0.0,
                            name: 'tmplanquantity1',
                        },{
                        	labelWidth: 120,
                            xtype:'textfield',
                            readOnly: true,
                            fieldLabel: '超计划取水量/发电量',
                            anchor: '100%',
                            value: 0.0,
                            name: 'tmoplanquantity1',
                        }]
                    }],
                }],listeners: {
                	collapse: function(){
                		cw.setHeight(460);
                	},
                	expand: function(){
                		cw.setHeight(680);
                	}
                }
            },
            {
                xtype: 'fieldset',
                title: '取水用途②',
                collapsible: true,
                collapsed: true,
                defaults: {
                    labelWidth: 40,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items: [{
                	border: false,
                	defaults: {
                        border: false,
                        xtype: 'panel',
                        flex: 1,
                        labelAlign: 'right',
                        layout: 'anchor'
                    },
                    layout: 'hbox',
                    items: [{
                        items: [fwintention_combo2, fwstype_combo2, fstandard_textfield2, quantity1_textfield2 , money1_textfield2 ,{
                            xtype:'textfield',
                            labelWidth: 120,
                            readOnly: true,
                            fieldLabel: '计划取水量/发电量',
                            anchor: '100%',
                            value: 0,
                            name: 'tmplanquantity2',
                        },{
                        	labelWidth: 120,
                            xtype:'textfield',
                            readOnly: true,
                            fieldLabel: '超计划取水量/发电量',
                            anchor: '100%',
                            value: 0,
                            name: 'tmoplanquantity2',
                        }]
                    }],
                }],
                listeners: {
                	collapse: function(){
                		cw.setHeight(460);
                	},
                	expand: function(){
                		cw.setHeight(680);
                	}
                }
            }
        ]
    });
    
  //缴费单位下拉框	
	var qstore_wuser = Ext.create('Ext.data.Store', {
		fields : [{name : 'dfagcd'}, {name : 'adag'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_wuser.action',
			extraParams: {
				usercd : userid,
				roleid: roleid
			},
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
	
	var qwfuser_combo = Ext.create('Ext.form.ComboBox', {
    	store: qstore_wuser,
        editable: false,
        mode : 'local',
        triggerAction: 'all',
        valueField: 'adag',
        displayField: 'adag',
        name: 'adag',
        fieldLabel: '缴费单位',
        labelWidth: 80,
    });
	//行政区下拉框
	var qstore_addv = Ext.create('Ext.data.Store', {
		fields : [{name : 'addvcd'}, {name : 'addvnm'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_addv.action',
			extraParams: {
				usercd : userid,
				roleid: roleid
			},
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
	var qaddv_combo = Ext.create('Ext.form.ComboBox', {
    	store: qstore_addv,
        editable: false,
        mode : 'local',
        triggerAction: 'all',
        valueField: 'addvnm',
        displayField: 'addvnm',
        name : 'addvnm',
        fieldLabel: '行政区划',
        labelWidth: 80,
    });
	var qsbdate = null;
	qsbdate = Ext.create('Ext.form.field.Date', {
		editable: false,
		xtype : 'datefield',
		format: 'Y-m-d',
		fieldLabel : '开始日期',
		value: dt.getFullYear() + '-01-01',
		name : 'sbdate'
	});
	var qebdate = null;
	qebdate = Ext.create('Ext.form.field.Date', {
		editable: false,
		xtype : 'datefield',
		format: 'Y-m-d',
		fieldLabel : '结束日期',
		value: dt,
		name : 'ebdate'
	} );
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
			items : [qwfuser_combo, qaddv_combo]
		}, {
			flex : 6,
			items : [qsbdate , qebdate]
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
					store.load({params: {
						flag : Ext.getCmp('rdoIswuser').getValue().radio,
						adag: qwfuser_combo.getValue(),
						addvnm: qaddv_combo.getValue(),
						sbdate: qsbdate.getValue(),
						ebdate: qebdate.getValue(),
						usercd : userid,
						roleid: roleid
					}});
				}
			}, {
				xtype : 'button',
				iconCls : 'silk-refresh',
				text : '重置',
				handler: function(){
					query_form.form.reset();
					store.load({params: {
						flag : Ext.getCmp('rdoIswuser').getValue().radio,
						adag: wfuser_combo.getValue(),
						addvnm: qaddv_combo.getValue(),
						sbdate: qsbdate.getValue(),
						ebdate: qebdate.getValue(),
						usercd : userid,
						roleid: roleid
					}});
				}
			} ]
		} ]
	});
	
	//定义缴费状态下拉框
	Ext.define('State', {
		extend: 'Ext.data.Model',
		fields: [{type: 'int', name: 'index'}, {type: 'String', name: 'status'}]
	});

	var status = [{"index": "0", "status": "欠费中"}, {"index": "1", "status": "未缴清"}, {"index": "2", "status": "已缴清"}];
	function createStore() {
	    // The data store holding the states; shared by each of the ComboBox examples below
	    return Ext.create('Ext.data.Store', {
	        autoDestroy: true,
	        model: 'State',
	        data: status
	    });
	};
	var payStatusCombo = Ext.create('Ext.form.field.ComboBox', {
        fieldLabel: '缴费状态',
        displayField: 'status',
        valueField: 'index',
        name: 'paystatus',
        width: 320,
        labelWidth: 130,
        store: createStore(),
        queryMode: 'local',
        typeAhead: true
    });
	
	var statusforfeit = [{"index": "0", "status": "未缴"}, {"index": "1", "status": "已缴"}];
	function createStoreForfeit() {
	    // The data store holding the states; shared by each of the ComboBox examples below
	    return Ext.create('Ext.data.Store', {
	        autoDestroy: true,
	        model: 'State',
	        data: statusforfeit
	    });
	};
	var forfeitStatusCombo = Ext.create('Ext.form.field.ComboBox', {
        fieldLabel: '滞纳金',
        displayField: 'status',
        valueField: 'index',
        name: 'forfeitstatus',
        width: 320,
        labelWidth: 130,
        store: createStoreForfeit(),
        queryMode: 'local',
        typeAhead: true
    });
	
	var update_form = null;
	update_form = Ext.create('Ext.form.Panel', {
		autoScroll: true,
		baseCls : 'x-plain',
		padding : 20,
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
		items : [ {
			fieldLabel : '流水编号',
			readOnly: true,
			name : 'sernum',
			allowBlank : false
		}, {
			readOnly: true,
			fieldLabel : '缴费单位',
			name : 'adag',
			allowBlank : false
		}, {
			readOnly: true,
			xtype : 'textfield',
			name : 'bdate',
			fieldLabel : '所属年月'
		}, 
        {
            xtype: 'fieldset',
            title: '取水用途①',
            collapsible: true,
            defaults: {
                labelWidth: 40,
                anchor: '100%',
                layout: {
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [{
            	border: false,
            	defaults: {
                    border: false,
                    xtype: 'panel',
                    flex: 1,
                    labelAlign: 'right',
                    layout: 'anchor'
                },
                layout: 'hbox',
                items: [{
                    items: [{
                    	readOnly: true,
                    	anchor : '100%',
                    	xtype:'combo',
                        fieldLabel: '取水用途',
                        mode : 'local',
                        triggerAction: 'all',
                        store: store_fwintention,
                        valueField: 'tradecd',
                        displayField: 'tradenm',
                        emptyText: '选择取水用途',
                        name: 'fwintention1'
                    },{
                    	readOnly: true,
                    	labelWidth: 120,
                        xtype:'combo',
                        fieldLabel: '水资源类型',
                        mode : 'local',
                        triggerAction: 'all',
                        store: store_wtype,
                        valueField: 'wtypecd',
                        displayField: 'wtypenm',
                        emptyText: '选择取水资源类型',
                        anchor: '100%',
                        name: 'wtype1'
                    }, {
                    	readOnly: true,
                    	labelWidth: 120,
                        xtype:'textfield',
                        fieldLabel: '发电量/取水量',
                        anchor : '100%',
                        name: 'quantity1'
                    },{
                    	readOnly: true,
                    	labelWidth: 120,
                        xtype:'textfield',
                        readOnly: true,
                        fieldLabel: '缴费金额',
                        anchor: '100%',
                        name: 'nmoney1'
                    },{
                    	readOnly: true,
                        xtype:'textfield',
                        labelWidth: 120,
                        readOnly: true,
                        fieldLabel: '计划取水量/发电量',
                        anchor : '100%',
                        name: 'tmplanquantity1',
                    },{
                    	readOnly: true,
                    	labelWidth: 120,
                        xtype:'textfield',
                        readOnly: true,
                        fieldLabel: '超计划取水量/发电量',
                        anchor: '100%',
                        name: 'tmoplanquantity1',
                    }]
                }],
            }]
        }, 
        {
            xtype: 'fieldset',
            title: '取水用途②',
            collapsible: true,
            collapsed: true,
            defaults: {
                labelWidth: 40,
                anchor: '100%',
                layout: {
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [{
            	border: false,
            	defaults: {
                    border: false,
                    xtype: 'panel',
                    flex: 1,
                    labelAlign: 'right',
                    layout: 'anchor'
                },
                layout: 'hbox',
                items: [{
                    items: [{
                    	readOnly: true,
                    	anchor : '100%',
                    	xtype:'combo',
                        fieldLabel: '取水用途',
                        mode : 'local',
                        triggerAction: 'all',
                        store: store_fwintention,
                        valueField: 'tradecd',
                        displayField: 'tradenm',
                        emptyText: '选择取水用途',
                        name: 'fwintention2'
                    },{
                    	readOnly: true,
                    	labelWidth: 120,
                        xtype:'combo',
                        fieldLabel: '水资源类型',
                        mode : 'local',
                        triggerAction: 'all',
                        store: store_wtype,
                        valueField: 'wtypecd',
                        displayField: 'wtypenm',
                        emptyText: '选择取水资源类型',
                        anchor: '100%',
                        name: 'wtype2'
                    }, {
                    	readOnly: true,
                    	labelWidth: 120,
                        xtype:'textfield',
                        fieldLabel: '发电量/取水量',
                        anchor: '100%',
                        name: 'quantity2'
                    },{
                    	labelWidth: 120,
                        xtype:'textfield',
                        readOnly: true,
                        fieldLabel: '缴费金额',
                        anchor: '100%',
                        name: 'money2',
                    },{
                        xtype:'textfield',
                        labelWidth: 120,
                        readOnly: true,
                        fieldLabel: '计划取水量/发电量',
                        anchor: '100%',
                        name: 'plan_quantity2',
                    },{
                    	labelWidth: 120,
                        xtype:'textfield',
                        readOnly: true,
                        fieldLabel: '超计划取水量/发电量',
                        anchor: '100%',
                        name: 'o_plan_quantity2',
                    }]
                }],
            }]
        }, {
        	xtype: 'datefield',
        	fieldLabel: '发单日期',
        	format: 'Y-m-d',
        	name: 'gdate'
        }, payStatusCombo, forfeitStatusCombo, {
			xtype : 'button',
			iconCls : 'icon-save',
			text : '保存',
			handler: function(){
				if (update_form.form.isValid()){
					update_form.form.submit({
						waitTitle: '请稍后',
						waitMsg: '正在保存........',
						url: 'wpayment_update.action',
						params : {
							order : ordernum,
							proxyman: userid,
							unit: unit,
							unit2: unit2
						},
						success: function(form, action){
							store.load({params: {
								flag : Ext.getCmp('rdoIswuser').getValue().radio,
								adag: wfuser_combo.getValue(),
								addvnm: qaddv_combo.getValue(),
								sbdate: qsbdate.getValue(),
								ebdate: qebdate.getValue(),
								usercd : userid,
								roleid: roleid
							}});
							Ext.example.msg('系统提示', action.result.message);
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
	var wpayment_query = Ext.create('Ext.Panel', { /* 查询面板 */
		height : 90,
		region : 'north',
		items : [ query_form ]
	});
	var wpayment_update = Ext.create('Ext.Panel', { /* 更新面板 */
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
	
	store = Ext.create('Ext.data.Store', {
		fields : [{name : 'sernum'}, {name : 'dfagcd'}, {name : 'adag'}, {name : 'address'}, {name : 'addvcd'}, {name : 'wrrcd'}, {name : 'status'}, {name : 'addvnm'}, {name : 'bdate'},
		          {name : 'unit1'}, {name : 'filldate'}, {name : 'fwintention1'}, {name : 'fwintentionnm1'}, {name : 'wtype1'}, {name : 'wtypenm1'}, {name : 'quantity1'}, {name : 'tmplanquantity1'}, {name : 'tmoplanquantity1'}, {name : 'nmoney1'},
		          {name : 'gdate'}, {name : 'paydate'}, {name : 'rmoney'}, {name : 'paystatus'}, {name : 'delayfilldate'}, {name: 'delaystatus'}, {name : 'account'}, {name : 'proxyman'}, 
		          {name : 'unit2'}, {name : 'fwintention2'}, {name : 'fwintentionnm2'}, {name : 'wtype2'}, {name : 'wtypenm2'}, {name : 'quantity2'}, {name : 'tmplanquantity2'}, {name : 'tmoplanquantity2'}, {name : 'nmoney2'}, {name: 'amoney'},
		          {name: 'nforfeit'}, {name: 'rforfeit'}, {name: 'pay_forfeitdate'}, {name: 'forfeitstatus'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select.action',
			extraParams: {
				flag : 1,
				sbdate: qsbdate.getValue(),
				ebdate: qebdate.getValue(),
				usercd : userid,
				roleid: roleid
			},
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
	var store_getSernum = Ext.create('Ext.data.Store', {
		fields : [{name : 'max'}, {name: 'year'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_produceSerNum.action',
			actionMethods: {
                read: 'POST'
            },
			reader : {
				type : 'json',
				root : 'list'
			}
		}
    });
	store_getSernum.on("load", function(){
		pay_ser_num.setValue("甘水资费通 " + store_getSernum.getAt(0).get('year') + " 第 " + store_getSernum.getAt(0).get('max') + " 号");
		ordernum = store_getSernum.getAt(0).get('max');
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
			wpayment_update.toggleCollapse();
		}
	});
	var action_del = Ext.create('Ext.Action', {
		text : '删除',
		iconCls : 'silk-delete',
		handler : function() {
			Ext.Ajax.request({
				url : 'wpayment_delete.action',
				params : {
					sernum : curRecord.get('sernum')
				},
				success : function(xhr) {
					Ext.example.msg('系统提示', '已删除' + curRecord.get('sernum'));
					//重置更新Panel
					update_form.form.reset();
					store.load({params: {
						flag : Ext.getCmp('rdoIswuser').getValue().radio,
						adag: wfuser_combo.getValue(),
						addvnm: qaddv_combo.getValue(),
						sbdate: qsbdate.getValue(),
						ebdate: qebdate.getValue(),
						usercd : userid,
						roleid: roleid
					}});
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
			map.put("sernum", "流水编号");
			map.put("adag", "缴费单位");
			map.put("bdate", "所属年月");
			map.put("gdate", "发单日期");
			map.put("paystatus", "缴费状态");
			map.put("amoney", "应缴");
			map.put("rmoney", "实缴");
			map.put("paydate", "缴费日期");
			ExportExcel(store, map);
		}
	});
	var action_refresh = Ext.create('Ext.Action', {
		text : '刷新',
		iconCls : 'silk-refresh',
		handler : function() {
			store.load({params: {
				flag : Ext.getCmp('rdoIswuser').getValue().radio,
				adag: wfuser_combo.getValue(),
				addvnm: qaddv_combo.getValue(),
				sbdate: qsbdate.getValue(),
				ebdate: qebdate.getValue(),
				usercd : userid,
				roleid: roleid
			}});
		}
	});
	var toolbar = Ext.create('Ext.toolbar.Toolbar', {
		items : [ action_add, '-', action_update, '-', action_del, '-',
				action_export, '-', action_refresh, {
    		xtype:'radiogroup',
    		id:'rdoIswuser',
    		defaultType:'radio',
    		hideLabels:true,
    		height:25,
			width:210,
    		items:[{boxLabel:'欠费中',name:'radio',inputValue:'1',checked:true},
    		       {boxLabel:'已缴清',name:'radio',inputValue:'2'},
    		       {boxLabel:'全部', name : 'radio', inputValue : '3'}],
	       listeners : {
	   			'change' : function() {
	   				store.load({params: {
						flag : Ext.getCmp('rdoIswuser').getValue().radio,
						adag: wfuser_combo.getValue(),
						addvnm: qaddv_combo.getValue(),
						sbdate: qsbdate.getValue(),
						ebdate: qebdate.getValue(),
						usercd : userid,
						roleid: roleid
					}});
	   			}
	   		}
    	} ]
	});

    // create the grid
    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [
            {text: "流水编号", width: 180, dataIndex: 'sernum', sortable: false},
            {text: "缴费单位", width: 190, dataIndex: 'adag', sortable: false},
            {text: '所属年月', width: 80, dataIndex: 'bdate', sortable: false},
            {text: '发单日期', width: 100, dataIndex: 'gdate', sortable: false},
            {text: '缴费状态', width : 60, dataIndex: 'paystatus', sortable: false,renderer: function(v){
            	if (v == 2)
            		return '<img src="images/ok.png" />';
            	else if (v == 1)
            		return '<img src="images/flag.png" />';
            	else if (v == 0)
            		return '<img src="images/no.png" />';
            }},
            {text: '应缴(￥)', width: 80, dataIndex: 'amoney', sortable: false, renderer: cnMoneyCommon },
            {text: '实缴(￥)', width: 80, dataIndex: 'rmoney', sortable: false,renderer: cnMoneyColor},
            {text: '缴费日期', width: 80, dataIndex: 'paydate', sortable: false},
            {text: '滞纳金', width: 80, dataIndex: 'nforfeit', sortable: false, renderer: cnMoneyCommon},
            {text: '滞纳金缴费日期', width: 90, dataIndex: 'pay_forfeitdate', sortable: false}
        ],
        forceFit: true,
        flex: 3,
        split: true,
        region: 'center'
    });
    window.xwq = "xwq";
    // define a template to use for the detail view
    var data_tpl = {bdate: '所属年月', adag: '请选择缴费单据……', quantity1: '', quantity2: '', nmoney1: '', nmoney2: '', amoney: 0, nforfeit: 0, paystatus: 2};    
    var bookTpl = new Ext.XTemplate(
    		'<h1>（{bdate}） &nbsp;&nbsp;<span style="color: blue;">{adag}</span></h1>',         
            '<table border="0" width="900" style="font-size: 12px;">',
            '<tr>',
            '<td>',
            '<img src="images/thunder.png" alt="发电量" /><br />',
            '发电量: {quantity1}（kW·h）<br/>',
            '&nbsp;&nbsp;&nbsp;&nbsp;应缴: {nmoney1}（￥）<br/>',
            '</td>',
            '<td>',
            '<img src="images/water.png" alt="取水量" /><br />',
            '<tpl if="quantity2 == null">取水量: 0（m³）<br/></tpl>',
            '<tpl if="quantity2 != null">取水量: {quantity2}（m³）<br/></tpl>',
            '<tpl if="nmoney2 == null">&nbsp;&nbsp;&nbsp;&nbsp;应缴: 0（￥）<br/></tpl>',
            '<tpl if="nmoney2 != null">&nbsp;&nbsp;&nbsp;&nbsp;应缴: {nmoney2}（￥）<br/></tpl>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>',
            '<br /><div>需缴：{amoney}（￥）&nbsp;&nbsp;&nbsp;实缴：{rmoney}（￥）</div>',
            '</td>',
            '<td>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>',
            '<br />',
            '<tpl if="paystatus == 0"><button id="pay_btn">缴费</button></tpl>',
            '<tpl if="paystatus == 1"><button disabled="disabled" style="color: #ff6600;">未缴清</button></tpl>',
            '<tpl if="paystatus == 2"><button disabled="disabled" style="color: green;">已缴清</button></tpl>',
            '</td>',
            '<td>',
            '<tpl if="paystatus != 2"><br /><button id="print_btn">水资源费缴纳通知单</button></tpl>',
            '<tpl if="paystatus != 2"><button id="hasten_btn">责令限期缴纳水资源费通知书</button></tpl>',
            '<tpl if="paystatus != 2"><button id="punish_btn">行政处罚告知书</button></tpl>',
            '<tpl if="paystatus != 2"><button id="chufa_btn">处罚决定书</button></tpl>',
            '<br />',
            '</td>',
            '</tr>',
            '</table>'        
    );
    
    var panel_center = Ext.create('Ext.Panel', {
    	region: 'center',
    	border : false,
    	layout: 'border',
    	items: [grid, {
            id: 'detailPanel',
            height: 260,
            region: 'south',
            bodyPadding: 7,
            bodyStyle: "background: #ffffff;",
            html: '选择表格中缴费单据，查看详细信息……',
            listeners: {
            	afterrender: function(){
            		var detailPanel = Ext.getCmp('detailPanel');
                    bookTpl.overwrite(detailPanel.body, data_tpl);
            	}
            }
    	}]
    });
    var panel = null;
    panel = Ext.create('Ext.Panel', {
        title: '水资源费征收管理',
        itemId: 'wpayment_panel',
        border: false,
        closable : true,
        layout: 'border',
        items: [wpayment_query, panel_center , wpayment_update,
        //创建用于添加操作的窗口
		cw = Ext.create('Ext.Window', {
			 listeners: {
	         	afterrender: function(){
	         		var d = new Date();
	         		store_getSernum.load({
	         			params: {
	         				bdate: d.getFullYear()
	         			}
	         		});
	         	}
	         },
			xtype : 'window',
			modal: true,
			padding : 5,
			closable: true,
			closeAction: 'hide',
			title : '添加水资源费征收数据',
			plain : true,
			resizable : false,
			buttonAlign : 'right',
			height : 460,
			width : 380,
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
							url: 'wpayment_add.action',
							params : {
								order : ordernum,
								proxyman: userid,
								unit: unit,
								unit2: unit2
							},
							success: function(form, action){
								add_form.form.reset();
								store_getSernum.load();
								store.load({params: {
									flag : Ext.getCmp('rdoIswuser').getValue().radio,
									adag: wfuser_combo.getValue(),
									addvnm: qaddv_combo.getValue(),
									sbdate: qsbdate.getValue(),
									ebdate: qebdate.getValue(),
									usercd : userid,
									roleid: roleid
								}});
								Ext.example.msg('系统提示', action.result.message);
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
				text : '重置',
				handler: function(){
					add_form.form.reset();
				}
			} ]
		}) ],
        dockedItems: toolbar,
        listeners: {
        	selectionchange: function(model, records) {
                if (records[0]) {
            		var detailPanel = Ext.getCmp('detailPanel');
            		bookTpl.overwrite(detailPanel.body, records[0].data);
                }
            }
        }
    });
    
    //定义缴费单据表单
    var pay_form = null;
    pay_form = Ext.create('Ext.form.Panel', {
    	border: false,
    	autoHeight: true,
    	bodyPadding: 10,
    	defaults: {
    		anchor: '100%',
    		labelWidth: 80
    	},
    	items: [{
    		xtype: 'textfield',
    		readOnly: true,
    		fieldLabel: '流水编号',
    		name: 'sernum'
    	}, {
    		xtype: 'displayfield',
    		fieldLabel: '缴费单位',
    		name: 'adag'
    	}, {
    		xtype: 'displayfield',
    		fieldLabel: '所属年月',
    		name: 'bdate'
    	}, {
    		xtype: 'textfield',
    		readOnly: true,
    		fieldLabel: '应缴水费',
    		name: 'amoney'
    	}, {
    		xtype: 'textfield',
    		allowBlank: false,
    		fieldLabel: '实缴水缴',
    		name: 'money'
    	}, {
    		xtype: 'textfield',
    		readOnly: true,
    		fieldLabel: '应缴滞纳金',
    		value: 0,
    		name: 'nforfeit'
    	}, {
    		xtype: 'textfield',
    		fieldLabel: '实缴滞纳金',
    		name: 'rforfeit'
    	}]
    });
    
    var store_maxpunishser = Ext.create('Ext.data.Store', {
		fields : [{name : 'maxserorder'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_maxpunishser.action',
			actionMethods: {
                read: 'POST'
            },
			reader : {
				type : 'json',
				root : 'list'
			}
		}
    });
    store_maxpunishser.on("load", function(){
    	if (store_maxpunishser.getAt(0).get('maxserorder')){
    		Ext.example.msg('Info', 'Find the Max serorder');
    		var map=new Map();
    		var dt = new Date();
    		map.put("sernum", '甘水罚告'+dt.getFullYear()+"年 第[ " + (store_maxpunishser.getAt(0).get('maxserorder')+1) + " ]号");
    		map.put("dept", curRecord.get('adag'));

    		var d = new Date();
    		map.put("date", getCapitalYear(d.getFullYear())+"年 "+getCapitalMonth(d.getMonth() + 1)+" 月 "+getCapitalDay(d.getDate())+" 日");
    		Print("C://甘肃省水利厅行政处罚告知书(存根).doc",map);
    		Print("C://甘肃省水利厅行政处罚告知书.doc",map);
    		//更新发单日期
        	Ext.Ajax.request({
				url : 'wpayment_add_punishser.action',
				params	: {
					sernum : curRecord.get('sernum'),
					punish_order: store_maxpunishser.getAt(0).get('maxserorder')+1
				},
				success : function(xhr) {
				},
				failure : function(xhr) {
				}
			});
    	}else{
    			Ext.example.msg('Info', 'The serorder is 1');
        		var map=new Map();
        		var dt = new Date();
        		map.put("sernum", '甘水罚告'+dt.getFullYear()+"年 第[ 1 ]号");
        		map.put("dept", curRecord.get('adag'));

        		var d = new Date();
        		map.put("date", getCapitalYear(d.getFullYear())+"年 "+getCapitalMonth(d.getMonth() + 1)+" 月 "+getCapitalDay(d.getDate())+" 日");
        		Print("C://甘肃省水利厅行政处罚告知书(存根).doc",map);
        		Print("C://甘肃省水利厅行政处罚告知书.doc",map);
        		//更新发单日期
            	Ext.Ajax.request({
					url : 'wpayment_add_punishser.action',
					params	: {
						sernum : curRecord.get('sernum'),
						punish_order: 1
					},
					success : function(xhr) {
					},
					failure : function(xhr) {
					}
				});
    	}
    });
    
    var store_punishser = Ext.create('Ext.data.Store', {
		fields : [{name : 'paysernum'}, {name : 'serorder'}],
		proxy : {
			type : 'ajax',
			url : 'wpayment_select_punishser.action',
			actionMethods: {
                read: 'POST'
            },
			reader : {
				type : 'json',
				root : 'list'
			}
		}
    });
    store_punishser.on("load", function(){
    	if (store_punishser.getCount > 0){
    		Ext.example.msg('Info', 'Has print!');
    		var map=new Map();
    		var dt = new Date();
    		map.put("sernum", '甘水罚告'+dt.getFullYear()+"年 第[ " + store_punishser.getAt(0).get('serorder') + " ]号");
			map.put("dept", curRecord.get('adag'));

			var d = new Date();
			map.put("date", getCapitalYear(d.getFullYear())+"年 "+getCapitalMonth(d.getMonth() + 1)+" 月 "+getCapitalDay(d.getDate())+" 日");
			Print("C://甘肃省水利厅行政处罚告知书(存根).doc",map);
			Print("C://甘肃省水利厅行政处罚告知书.doc",map);
    	}else{
    		store_maxpunishser.load();
    	}
    });
    
    // update panel body on selection change
    grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
        if (selectedRecord.length) {
            var detailPanel = Ext.getCmp('detailPanel');
            curRecord = selectedRecord[0];
            bookTpl.overwrite(detailPanel.body, selectedRecord[0].data);
            
            update_form.getForm().loadRecord(selectedRecord[0]);
            pay_form.getForm().loadRecord(selectedRecord[0]);
            window.curSerNum = selectedRecord[0].get('sernum');
            //注册缴纳水资源费功能窗口
            if (Ext.fly('pay_btn'))
	            Ext.fly('pay_btn').on('click', function(){
	            	if (!pay_win){
	            		pay_win = Ext.create('widget.window', {
	            			title: '缴纳水资源费',
	            			modal: true,
	            			closable: true,
	            			closeAction: 'hide',
	            			width: 300,
	            			minWidth: 250,
	            			height: 350,
	            			layout: {
	            				type: 'fit',
	            				padding: 5
	            			},
	            			items: [pay_form],
	            	    	buttons: [{
	            	    		text: '确认',
	            	    		iconCls : 'icon-save',
	            				handler: function(){
	            					if (pay_form.form.isValid()){
	            						pay_form.form.submit({
	            							waitTitle: '请稍后',
	            							waitMsg: '正在保存........',
	            							url: 'wpayment_pay.action',
	            							success: function(form, action){
	            								pay_form.form.reset();
	            								store.load({params: {
	            									flag : Ext.getCmp('rdoIswuser').getValue().radio,
	            									adag: wfuser_combo.getValue(),
	            									addvnm: qaddv_combo.getValue(),
	            									sbdate: qsbdate.getValue(),
	            									ebdate: qebdate.getValue(),
	            									usercd : userid,
	            									roleid: roleid
	            								}});
	            								Ext.example.msg('系统提示', action.result.message);
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
	            	    	},{
	            	    		text: '取消',
	            	    		handler: function(){
	            	    			pay_win.close();
	            	    		}
	            	    	}]
	            		});
	            	}
	            	if (!pay_win.isVisible()){
	            		pay_win.show();
	            	}
	            });
            
            if (Ext.fly('print_btn')){
            	Ext.fly('print_btn').on('click', function(){
            		var map=new Map();
            		map.put("sernum", selectedRecord[0].get('sernum'));
					map.put("dept", selectedRecord[0].get('adag'));
					map.put("year", selectedRecord[0].get('bdate').substr(0, 4));
					map.put("month", selectedRecord[0].get('bdate').substr(5, 2));
					if(selectedRecord[0].get('unit1') == 'kW·h'){
						map.put("ysl", selectedRecord[0].get('quantity1')+"千瓦时");
						map.put("unit", "千瓦时");
						map.put("trade", "发电");
					}else{
						map.put("ysl", selectedRecord[0].get('quantity1')+"立方米");
						map.put("unit", "立方米");
						map.put("trade", "取水");
					}
					map.put("t", selectedRecord[0].get('fwintentionnm1'));
					map.put("price", selectedRecord[0].get('amoney') / selectedRecord[0].get('quantity1'));
					map.put("chargec", selectedRecord[0].get('amoney') / 1000);
					map.put("aBank", "招行兰州城东支行");
					map.put("aName", "甘肃省水利厅");
					map.put("aNum", "847081006810001");
					map.put("lnkMan", "戚笃胜");
					map.put("payNum", "甘费征字00—000818");
					map.put("phone", "0931—8411159");
					var d = new Date();
					map.put("date", getCapitalYear(d.getFullYear())+" 年 "+getCapitalMonth(d.getMonth() + 1)+" 月 "+getCapitalDay(d.getDate())+" 日");
					Print("c://缴纳水资源费通知书(存根).doc", map);
					Print("c://缴纳水资源费通知书.doc", map);
					//更新发单日期
	            	Ext.Ajax.request({
						url : 'wpayment_update_gdate.action',
						params	: {
							sernum : selectedRecord[0].get('sernum')
						},
						success : function(xhr) {
							store.load({params: {
								flag : Ext.getCmp('rdoIswuser').getValue().radio,
								adag: wfuser_combo.getValue(),
								addvnm: qaddv_combo.getValue(),
								sbdate: qsbdate.getValue(),
								ebdate: qebdate.getValue(),
								usercd : userid,
								roleid: roleid
							}});
						},
						failure : function(xhr) {
						}
					});
            	});
            }
            if (Ext.fly('hasten_btn')){
            	Ext.fly('hasten_btn').on('click', function(){
            		var map=new Map();
            		var dt = new Date();

					map.put("sernum", "甘水责通 " + dt.getFullYear() + " 第[     ]号");
					map.put("dept", selectedRecord[0].get('adag'));
					map.put("year", selectedRecord[0].get('bdate').substr(0, 4));
					map.put("y1",selectedRecord[0].get('filldate').substr(0, 10));
					map.put("month", selectedRecord[0].get('bdate').substr(5, 2));
					if (selectedRecord[0].get('paydate')){
						map.put("xjrq",getNextDay(Ext.util.Format.date(selectedRecord[0].get('paydate'), 'Y-m-d')));
						map.put("zljrq",getNextOneDay(Ext.util.Format.date(selectedRecord[0].get('paydate'), 'Y-m-d')));
					}
					var d = new Date();
					map.put("date", getCapitalYear(d.getFullYear())+" 年 "+getCapitalMonth(d.getMonth() + 1)+" 月 "+getCapitalDay(d.getDate())+" 日");
					Print("C://责令限期缴纳水资源费通知书(存根).doc",map);
					Print("C://责令限期缴纳水资源费通知书.doc",map);
            	});
            }
            if (Ext.fly('punish_btn')){
            	Ext.fly('punish_btn').on('click', function(){
            		//查询是否已打印过
            		store_punishser.load({params: {
            			sernum : selectedRecord[0].get('sernum')
            		}});
            	});
            }
            if (Ext.fly('chufa_btn')){
            	Ext.fly('chufa_btn').on('click', function(){
            		var map=new Map();
            		Print("C://甘肃省水利厅行政处罚决定书.doc", map);
            	});
            }
        }
    });
    Ext.getCmp('tabs_panel').add(panel);
    Ext.getCmp('tabs_panel').setActiveTab('wpayment_panel');
}

//水资源费征收流程图
function payment_flow(){
	var panel = Ext.create('Ext.panel.Panel', {
		closable: true,
		autoScroll: true,
		title: '水资源费征收流程图',
		itemId: 'payment_flow_panel',
		html: '<img src="images/wpayflow.jpg" / style="padding: 20px;">'
	});
	Ext.getCmp('tabs_panel').add(panel);
    Ext.getCmp('tabs_panel').setActiveTab('payment_flow_panel');
}
