package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;


public class SlackBotTests
{
	private static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}
	
	

	
	@Test
	public void checkHelpFunctionality()
	{
		driver.get("https://envbotteam.slack.com/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Type in your test user login info.
		email.sendKeys("xyz@ncsu.edu");
		String memberName = "YourUnityID";
		pw.sendKeys("*****");

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));

		// Switch to #bots channel and wait for it to load.
		driver.get("https://envbotteam.slack.com/messages/@testbot");
		wait.until(ExpectedConditions.titleContains("bot"));
		
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("help");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body']/div[@class='attachment_pretext for_attachment_group' and text() = 'Hello ']"));
		assertNotNull(msg);
	}
}















//@Test
//public void postMessage()
//{
//	
//	driver.get("https://envbotteam.slack.com/");
//
//	// Wait until page loads and we can see a sign in button.
//	WebDriverWait wait = new WebDriverWait(driver, 30);
//	wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));
//
//	// Find email and password fields.
//	WebElement email = driver.findElement(By.id("email"));
//	WebElement pw = driver.findElement(By.id("password"));
//
//	// Type in our test user login info.
//	email.sendKeys("cpancha@ncsu.edu");
//	pw.sendKeys("ChintzC1024$");
//
//	// Click
//	WebElement signin = driver.findElement(By.id("signin_btn"));
//	signin.click();
//
//	// Wait until we go to general channel.
//	wait.until(ExpectedConditions.titleContains("general"));
//
//	// Switch to #bots channel and wait for it to load.
//	driver.get("https://envbotteam.slack.com/messages/@testbot");
//	wait.until(ExpectedConditions.titleContains("bot"));
//
//	// Type something
//	WebElement messageBot = driver.findElement(By.id("message-input"));
//	messageBot.sendKeys("hello world, from Selenium");
//	messageBot.sendKeys(Keys.RETURN);
//
//	wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
//
//	WebElement msg = driver.findElement(
//			By.xpath("//span[@class='message_body' and text() = 'hello world, from Selenium']"));
//	assertNotNull(msg);
//}