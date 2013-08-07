<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <title>甘肃省取水许可与水资源费征收系统</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="description" content="This is xwQ">
	<script type="text/javascript">
		function getCookie(objName) {
			var arrStr = document.cookie.split("; ");
			for ( var i = 0; i < arrStr.length; i++) {
				var temp = arrStr[i].split("=");
				if (temp[0] == objName)
					return unescape(temp[1]);
			}
		}
		var userid = getCookie("usercd");
		var usernm = getCookie("usernm");
		var roleid = getCookie("roleid");
	</script>
	<!-- 	图标 -->
	<link rel="shortcut icon" href="images/icon/globeblue.ico" type="image/x-icon" />
	
	<link rel="stylesheet" type="text/css" href="gis/cssfile/main.css" />
	<!-- 	Ext类库 -->
	<link rel="stylesheet" type="text/css" href="http://www.giscloud.org/jslib/ext-4/resources/css/ext-all-debug.css" />
	<script type="text/javascript" src="http://www.giscloud.org/jslib/ext-4/ext-all.js"></script>
	<script type="text/javascript" src="http://www.giscloud.org/jslib/ext-4/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="http://www.giscloud.org/jslib/ext-4/examples/shared/examples.js"></script>
	<link rel="stylesheet" type="text/css" href="http://www.giscloud.org/jslib/ext-4/examples/shared/example.css" />
	
	<link rel="stylesheet" href="http://www.giscloud.org/jslib/OpenLayers-2/theme/default/style.css" />
	<script type="text/javascript" src="http://www.giscloud.org/jslib/OpenLayers-2/OpenLayers.js"></script>
	<script type="text/javascript" src="http://www.giscloud.org/jslib/GeoExt4/src/data/LayerStore.js"></script>
	<script type="text/javascript" src="http://www.giscloud.org/jslib/GeoExt4/src/data/reader/Layer.js"></script>
	<script type="text/javascript" src="http://www.giscloud.org/jslib/GeoExt4/src/data/LayerModel.js"></script>
	<script type="text/javascript" src="http://www.giscloud.org/jslib/GeoExt4/src/panel/Map.js"></script>

	<script type="text/javascript" src="js/wuser.js"></script>
	<script type="text/javascript" src="js/rules.js"></script>
	<script type="text/javascript" src="js/reports/rp_detail.js"></script>
	<script type="text/javascript" src="js/reports/rp_trade.js"></script>
	<script type="text/javascript" src="js/reports/rp_addv.js"></script>
	<script type="text/javascript" src="js/fwallowlicense.js"></script>
	<script type="text/javascript" src="js/log.js"></script>
	<script type="text/javascript" src="js/role.js"></script>
	<script type="text/javascript" src="js/userinfo.js"></script>
	<script type="text/javascript" src="js/wpayment.js"></script>
	<script type="text/javascript" src="js/payfirm.js"></script>
	<script type="text/javascript" src="js/search.js"></script>
	<script type="text/javascript" src="js/wfees.js"></script>
	<script type="text/javascript" src="js/wfunca.js"></script>
	<script type="text/javascript" src="js/warea.js"></script>
	<script type="text/javascript" src="js/wtype.js"></script>
	<script type="text/javascript" src="js/addv.js"></script>
	<script type="text/javascript" src="js/trade.js"></script>
	<script type="text/javascript" src="js/wfuse.js"></script>
	<script type="text/javascript" src="js/map.js"></script>
	<script type="text/javascript" src="js/funcpanel.js"></script>
	<link rel="stylesheet" type="text/css" href="gis/cssfile/tabs.css" />
	<script type="text/javascript" src="js/tabs.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
  </head>
  
  <body>
  	<%
		String user = (String) session.getAttribute("user");
		if (user == null) {
			response.setContentType("text/html; charset=UTF-8");
			response.sendRedirect("/WaterRM/index.jsp");
		}
	%>
  </body>
</html>
