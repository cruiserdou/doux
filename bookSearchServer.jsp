<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
String bookName = request.getParameter("searchbook");
String jav = "['java编程思想'],['java入门'],['javascript程序设计']";
String cpp = "['c++编程思想'],['c++入门'],['c++程序设计']";
String php = "['php程序设计'],['php入门'],['php从入门到精通']";
String books = "";
if(bookName.equals("allbook")){
  books = "["+jav+","+cpp+","+php+"]";
	response.getWriter().write(books);
	return;
}else{
	bookName = bookName.substring(0,3);//取查询字符串的前3个字符
	System.out.println(bookName);

	if(bookName.equals("jav")){
		books = "["+jav+"]";
	}else if(bookName.equals("c++")){
		books = "["+cpp+"]";
	}else if(bookName.equals("php")){
		books = "["+php+"]";
	}else{
		books = "[['没有数据']]";
	}
	response.getWriter().write(books);
}
%>
