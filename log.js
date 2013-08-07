/**
 * Created with JetBrains PhpStorm.
 * User: dou
 * Date: 8/7/13
 * Time: 11:59 PM
 * To change this template use File | Settings | File Templates.
 */
function log(){
    var store = Ext.create('Ext.data.Store', {
        fields : [{name : 'id'}, {name : 'time'}, {name : 'username'}, {name : 'usernm'}, {name : 'logs'}],
        proxy : {
            type : 'ajax',
            url : 'logx_select.action',
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
    var query_form = Ext.create('Ext.form.Panel', {
        border : false,
        bodyStyle : 'padding:25px 5px 0',
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
            items : [ {
                xtype : 'textfield',
                fieldLabel : '操作员',
                name : 'first'
            }, {
                xtype : 'textfield',
                fieldLabel : '操作内容',
                name : 'company'
            } ]
        }, {
            flex : 6,
            items : [ {
                xtype : 'datefield',
                fieldLabel : '开始时间',
                name : 'last'
            }, {
                xtype : 'datefield',
                fieldLabel : '结束时间',
                name : 'email',
                vtype : 'email'
            } ]
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
                iconCls : 'silk-search',
                text : '查找'
            }, {
                xtype : 'button',
                iconCls : 'silk-refresh',
                text : '重置'
            } ]
        } ]
    });

    var log_query = Ext.create('Ext.Panel', { /* 查询面板 */
        height : 100,
        region : 'north',
        items : [ query_form ]
    });

    /* ======================创建工具栏==================== */

    var action_export = Ext.create('Ext.Action', {
        text : '导出',
        iconCls : 'silk-excel',
        handler : function() {
            Ext.example.msg('Click', 'You click on 导出');
        }
    });
    var action_refresh = Ext.create('Ext.Action', {
        text : '刷新',
        iconCls : 'silk-refresh',
        handler : function() {
            Ext.example.msg('Click', 'You click on 刷新数据');
        }
    });
    var toolbar = Ext.create('Ext.toolbar.Toolbar', {
        items : [ action_export, '-', action_refresh ]
    });

    var log_grid = Ext.create('Ext.grid.Panel', {
        region : 'center',
        store : store,
        columns : [ {
            header : "编号",
            width : 80,
            dataIndex : 'id',
            sortable : false
        }, {
            header : "时间",
            width : 190,
            dataIndex : 'time',
            sortable : true
        }, {
            header : "操作员",
            width : 80,
            dataIndex : 'usernm',
            sortable : true
        }, {
            flex: 1,
            header : "操作内容",
            width : 160,
            dataIndex : 'logs',
            sortable : true
        }]
    });

    var panel = Ext.create('Ext.Panel', {
        title : '系统操作日志',
        itemId : 'log_panel',
        layout : 'border',
        closable : true,
        items : [ log_query, log_grid],
        dockedItems : toolbar
    });

    Ext.getCmp('tabs_panel').add(panel);
    Ext.getCmp('tabs_panel').setActiveTab('log_panel');
}
