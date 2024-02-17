import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";
import express from "express";
import Get_profesor_ids from "./lib/Professor_info.js";
import get_user_info from "./lib/Student_info.js";
const port = process.env.PORT || 8000;
const app = express();
var latest_news = [];
var not = [];
var jobs = [];
var events = [];
var tenders = [];
var firstyears = [];
const address = "http://www.dtu.ac.in/";
app.use(cors());
function web_scrapping(tab_id) {
  const notices = [];
  axios(address, { timeout: 30000 })
    .then((response) => {
      const html = response.data;
      const data_html = cheerio.load(html);
      data_html(`#${tab_id} .latest_tab ul li`, html).each(async function () {
        const urls = [];
        const title = data_html(this).find("h6 a").text();

        const date_string = data_html(this).find("small em i").text();

        var parts = date_string.split(".");
        var date = new Date(
          parseInt(parts[2], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[0], 10)
        );

        data_html(this)
          .find("a")
          .each(function () {
            var url = data_html(this).attr("href");

            if (url) {
              url = address + (url.slice(0, 0) + url.slice(1, url.length));
              urls.push(url);
            }
          });

        if (title != "") {
          notices.push({ title, date, urls });
          // if(tab_id==="tab4"){

          //     await setDoc(doc(db, "Notices",encodeURI(title.slice(0,5))), {
          //         title: title,
          //         date: date,
          //         links: urls
          //     });
          // }
        }
      });

      //console.log(notices)
    })
    .catch((err) => {
      return JSON.stringify(err);
    });
  //console.log(notices);
  return notices;
}
function request_notices() {
  latest_news = web_scrapping("tab4");
  not = web_scrapping("tab1");
  jobs = web_scrapping("tab2");
  tenders = web_scrapping("tab3");
  events = web_scrapping("tab5");
  firstyears = web_scrapping("tab8");
}
request_notices();
setInterval(() => {
  request_notices();
}, 5000);

app.get("/info/latestnews", async (req, res) => {
  res.status(200).send(latest_news);
});
app.get("/info/notices", (req, res) => {
  res.status(200).send(not);
});
app.get("/info/jobs", (req, res) => {
  res.status(200).send(jobs);
});
app.get("/info/tenders", (req, res) => {
  res.status(200).send(tenders);
});
app.get("/info/events", (req, res) => {
  res.status(200).send(events);
});
app.get("/info/firstyear", (req, res) => {
  res.status(200).send(firstyears);
});

app.get("/", async (req, res) => {
  const status = (await axios(address, { timeout: 30000 })).status;
  if (status) {
    res.send(
      `<div>welcome to dtu-unoffical-api \n status:${
        status == 200 ? "Active" : `${address} inactive`
      } <a href="https://github.com/VarunDTU/dtu-unofficial-api">Docs<a></div>`
    );
  }
});
app.get("/student-info/:name/:password", async function (req, res) {
  const name = req.params.name.replace(/_/g, "/");

  const password = decodeURI(req.params.password);

  if (name.length < 10 || password.length < 8) {
    res.status(200).send("E:wrong id or password");
  }
  const ans = await get_user_info(name, password);
  res.status(200).send(ans);
});
app.get("/search/professor_id/:query", async function (req, res) {
  const query = req.params.query;

  res.status(200).send(await Get_profesor_ids(query));
});

app.listen(port, () => {
  console.log("RUNNING", port);
});
