import java.io.BufferedReader; 
import java.io.File; 
import java.io.FileInputStream; 
import java.io.FileOutputStream; 
import java.io.IOException; 
import java.io.InputStreamReader; 
import java.io.OutputStreamWriter; 
import java.io.PrintWriter; 

/** 
* 将gbk的代码放到srcDir之下，转码置destDir之下，暂不支持srcDir之下有目录，有需要再添加 
* @author niewj 
* @2012-6-1 
*/ 
public class UTF8Parser { 

/** 
* @author niewj 
* @since 2012-6-1 
*/ 
static File srcDir = new File("/Users/dou/gbk"); 
static File destDir= new File("/Users/dou/utf8"); 

public static void main(String[] args) { 
//1.判断是目录 
if(!srcDir.isDirectory()){ 
return; 
} 
//2.遍历所有目录 
File[] fs = srcDir.listFiles(); 

//创建目标目录 
if(!destDir.exists()){ 
destDir.mkdirs(); 
} 

try { 
new UTF8Parser().parse(fs); 
} catch (IOException e) { 
e.printStackTrace(); 
} 
} 

/** 
* 目录就迭代遍历；文件就重编码 
* @author niewj 
* @since 2012-6-1 
*/ 
private void parse(File[] fs) throws IOException { 
for(File file:fs){ 
if(!file.isDirectory()){ 
File destFile = new File(destDir,file.getName()); 
parse2UTF_8(file,destFile); 
}else{ 
parse(file.listFiles()); 
} 
} 
} 

/** 
* @author niewj 
* @since 2012-6-1 
*/ 
private void parse2UTF_8(File file,File destFile) throws IOException { 
StringBuffer msg = new StringBuffer(); 
//读写对象 
PrintWriter ps = new PrintWriter(new OutputStreamWriter(new FileOutputStream(destFile,false),"utf8")); 
BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file),"gbk")); 

//读写动作 
String line = br.readLine(); 
while(line!=null){ 
msg.append(line).append("rn"); 
line = br.readLine(); 
} 
ps.write(msg.toString()); 
br.close(); 
ps.flush(); 
ps.close(); 
} 

}
