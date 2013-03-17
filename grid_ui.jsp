<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>Remote Data</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="Access-Control-Allow-Origin" content="*">
	<meta http-equiv="description" content="This is my page">

	<link rel="stylesheet" type="text/css" href="http://192.168.1.103:8180/ext-4/resources/css/ext-all.css">
	<script type="text/javascript" src="http://192.168.1.103:8180/ext-4/ext-all.js"></script>
	<script type="text/javascript">
		Ext.onReady(function(){
			//创建数据模型
			Ext.regModel('BookInfo', {
				fields: [{name: 'bookName'}]
			});
			//定义组合框中显示的数据源
			var bookStore = Ext.create('Ext.data.Store', {
				model: 'BookInfo',
				proxy: {
					type: 'ajax',	//Ext.data.AjaxProxy
					url: 'bookSearchServer.jsp',
					reader: new Ext.data.ArrayReader({model: 'BookInfo'})
				}
			});
			
			//创建表单
			Ext.create('Ext.form.Panel', {
				title: 'Ext.form.field.ComboBox远程数据源示例',
				frame: true,
				height: 100,
				width: 270,
				//renderTo: Ext.getBody(),
				bodyPadding: 5,
				defaults: {//统一设置表单字段默认属性
					labelSeparator: ': ',	//分隔符
					labelWidth: 70,
					width: 200,	//字段宽度
					labelAlign: 'left' //标签对齐方式
				},
				items: [{
					xtype: 'combo',
					fieldLabel: '书籍列表',
					listConfig: {
						loadingText: '正在加载书籍信息', //加载数据时显示的提示信息
						emptyText: '未找到匹配值',	//当值列表不在列表时的提示信息
						maxHeight: 100	//设置下拉列表的最大高度为60像素 
					},
					allQuery: 'allbook',	//查询全部信息的查询字符串
					minChars: 3,	//下拉列表框自动选择钱用户需要输入的最小字符数量
					queryDelay: 300,	//查询延迟时间
					queryParam: 'searchbook',	//查询的名字
					triggerAction: 'all',	//单击触发按钮显示全部数据
					store: bookStore,	//设置数据源
					displayField: 'bookName',	//定义要显示的字段
				}]
			});
			
			var gridstore = Ext.create('Ext.data.Store', {
				fields : [{name : 'datadate'}, {name : 'tablename'}],		
				proxy : {
					type : 'ajax',
					url : 'me.jsp',
					actionMethods: {
                		read: 'POST'
            		},
					reader : {
						type : 'json',
						root : 'rows'
					}
				},
				autoLoad : true
    		});
			
			//创建表格
			Ext.create('Ext.grid.Panel', {
				title: '系统监控',
				store: gridstore,
				renderTo: Ext.getBody(),
				columns: [{
					header: '日期',
					dataIndex: 'datadate',
					width: 180,
					renderer: function(v){
						if (v == 10)
							return '<img src="fam/accept.png" />';
						else
							return '<img src="fam/delete.gif" />';
					}
				},{
					header: '表名',
					dataIndex: 'tablename',
					flex: 1
				}]
			});
		});
	</script>
  </head>
  
  <body>
  </body>
</html>
