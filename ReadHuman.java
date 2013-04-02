package org.xwq;

import java.util.Scanner;
import java.io.File; 
import java.io.FileNotFoundException; 

public class ReadHuman { 
  private static void readfile(String filename) { 
		try { 
			Scanner scanner = new Scanner(new File(filename)); 
			scanner.useDelimiter(System.getProperty("line.separator"));    
			while (scanner.hasNext()) 
			{       
				parseline(scanner.next());   
			} 
			scanner.close(); 
		}catch (FileNotFoundException e) {    
			System.out.println(e); 
		} 
	}

	private static void parseline(String line) {     
		Scanner linescanner = new Scanner(line);    
		linescanner.useDelimiter(","); 
		//可以修改usedelimiter参数以读取不同分隔符分隔的内容     
		String name = linescanner.next();     int age = linescanner.nextInt();     
		String idate = linescanner.next(); 
		boolean iscertified = linescanner.nextBoolean(); 
		System.out.println("姓名："+name+" ，年龄："+ age+" ，入司时间："+ idate+" ，验证标记："+iscertified ); 
	} 
	public static void main(String[] args) {     
		if (args.length != 1) { 
			System.err.println("usage: java readhuman file location");    System.exit(0);    
		} 
		readfile(args[0]);
	} 
} 
