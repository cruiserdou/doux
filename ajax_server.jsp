<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.google.gson.*" %>
<%@ page import="java.io.*" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<%  	
		JsonObject json = null;
		String s = null;
		try{
			Process p = Runtime.getRuntime().exec("sh /Users/dou/hello.sh");
			BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
			BufferedReader stdError = new BufferedReader(new InputStreamReader(p.getErrorStream()));			
			
			int count = 0;
			JsonArray array = new JsonArray();
			while((s = stdInput.readLine()) != null){
				System.out.println(s);
				JsonObject obj = new JsonObject();
				String arrays[] = s.split(" ");
				int j = 0;
				for(int i = 0; i < arrays.length; i++){
					if(!arrays[i].equals("")){
						obj.addProperty("item"+String.valueOf(j++), arrays[i]);
						System.out.print(arrays[i] + " ");
					}
				}
				array.add(obj);
				count++;
			}
			json = new JsonObject();
			json.addProperty("totals", count);
			json.add("rows", array);
		}catch(IOException e){
			System.out.println("Excepiton happend -here's what I know:");
			e.printStackTrace();
			System.exit(-1);
		}
		response.getWriter().write(json.toString());
 %>

 
 
 
 
 
 
 
 
 
