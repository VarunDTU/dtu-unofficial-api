import puppeteer from "puppeteer";
async function get_user_info(id, password) {
  console.log(id, password.length);
  const user_profile = [];
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
  const page = await browser.newPage();
  await page.goto("https://cumsdtu.in/student_dtu/login/login.jsp");
  await page.type("#usernameId", id);
  await page.type("#passwordId", password);
  console.log(id, password);

  await Promise.all([page.click("#loginBtnPnl"), page.waitForNavigation()]);

  const page_url = page.url();
  console.log(page_url);

  if (page_url == "https://cumsdtu.in/student_dtu/login/login.jsp") {
    await browser.close();
    return "wrong password or id";
  }

  await Promise.all([page.click("#Link145"), page.waitForNavigation()]);

  var dob = await page.$eval("#Label597", (el) => el.textContent);
  dob = dob.split("\n").join(" ");
  var Branch = await page.$eval("#Label613", (el) => el.textContent);
  Branch = Branch.split("\n").join(" ");
  var email = await page.$eval("#Label240", (el) => el.textContent);
  email = email.split("\n").join(" ");
  var Father_name = await page.$eval("#Label242", (el) => el.textContent);
  Father_name = Father_name.split("\n").join(" ");
  var Mother_name = await page.$eval("#Label243", (el) => el.textContent);
  Mother_name = Mother_name.split("\n").join(" ");
  var Phone = await page.$eval("#Label265", (el) => el.textContent);
  Phone = Phone.split("\n").join(" ");
  var Address = await page.$eval("#Label596", (el) => el.textContent);
  Address = Address.split("\n").join(" ");
  var Availing_Hostel = await page.$eval(
    "#ListItem735",
    (el) => el.textContent
  );
  Availing_Hostel = Availing_Hostel.split("\n").join(" ");
  console.log(
    dob,
    Branch,
    email,
    Father_name,
    Mother_name,
    Phone,
    Address,
    Availing_Hostel
  );
  user_profile.push({
    id,
    dob,
    Branch,
    email,
    Father_name,
    Mother_name,
    Phone,
    Address,
    Availing_Hostel,
  });

  await browser.close();

  return user_profile;
}

export default get_user_info;
