<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%@ page import="com.google.gson.*" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<%
  	Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null;
		JsonObject json = null;
		try{
			Class.forName("com.ibm.db2.jcc.DB2Driver").newInstance();
			String url = "jdbc:db2://192.168.1.106:50000/sample";
			String user = "db2inst1";
			String password = "Db2";
			conn = DriverManager.getConnection(url, user, password);

			stmt = conn.createStatement();
			String sql = "select * from act";
			rs = stmt.executeQuery(sql);
			
			int count = 0;	//计算记录数
			JsonArray array = new JsonArray();
			while(rs.next()){
				JsonObject obj = new JsonObject();
				obj.addProperty("datadate", rs.getString("actno"));
				obj.addProperty("tablename", rs.getString("actkwd"));
				array.add(obj);
				
				count++;
			}
			//返回格式数据
			json = new JsonObject();
			json.addProperty("totals", count);
			json.add("rows", array);
			
			System.out.println(json.toString());
		}catch(SQLException e){
			System.out.println(e);
		}
		response.getWriter().write(json.toString());
 %>
