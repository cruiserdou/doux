import java.io.*;

public class JavaRunCommand {

  /**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String s = null;
		
		try{
			//Run the Unix "ps -ef" command
			//using the Runtime exec method:
			Process p = Runtime.getRuntime().exec("ps -ef");
			
			BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
			BufferedReader stdError = new BufferedReader(new InputStreamReader(p.getErrorStream()));
			
			//read the output from the command
			System.out.println("Here is the standard output of the command: \n");
			while ((s = stdInput.readLine()) != null){
				System.out.println(s);
			}
			
			//read and errors from the attempted command
			System.out.println("Here is the standard error of the command(if any): \n");
			while((s = stdError.readLine()) != null){
				System.out.println(s);
			}
			
			System.exit(0);
		}catch(IOException e){
			System.out.println("Exception happend -here's what I know:");
			e.printStackTrace();
			System.exit(-1);
		}
	}

}
