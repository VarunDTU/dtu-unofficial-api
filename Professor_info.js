import axios from "axios";
import * as cheerio from "cheerio";

async function Get_profesor_ids(tab_id) {
  const web_name = `https://dtu.irins.org/searchc/search?title=${tab_id}`;
  const ids = [];
  try {
    await axios(web_name).then(async (result) => {
      const html = result.data;
      const html_data = cheerio.load(html);
      html_data(".product-description .overflow-h", html).each(function () {
        var name = html_data(this).find("h4 strong").text().trim();
        name = name.replace("Prof", "").trim();
        name = name.replace("Ms", "").trim();
        name = name.replace("Mr", "").trim();
        name = name.replace("Dr", "").trim();
        var id = html_data(this).find(".pull-right li").text().trim();
        id = id.replace(/\D/g, "").trim();
        var department = html_data(this)
          .find(".margin-bottom-5 b")
          .text()
          .trim()
          .replace(/\n/g, "")
          .replace(/" "/g, "");

        ids.push({ id, name, department });
        // console.log(ids)
      });
    });
  } catch (error) {
    return error;
  }
  return ids;
  return "ff";
}

export default Get_profesor_ids;
