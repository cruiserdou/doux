package xwq;
import java.sql.*;
import com.google.gson.*;

public class ConnDB {

  /**
	 * @param args
	 */
	
	public static void main(String[] args) throws SQLException, Exception{
		try{
			Class.forName("com.ibm.db2.jcc.DB2Driver").newInstance();
			String url = "jdbc:db2://192.168.1.106:50000/sample";
			String user = "db2inst1";
			String password = "Db2";
			Connection conn = DriverManager.getConnection(url, user, password);

			Statement stmt = conn.createStatement();
			String sql = "select * from act";
			ResultSet rs = stmt.executeQuery(sql);
			
			int count = 0;	//计算记录数
			JsonArray array = new JsonArray();
			while(rs.next()){
				JsonObject obj = new JsonObject();
				obj.addProperty("actno", rs.getString("actno"));
				obj.addProperty("actkwd", rs.getString("actkwd"));
				obj.addProperty("actdesc", rs.getString("actdesc"));
				array.add(obj);
				
				count++;
			}
			//返回格式数据
			JsonObject json = new JsonObject();
			json.addProperty("totals", count);
			json.add("rows", array);
			
			System.out.println(json.toString());
		}catch(SQLException e){
			System.out.println(e);
		}
	}
}






