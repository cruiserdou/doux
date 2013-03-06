package xwq;
import java.sql.*;

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
			System.out.println("Connection Done!");
			Statement stmt = conn.createStatement();
			String sql = "select * from act";
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()){
				System.out.println(rs.getString(1) + " " + rs.getString(2));
			}
		}catch(SQLException e){
			System.out.println(e);
		}
	}
}

