package org.xwq;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

public class ReadTextFile {
  public static void main(String[] args) throws UnsupportedEncodingException{
		File file = new File("/Users/dou/utf8/1.txt");
		StringBuffer contents = new StringBuffer();
		BufferedReader reader = null;
		
		try{
			reader = new BufferedReader(new FileReader(file));
			String text = null;
			while((text = reader.readLine()) != null){
				contents.append(text).append(System.getProperty("line.separator"));
			}
		}catch(FileNotFoundException e){
			e.printStackTrace();
		}catch(IOException e){
			e.printStackTrace();
		}finally{
			try{
				if (reader != null)
					reader.close();
			}catch(IOException e){
				e.printStackTrace();
			}
		}
		System.out.println(contents.toString());
	}
}
