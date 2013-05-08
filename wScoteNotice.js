/*
 *缴纳水资源费通知书 
 */
var rtf_store_payment = new Ext.data.JsonStore({
  	autoLoad:{params:{start:0, limit:pageSize}},
		url:"main/payment_query.action?rtf_id="+userID,
		root:"list",
		totalProperty:'countPage',
		fields:[
			{name:'id',mapping:0},
			{name:'sernum',mapping:1},
			{name:'dfagnm',mapping:2},
			{name:'addvnm',mapping:3},
			{name:'wrrnm',mapping:4},
			{name:'trade',mapping:5},
			{name:'fillDate',mapping:6,type:'date',dateFormat:'Y-m-dTH:i:s'},
			{name:'chargec',mapping:7, type: 'float'},
			{name:'chargedate',mapping:8,type:'date',dateFormat:'Y-m-dTH:i:s'},
			{name:'account',mapping:9},
			{name:'isPayment',mapping:10},
			{name:'applydelay',mapping:11},
			{name:'y',mapping:12},
			{name:'mnth',mapping:13},
			{name:'ysl',mapping:14},
			{name:'alreadypaid',mapping:15},
			{name:'qj',mapping:16},
			{name:'dfagcd',mapping:17},
			{name:'ym',mapping:18},
			{name:'byqsl',mapping:19},
			{name:'jfjs',mapping:20},
			{name:'jhqsl',mapping:21},
			{name:'cjhqsl',mapping:22},
			{name:'jbr',mapping:23},
			{name:'printstate',mapping:24},
			{name:'rlnoticeid',mapping:25},
			{name:'fwtyp',mapping:26},
			{name:'pid',mapping:27},
		]
	});
function showConfirm(tit,msg,url,id,index,rtf_store_payment,sernum){
	Ext.MessageBox.confirm(tit, '您确定要执行此操作吗？',function(btn){
			if(btn=="yes"){
				Ext.Ajax.request({
					url:url,
					params:{id:id,index:index},
					method:"post",
					success:function(form,action){
						addLogs("对编号为"+sernum+"的记录做了"+tit+"操作！");
						Ext.Msg.alert("提示信息",msg+"成功"); 
						rtf_store_payment.reload({params:{start:0, limit:pageSize}});
						return ; 
					},
					failure:function(form,action){ 
						Ext.Msg.alert("提示信息",msg+"失败"); 
						return ; 	
					} 
				});
			};
		});
}
var childgrid=null;
var gridParent=null;
function wScotNoticeMgr() {
	var tPanel = Ext.getCmp('myCenterTabPanel');
    Ext.QuickTips.init();
    var qshid="";
	var szyid="";
	var xzqid="";
	var hyid="";
	var index=1;
	var startTime=null;
	var endTime=null;
	//取水户
	var store_qsh=new Ext.data.JsonStore({
		autoLoad :{params:{rtf_id:userID}},
		url : "main/wuser_findUserName.action",
		root : "userList",
		fields : [ 'dfagcd', 'adag']
	});
	var cb_qsh=new Ext.form.ComboBox({
		id:'nqshname',
		store:store_qsh,
        fieldLabel:'取水户',
		mode: 'local',
		triggerAction:'all',
		valueField:'dfagcd',
		displayField:'adag',
		hiddenName:'qshid',
		emptyText:'--请选择取水户--',
		selectOnFocus:true     
	});
	//行政区划
	var store_xz=new Ext.data.JsonStore({
		autoLoad :true,
		url : "main/payment_queryXzqh.action?rtf_id="+userID,
		root : "xzqhList",
		fields : ['addvcd','addvnm']
	});
	var cb_xzqh=new Ext.form.ComboBox({
		id:'nxzqname',
		store:store_xz,
        fieldLabel:'行政区划',
		mode: 'local',
		triggerAction:'all',
		valueField:'addvcd',
		displayField:'addvnm',
		hiddenName:'xzqid',
		emptyText:'--请选择行政区划--',
		selectOnFocus:true     
	});
	//水资源分区
	var store_szy=new Ext.data.JsonStore({
		autoLoad :true,
		url : "main/wuser_querySzy.action",
		root : "szyfqList",
		fields : ['wrrcd','wrrnm']
	});
	var cb_szyfq=new Ext.form.ComboBox({
		id:'nszyname',
		store:store_szy,
        fieldLabel:'水资源分区',
		mode: 'local',
		triggerAction:'all',
		valueField:'wrrcd',
		displayField:'wrrnm',
		hiddenName:'szyid',
		emptyText:'--请选择水资源分区--',
		selectOnFocus:true     
	});
	//行业类型
	var store_type=new Ext.data.JsonStore({
		autoLoad :true,
		url : "main/payment_queryHylx.action?rtf_id="+userID,
		root : "hylxList",
		fields : ['trade', 'name']
	});
	var cb_hylx=new Ext.form.ComboBox({
		id:'nhyname',
		store:store_type,
        fieldLabel:'行业类型',
		mode: 'local',
		triggerAction:'all',
		valueField:'name',
		displayField:'name',
		hiddenName:'hyid',
		emptyText:'--请选择行业类型--',
		selectOnFocus:true     
	});
	// 定义日期查询控件
	var startDate=new Ext.form.DateField({
		id:'startDate',
		fieldLabel:'起始日期',
		emptyText:'请选择',
		format:'Y-m-d'
	});
	var endDate=new Ext.form.DateField({
		id:'endDate',
		fieldLabel:'结束日期',
		emptyText:'请选择',
		format:'Y-m-d'
	});
	//查询条件面板
	var search_form=null;
	search_form = new Ext.FormPanel({
		padding:10,
        height:70,
        baseCls:'x-plain',
        border:false,
        labelWidth:70,
        labelAlign:'right',
        items: [{
        	baseCls:'x-plain',
        	layout: 'column',
        	width:1024,
        	items: [{
        		 	baseCls: 'x-plain',
        		 	layout: 'form',
        		 	items:[cb_qsh,cb_xzqh]
        	},{
        		baseCls: 'x-plain',
    		 	layout: 'form',
    		 	items:[cb_szyfq,cb_hylx]
        	},{
        		baseCls: 'x-plain',
    		 	layout: 'form',
    		 	items:[startDate,endDate]
        	},{
        		baseCls:'x-plain',
        		layout:'form',
        		items:[
						{
							border		: false,
							width	: 70,
							text		: '查询',
							iconCls : 'silk-search',
							xtype		: 'button',
							cls:'buttonserch',
							handler		:function(){
								qshid = Ext.getCmp('nqshname').getValue();
								szyid = Ext.getCmp('nszyname').getValue();
								xzqid = Ext.getCmp('nxzqname').getValue();
								hyid = Ext.getCmp('nhyname').getValue();
								startTime=Ext.getCmp('startDate').getValue();
								endTime=Ext.getCmp('endDate').getValue();
								index=Ext.getCmp('rdoIs').getValue().inputValue;
								rtf_store_payment.reload({params: {start:0,limit:pageSize,index:index,qshId:qshid,xzqId:xzqid,szyId:szyid,hyId:hyid,startDate:startTime,endDate:endTime}});
							}
						 },{
							 	border : false,
							 	width	: 70,
								xtype : 'button',
								iconCls : 'silk-refresh',
								cls:'buttonreset',
								text : '重置',
								handler : function(){
									search_form.form.reset();
									qshid = Ext.getCmp('nqshname').getValue();
									szyid = Ext.getCmp('nszyname').getValue();
									xzqid = Ext.getCmp('nxzqname').getValue();
									hyid = Ext.getCmp('nhyname').getValue();
									startTime=Ext.getCmp('startDate').getValue();
									endTime=Ext.getCmp('endDate').getValue();
									index=Ext.getCmp('rdoIs').getValue().inputValue;
									rtf_store_payment.reload({params: {start:0,limit:pageSize,index:index,qshId:qshid,xzqId:xzqid,szyId:szyid,hyId:hyid,startDate:startTime,endDate:endTime}});
								}
						 }
        		       ]
        	}]
        }]	
    });
    //创建分页栏
	var pagingbar=new Ext.PagingToolbar({
           pageSize:pageSize,
           store:rtf_store_payment,
           displayInfo: true,
		   displayMsg: '第{0}-{1}条记录，共{2}条记录',
		   emptyMsg: "无任何记录",
		   doRefresh:function(){ 
			   return false; 
		   }
	});	
	var app=null;
	var win_notice=null;
	var win_alreadypaid=null;
	var alread=new Ext.form.TextField({
		fieldLabel : '水费金额(元)',
		name : 'alreadypaid',
		allowBlank : false,
		emptyText:'0.00',
		regex:/^[\d\.]*$/,
        regexText:'只能输入数字！'
	});
	var late=new Ext.form.TextField({
		fieldLabel : '应缴滞纳金(元)',
		id:'lateprice',
		name : 'latemoney',
		allowBlank : false,
		emptyText:'0.00',
		regex:/^[\d\.]*$/,
        regexText:'只能输入数字！',
        readOnly:true,
		style:'color:#C1C1C1;'
	});
	var paid=new Ext.form.TextField({
		fieldLabel : '滞纳金(元)',
		id:'paidprice',
		name : 'paidmoney',
		allowBlank : false,
		emptyText:'0.00',
		regex:/^[\d\.]*$/,
        regexText:'只能输入数字！'
	});
//   var xg = Ext.grid;
   var expander = new Ext.grid.RowExpander({
           tpl : new Ext.XTemplate(
           '<div class="detailData">',
           '',
           '</div>'
           )
   });
   expander.on("expand",function(expander,r,body,rowIndex){
	 var record=gridParent.getStore().getAt(rowIndex).get("pid");
     //查找 grid 
     window.testEle=body;
     if (Ext.DomQuery.select("div.x-panel-bwrap",body).length==0){
    	 var childstore = new Ext.data.ArrayStore({
    		autoLoad:{params:{rtf_id:record}},
     		url:"main/payment_queryChild.action",
     		root:"list",
     		fields:[
     			{name:'fwintention',mapping:0},
     			{name:'fwtyp',mapping:1},
     			{name:'tmnum',mapping:2, type: 'float'},
     			{name:'chargec',mapping:3, type: 'float'},
     			{name:'tmchargebNum',mapping:4, type: 'float'}
     		]
         });
    	 childgrid = new Ext.grid.GridPanel({
         	 id:'childgrid',
             store: childstore,
             cm: new Ext.grid.ColumnModel({
            	 defaults: {
                     sortable: true
                 },
                 columns: [
                     {header: "取水用途",dataIndex: 'fwintention'},
                     {header: "水资源类型",dataIndex: 'fwtyp'},
                     {header: "取水量/发电量",dataIndex: 'tmnum'},
                     {header: "应缴金额",dataIndex: 'chargec'},
                     {header: "缴费基数",dataIndex: 'tmchargebNum'}
                 ]
             }),
             viewConfig: {
                 forceFit:true
             }, 
             autoWidth:true,
             autoHeight:true,
             iconCls: 'icon-grid', 
             renderTo:Ext.DomQuery.select("div.detailData",body)[0]
         });  
         Ext.DomQuery.select("div.detailData")[0];
     }
   });
   gridParent = new Ext.grid.GridPanel({
		id:'gridParent',
		flex : 10,
        store: rtf_store_payment,
        cm: new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
                expander,
                {header: "流水编号", dataIndex: 'sernum',width:150},
                {header: "取水单位（个人）", dataIndex: 'dfagnm',width:200},
                {header: "行政区划", dataIndex: 'addvnm',hidden:true,width:60},
                {header: "水资源分区", dataIndex: 'wrrnm',hidden:true,width:66},
//                {header: "行业类型", dataIndex: 'trade',width:60},
//                {header: "水资源类型", dataIndex: 'fwtyp',width:60},
                {header: "所属年月",dataIndex: 'ym',width:70},
                {header: "填报日期", renderer : new Ext.util.Format.dateRenderer('Y-m-d'),dataIndex: 'fillDate',width:75},
                {header: "限缴费日期", renderer : new Ext.util.Format.dateRenderer('Y-m-d'),dataIndex: 'chargedate',width:75},
                {header: "取水量/发电量",dataIndex: 'byqsl'},
                {header: "计划取水量/发电量",dataIndex: 'jhqsl',hidden:true,width:105},
                {header: "超计划取水量/发电量",dataIndex: 'cjhqsl',hidden:true,width:115},
//                {header: "缴费基数",dataIndex: 'jfjs',hidden:true},
                {header: "应缴金额(元)",dataIndex: 'chargec', renderer: function(v){
                    return cnMoney(v);
                }},
				{header: "实缴金额(元)",dataIndex: 'alreadypaid', renderer: function(v){
                    return cnMoney(v);
                }},
                {id:'applydelay', header: "是否缓交",dataIndex: 'applydelay',width:55,align:'center', renderer:function(v,cellmeta){
                	app=v;
                    if(v){   // 判断值类型
                    	return  "<img src='gis/cssfile/fam/checked.gif'/>";
                    }
                    else {
                    	return  "<img src='gis/cssfile/fam/cross.gif'/>";
                    }
                 }},
                {header: "申请缓交",dataIndex:"isPayment",width:55,align:'center',
                	renderer:function(v,cellmeta){
                		if(v){
                			if(userCookie=='1001'){
	            				return "<img alt='申请缓交' style='cursor:hand;' src='gis/cssfile/images/acceptable.png'/>"
	            					+"<img alt='取消缓交' style='cursor:hand;' src='gis/cssfile/images/cancelable.png'/>";
                			}else{
                				return "<img alt='申请缓交' style='cursor:hand;' src='gis/cssfile/images/acceptable.png'/>";
                			}
                		}else{
                			if(userCookie=='1001'){
                				if(app){
                		     		return "<img alt='申请缓交' style='cursor:hand;' src='gis/cssfile/images/acceptable.png'/>"
                  			  		+"<img alt='取消缓交' style='cursor:hand;' src='gis/cssfile/images/cancel.png' id='canceldelay'/>";
                				}else{
                					return "<img alt='申请缓交' style='cursor:hand;' src='gis/cssfile/images/accept.png' id='delay'/>"
                  			  		+"<img alt='取消缓交' style='cursor:hand;;' src='gis/cssfile/images/cancelable.png'/>";
                				}
                			}else{
                				if(app){
                		     		return "<img alt='申请缓交' style='cursor:hand;' src='gis/cssfile/images/acceptable.png'/>";
                				}else{
                					return "<img alt='申请缓交' style='cursor:hand;' src='gis/cssfile/images/accept.png' id='delay'/>";
                				}
                			}
                		}
                	}
             	},
             	{header: "确认缴费",dataIndex:"isPayment",width:55,align:'center',
                	renderer:function(v,cellmeta){
                		if(v==2){
                			if(userCookie=='1001'){
                    			return "<img alt='确认缴费' style='cursor:hand;' src='gis/cssfile/images/acceptable.png'/>"
              			  		+"<img alt='取消缴费' style='cursor:hand;' src='gis/cssfile/images/cancel.png' id='cancelpay'/>";
                			}else{
                    			return "<img alt='确认缴费' style='cursor:hand;' src='gis/cssfile/images/acceptable.png'/>";
                			}
                		}else{
                			if(userCookie=='1001'){
                				return "<img alt='确认缴费' style='cursor:hand;' src='gis/cssfile/images/accept.png' id='payment'/>"
              			  		+"<img alt='取消缴费' style='cursor:hand;' src='gis/cssfile/images/cancelable.png'/>";
                			}else{
                				return "<img alt='确认缴费' style='cursor:hand;' src='gis/cssfile/images/accept.png' id='payment'/>";
                			}
                		}
                	}
             	},
             	{header: "打印状态",dataIndex:"printstate",width:55,align:'center',
                	renderer:function(v,cellmeta){
                		if(v==0){
                			return  "<img src='gis/cssfile/fam/cross.gif'/>";
                		}else{
                			return  "<img src='gis/cssfile/fam/checked.gif'/>";
                		}
                	}
             	},
             	{header: "经办人",dataIndex: 'jbr',width:55,},
         	    {header: "删除",align:'center',dataIndex:"id",width:55,align:'center',
			    	renderer:function createButton(id){ 
						return  "<img alt='删除' style='cursor:hand;' src='gis/cssfile/extIcon/delete.gif' id='delete'/>";
			    	}
				},
                {header: "打印预览",align:'center',dataIndex:"id",width:55,align:'center',
			    	renderer:function createButton(id){ 
						return  "<img alt='通知单' style='cursor:hand;' src='gis/cssfile/images/print.png' id='printNotice'/>";
			    	}
				}
            ]
        }), 
        autoScroll:true,
        plugins: expander,
        collapsible: true,
        animCollapse: false,
        iconCls: 'icon-grid',
        listeners:{
         	"cellclick":function(grid,rowIndex,columnIndex,e){
         		var btn=e.getTarget();
         		if(btn){
         			var obj=btn.id;
         			var rcd=grid.getStore().getAt(rowIndex);
 					var id=rcd.get("id");
 					var sernum=rcd.get("sernum");
 					var dfagcd=rcd.get("dfagcd");
 					var y=rcd.get("y");
 					var mnth=rcd.get("mnth");
 					var rid=rcd.get("rlnoticeid");
         			switch(obj){
         				case "printNotice":
         					var i=0;
        					win_notice = new Ext.Window({
        						title:'选择通知书',
        						layout:'fit',
        						plain:true,
        						height:220,
        						width:350,
        						modal: true,
        						bodyStyle:"padding:10px",
        						maximizable:false,
        						closeAction:'hide',
        						items:[{
	    							xtype:'radiogroup',
	    				    		defaultType:'radio',
	    				    		height:220,
	        						width:350,
	    				    		hideLabels:true,
	    				    		columns:1,
	    							items:[
	    				    		       {boxLabel:'缴纳水资源费通知书',name:'notice',inputValue:'0',checked:true},
	    				    		       {boxLabel:'缴纳水资源费通知书(存根)',name:'notice',inputValue:'1'},
	    				    		       {boxLabel:'责令限期缴纳水资源费通知书',name:'notice',inputValue:'2'},
	    				    		       {boxLabel:'责令限期缴纳水资源费通知书(存根)',name:'notice',inputValue:'3'},
	    				    		       {boxLabel:'甘肃省水利厅行政处罚告知书',name:'notice',inputValue:'4'},
	    				    		       {boxLabel:'甘肃省水利厅行政处罚告知书(存根)',name:'notice',inputValue:'5'}
	    				    		       ],
				    		       listeners:{
				    		   			'change' : function(rdo) {
				    		   				i=rdo.getValue().inputValue;
				    		   			}
				    		   		}
        						}],
        						buttons:[{
            						iconCls:'icon-save',
            						text:'确定',
        							type:'submit',
        							handler:function(){
        								var map=new Map();
        								if(i==0){
        									Ext.Ajax.request({
        										url: 'main/wrod_findPaymentSernum.action',
        										params:{year:fullYear,rtf_nid:rid},
        										method: 'post',
        										scope:this,
        										async:false,
        										callback: function(options, success, response) {
        											var obj = eval('('+response.responseText+')');
        											Ext.Ajax.request({
        					                    		url: 'main/wrod_updatePrintState.action',
        					                    		method: 'post'
        					                    	});
                									Ext.Ajax.request({
                			                    		url: 'main/wrod_addPmSernum.action',
                			                    		params:{year:fullYear,snum:'甘水资费通'+fullYear+'年第'+obj.pmtSernum+'号',rtf_nid:rid},
                			                    		method: 'post'
                			                    	});
        											map.put("sernum", '甘水资费通'+fullYear+'年第'+obj.pmtSernum+'号');
                									map.put("dept", rcd.get("dfagnm"));
                									map.put("year", rcd.get("y"));
                									map.put("month", rcd.get("mnth"));
                									if((rcd.get("trade").indexOf("贯流式冷却"))!=-1){
                										map.put("ysl", rcd.get("ysl")+"千瓦时");
                										map.put("unit", "千瓦时");
                										map.put("trade", "发电");
                									}else{
                										map.put("ysl", rcd.get("ysl")+"立方米");
                										map.put("unit", "立方米");
                										map.put("trade", "取水");
                									}
                									map.put("t", rcd.get("trade"));
                									map.put("price", " "+Ext.util.Format.number(rcd.get("chargec")/rcd.get("ysl"), '0.00'));
                									map.put("chargec", " "+Ext.util.Format.number(rcd.get("chargec")/10000, '0.0000'));
                									map.put("aBank", "招行兰州城东支行");
                									map.put("aName", "甘肃省水利厅");
                									map.put("aNum", "847081006810001");
                									map.put("lnkMan", "戚笃胜");
                									map.put("payNum", "甘费征字00—000818");
                									map.put("phone", "0931—8411159");
                									map.put("date", fullYear+"年"+fullMonth+"月"+fullDay+"日");
                									Print("http://www.giscloud.org/缴纳水资源费通知书.doc",map);
        										}
        									});
        								}else if(i==1){
        									Ext.Ajax.request({
        										url: 'main/wrod_findPaymentSernum.action',
        										params:{year:fullYear,rtf_nid:rid},
        										method: 'post',
        										scope:this,
        										async:false,
        										callback: function(options, success, response) {
        											var obj = eval('('+response.responseText+')');
        											Ext.Ajax.request({
        					                    		url: 'main/wrod_updatePrintState.action',
        					                    		method: 'post'
        					                    	});
        											Ext.Ajax.request({
                			                    		url: 'main/wrod_addPmSernum.action',
                			                    		params:{year:fullYear,snum:'甘水资费通'+fullYear+'年第'+obj.pmtSernum+'号',rtf_nid:rid},
                			                    		method: 'post'
                			                    	});
        											map.put("sernum", '甘水资费通'+fullYear+'年第'+obj.pmtSernum+'号');
                									map.put("dept", rcd.get("dfagnm"));
                									map.put("year", rcd.get("y"));
                									map.put("month", rcd.get("mnth"));
                									if((rcd.get("trade").indexOf("贯流式冷却"))!=-1){
                										map.put("ysl", rcd.get("ysl")+"千瓦时");
                										map.put("unit", "千瓦时");
                										map.put("trade", "发电");
                									}else{
                										map.put("ysl", rcd.get("ysl")+"立方米");
                										map.put("unit", "立方米");
                										map.put("trade", "取水");
                									}
                									map.put("t", rcd.get("trade"));
                									map.put("price", " "+Ext.util.Format.number(rcd.get("chargec")/rcd.get("ysl"), '0.00'));
                									map.put("chargec", " "+Ext.util.Format.number(rcd.get("chargec")/10000, '0.0000'));
                									map.put("aBank", "招行兰州城东支行");
                									map.put("aName", "甘肃省水利厅");
                									map.put("aNum", "847081006810001");
                									map.put("lnkMan", "戚笃胜");
                									map.put("payNum", "甘费征字00—000818");
                									map.put("phone", "0931—8411159");
                									map.put("date", fullYear+"年"+fullMonth+"月"+fullDay+"日");
                									Print("http://www.giscloud.org/缴纳水资源费通知书(存根).doc",map);
        										}
        									});
        								}else if(i==2){
        									Ext.Ajax.request({
        										url: 'main/wrod_findDeadlineSernum.action',
        										params:{year:fullYear,rtf_nid:rid,deptId:dfagcd,month:mnth,sunyear:y,pubSernum:sernum},
        										method: 'post',
        										scope:this,
        										async:false,
        										callback: function(options, success, response) {
        											var obj = eval('('+response.responseText+')');
        											Ext.Ajax.request({
                			                    		url: 'main/wrod_addDeadlineSernum.action',
                			                    		params:{year:fullYear,snum:'甘水资费责通'+fullYear+'年第'+obj.dlSernum+'号',rtf_nid:rid},
                			                    		method: 'post'
                			                    	});
        											map.put("money"," "+obj.sumPayment);
		        									map.put("mon"," "+obj.sumPayment);
		        									map.put("sernum",'甘水资费责通'+fullYear+'年第'+obj.dlSernum+'号');
		        									map.put("dept",rcd.get("dfagnm"));
		        									map.put("year", rcd.get("y"));
		        									map.put("y1",Ext.util.Format.date(rcd.get("fillDate"),'Y年m月d日'));
		        									map.put("month", rcd.get("mnth"));
		        									map.put("xjrq",getNextDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("zljrq",getNextOneDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("date", fullYear+"年"+fullMonth+"月"+fullDay+"日");
		        									Print("D://责令限期缴纳水资源费通知书.doc",map);
        										}
        									});
        								}else if(i==3){
        									Ext.Ajax.request({
        										url: 'main/wrod_findDeadlineSernum.action',
        										params:{year:fullYear,rtf_nid:rid,deptId:dfagcd,month:mnth,sunyear:y,pubSernum:sernum},
        										method: 'post',
        										scope:this,
        										async:false,
        										callback: function(options, success, response) {
        											var obj = eval('('+response.responseText+')');
        											Ext.Ajax.request({
                			                    		url: 'main/wrod_addDeadlineSernum.action',
                			                    		params:{year:fullYear,snum:'甘水资费责通'+fullYear+'年第'+obj.dlSernum+'号',rtf_nid:rid},
                			                    		method: 'post'
                			                    	});
        											map.put("money"," "+obj.sumPayment);
		        									map.put("mon"," "+obj.sumPayment);
		        									map.put("sernum",'甘水资费责通'+fullYear+'年第'+obj.dlSernum+'号');
		        									map.put("dept",rcd.get("dfagnm"));
		        									map.put("year", rcd.get("y"));
		        									map.put("y1",Ext.util.Format.date(rcd.get("fillDate"),'Y年m月d日'));
		        									map.put("month", rcd.get("mnth"));
		        									map.put("xjrq",getNextDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("zljrq",getNextOneDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("date", fullYear+"年"+fullMonth+"月"+fullDay+"日");
		        									Print("D://责令限期缴纳水资源费通知书(存根).doc",map);
        										}
        									});
        								}else if(i==4){
        									Ext.Ajax.request({
        										url: 'main/wrod_findPunishSernum.action',
        										params:{year:fullYear,rtf_nid:rid,deptId:dfagcd,month:mnth,sunyear:y,pubSernum:sernum},
        										method: 'post',
        										scope:this,
        										async:false,
        										callback: function(options, success, response) {
        											var obj = eval('('+response.responseText+')');
        											Ext.Ajax.request({
                			                    		url: 'main/wrod_addPunishSernum.action',
                			                    		params:{year:fullYear,snum:'甘水罚告'+fullYear+'年第'+obj.punSernum+'号',rtf_nid:rid},
                			                    		method: 'post'
                			                    	});
		        									map.put("sernum", '甘水罚告'+fullYear+'年第'+obj.punSernum+'号');
		        									map.put("dept",rcd.get("dfagnm"));
		        									map.put("money"," "+obj.sumPayment);
		        									map.put("mon"," "+obj.sumPayment);
		        									map.put("m"," "+obj.sumPayment);
		        									map.put("ddate",obj.ddate );
		        									map.put("ddsernum", obj.ddSernum);
		        									map.put("xjrq",getNextDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("zljrq",getNextOneDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("zlj",getNextOneDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("date", fullYear+"年"+fullMonth+"月"+fullDay+"日");
		        									Print("D://甘肃省水利厅行政处罚告知书.doc",map);
        										}
        									});
        								}else if(i==5){
        									Ext.Ajax.request({
        										url: 'main/wrod_findPunishSernum.action',
        										params:{year:fullYear,rtf_nid:rid,deptId:dfagcd,month:mnth,sunyear:y,pubSernum:sernum},
        										method: 'post',
        										scope:this,
        										async:false,
        										callback: function(options, success, response) {
        											var obj = eval('('+response.responseText+')');
        											Ext.Ajax.request({
                			                    		url: 'main/wrod_addPunishSernum.action',
                			                    		params:{year:fullYear,snum:'甘水罚告'+fullYear+'年第'+obj.punSernum+'号',rtf_nid:rid},
                			                    		method: 'post'
                			                    	});
		        									map.put("sernum", '甘水罚告'+fullYear+'年第'+obj.punSernum+'号');
		        									map.put("dept",rcd.get("dfagnm"));
		        									map.put("money"," "+obj.sumPayment);
		        									map.put("mon"," "+obj.sumPayment);
		        									map.put("m"," "+obj.sumPayment);
		        									map.put("ddate",obj.ddate );
		        									map.put("ddsernum", obj.ddSernum);
		        									map.put("xjrq",getNextDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("zljrq",getNextOneDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("zlj",getNextOneDay(Ext.util.Format.date(rcd.get("chargedate"),'Y-m-d')));
		        									map.put("date", fullYear+"年"+fullMonth+"月"+fullDay+"日");
		        									Print("D://甘肃省水利厅行政处罚告知书(存根).doc",map);
        										}
        									});
        								}
    									win_notice.close();
    								 }
        						}]
        					});
        					win_notice.show(this.getEl().dom);						
         					break;
         				case "payment":
         					if(rcd.get("chargedate")<new Date()){
         						late.setValue(rcd.get("chargec")*0.002);
         					}
         					Ext.Ajax.request({
         						url : "queryBalance.action",
         						params : {
         							dfagcd : rcd.get("dfagcd")
         						},
         						success:function(response,options){
         			      			win_alreadypaid = new Ext.Window({
                						title:'缴费',
                						layout:'fit',
                						plain:true,
                						height:200,
                						width:300,
                						modal: true,
                						bodyStyle:"padding:10px",
                						maximizable:false,
                						closeAction:'hide',
                						items: new Ext.FormPanel(
                						{
                							labelWidth : 100,
                							baseCls : 'x-plain',
                							items :[{
                								xtype : 'textfield',
                								fieldLabel:'上月结余(元)',
                								disabled:true,
                								color:'blank',
                								emptyText:Ext.util.Format.number(Ext.decode(response.responseText).balance, '0.00')
                							},late,alread,paid]
                						}),
                						buttons:[{
                    						iconCls:'icon-save',
                    						text:'确定',
                							type:'submit',
                							handler:function(){
                								Ext.Ajax.request({
                									url:"main/payment_confirmPayment.action",
                									params:{id:id,index:0,alreadypaid:alread.getValue(),late:late.getValue(),paid:paid.getValue()},
                									method:"post",
                									success:function(form,action){
                										addLogs("对编号为"+sernum+"的记录缴费"+alread.getValue()+"元！");
                										Ext.Msg.alert("提示信息","缴费成功！"); 
                										rtf_store_payment.reload({params: {start:0,limit:pageSize}}); 
                										win_alreadypaid.close();
                										return ; 
                									},
                									failure:function(form,action){ 
                										Ext.Msg.alert("提示信息","缴费失败！"); 
                										return ; 	
                									} 
                								});
                							}
                 						}]
                 					});
        							win_alreadypaid.show();
         						}
         					});
         					
//         					showConfirm('确认缴费','缴费','main/payment_confirmPayment.action',id,0,store);
         					break;
         				case "cancelpay":
         					showConfirm('取消缴费','取消','main/payment_confirmPayment.action',id,1,rtf_store_payment,sernum);
         					break;
         				case "delay":
         					showConfirm('申请缓交','申请','main/payment_confirmDelay.action',id,0,rtf_store_payment,sernum);
         					break;
         				case "canceldelay":
         					showConfirm('取消缓交','取消','main/payment_confirmDelay.action',id,1,rtf_store_payment,sernum);
         					break;
         				case "delete":
         					 var id=rcd.get("id");
        					 var sernum=rcd.get("sernum");
        				     Ext.MessageBox.confirm('确认删除', '您确定要执行此操作吗？',function(btn){
        					     if(btn=="yes"){
        							Ext.Ajax.request({
        								url:"main/payment_delRecords.action",
        								params:{id:id},
        								method:"post",
        								scope:this,
        								success:function(form,action){
        									addLogs("删除了编号为"+sernum+"的取水缴费记录！");
        									Ext.Msg.alert("提示信息","删除成功！"); 
        									rtf_store_payment.reload({params: {start:0,limit:pageSize}}); 
        									return ; 
        								},
        								failure:function(form,action){ 
        									Ext.Msg.alert("提示信息","删除失败！"); 
        									return ; 
        								} 
        							});
        						};
        					 });
         					break;
         			}
         		}
         	}
        },
     	"beforeclose":function(){
			if(this.form) this.form.destroy();
		}
    });
	var tb_date = new Ext.form.DateField({
		name:'tbrq',
        fieldLabel:'填报日期',
        emptyText:'请选择填报日期！',
        format:'Y-m-d',
        disabledDays:[0,6],
        allowBlank:false
        
	});
	var win_bankModify=null;
	var editform=null;
	var bar = new Ext.Toolbar({
    	height:30,
    	items:[{
    		text:'添加',
    		iconCls:'silk-add',
    		xtype:'button',
    		handler : function() {
				if (!win_addpayment) {
					win_addpayment = new Ext.Window({
						title : '取水量（发电量）填报',
						layout : 'fit',
						plain : true,
						height : 500,
						width : 760,
						bodyStyle : "padding:10px",
						modal : true,
						maximizable : false,
						closeAction : 'hide',
						buttonAlign : "center",
						items : addpayment
					});
				}
				addpayment.form.reset();
				win_addpayment.show(this.getEl().dom);
			}
    	},'-',{
    		text:'修改填报日期',
    		iconCls:'silk-modify',
    		xtype:'button',
    		handler:function(btn,ev){
    			var record = gridParent.getSelectionModel().getSelected();
    			if(!Ext.isDefined(record)){
    				top.Ext.Msg.alert("提示","请先选中要修改的行！");
    				return;
    			}
    			if (!win_bankModify){
    				editform=new Ext.form.FormPanel({
    					baseCls: 'x-plain',
		    			labelAlign:'right',
		    			labelWidth	: 80,
    					defaults:{
    						width:160,
    						allowBlank:false
    					},
    					items:tb_date,
    					buttons:[{
    						iconCls:'icon-save',
    						text:'保存',
							type:'submit',
							handler:function(){
								editform.form.doAction("submit",{
		    					url:'main/payment_updateDate.action',
		    					params:{id:record.get("id"),tbrq:tb_date.value},
		    					success:function(form, action){
		    						Ext.Msg.alert("success!", "修改成功！");
		    						gridParent.getStore().reload({params:{start:0, limit:pageSize}});
		    						win_bankModify.close();
		    					},
		    					failure:function(form, action){
		    						Ext.Msg.alert("failure!",  "修改失败！");
		    						win_bankModify.close();
		    					}
		    					});
		    				}
    					}]
    				});
		    		editform.getForm().loadRecord(record);
					win_bankModify = new Ext.Window({
						title:'修改填报日期',
						layout:'fit',
						plain:true,
						height:120,
						width:300,
						modal: true,
						bodyStyle:"padding:10px",
						maximizable:false,
						closeAction:'hide',
						buttonAlign:"center",
						items:editform
					});
				}
				win_bankModify.show(this.getEl().dom);
    		}
    	}, '-', {
    		text : '导出Excel',
		     xtype  : 'button',
		     iconCls : 'silk-excel',
		     handler : function(){
		     var map = new Map();
		     map.put("sernum", "流水编号");
		     map.put("dfagnm", "取水单位（个人）");
		     map.put("addvnm", "行政区划");
		     map.put("wrrnm", "水资源分区");
		     map.put("trade", "行业类型");
		     map.put("account", "缴费帐号");
		     map.put("chargec", "缴费金额");
		     ExportExcel(rtf_store_payment, map);
		    }
    	},'-','按缴费状态查询：',{
    		xtype:'radiogroup',
    		id:'rdoIs',
    		defaultType:'radio',
    		hideLabels:true,
    		height:25,
			width:210,
    		items:[
    		       {boxLabel:'全部',name:'radio',inputValue:'1',checked:true},
    		       {boxLabel:'未缴',name:'radio',inputValue:'2'},
    		       {boxLabel:'未缴清',name:'radio',inputValue:'3'},
    		       {boxLabel:'已缴清',name:'radio',inputValue:'4'}
    		       ],
	       listeners : {
	   			'change' : function() {
					qshid = Ext.getCmp('nqshname').getValue();
					szyid = Ext.getCmp('nszyname').getValue();
					xzqid = Ext.getCmp('nxzqname').getValue();
					hyid = Ext.getCmp('nhyname').getValue();
					startDate=Ext.getCmp('startDate').getValue();
					endDate=Ext.getCmp('endDate').getValue();
	   				index=Ext.getCmp('rdoIs').getValue().inputValue;
	   				rtf_store_payment.reload({params: {start:0,limit:pageSize,index:index,qshId:qshid,xzqId:xzqid,szyId:szyid,hyId:hyid,startDate:startTime,endDate:endTime}});
	   			}
	   		}
    	}]
	});
	var panel=new Ext.Panel({
		id:"panels",
        layout:'vbox',
        tbar: bar,
        bbar:pagingbar,
		title:"缴费管理",
		closable: true,
		layoutConfig: {
			align: 'stretch',
			pack: 'start'
		},
		items:[search_form,gridParent]
	});
    tPanel.add(panel);
	tPanel.setActiveTab('panels');
}
