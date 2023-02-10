const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const { default: puppeteer } = require('puppeteer');

const app=express()
var latest_news=[];
var not=[]
var jobs=[]
var tenders=[]
var firstyears=[]
const address="http://dtu.ac.in/"
function web_scrapping(tab_id){
    const notices=[];
    axios(address).then((response) => {

        const html=response.data
        const data_html=cheerio.load(html)
        data_html(`#${tab_id} .latest_tab ul li`,html).each(function(){
            const urls=[]
            const title=data_html(this).find('h6 a').text();
            
            
                
            const date_string= data_html(this).find('small em i').text();
                
            
           
            var parts = date_string.split(".");
        var date = new Date(parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10));
        
        data_html(this).find('a').each(function(){
            var url=data_html(this).attr('href')
            
            if(url){
                url=address+(url.slice(0,0)+url.slice(1,url.length))
                urls.push(url)
                
            }
        })
        
       if(title!=""){
        
           notices.push({title ,date,
               urls})
       } 
            
        })
        
        
        
        //console.log(notices)
        
    })
    return notices;
  
}

async function get_user_info(id,password){
    const user_profile=[]
    const browser=await puppeteer.launch()
    const page=await browser.newPage()
    await page.goto("https://cumsdtu.in/student_dtu/login/login.jsp")
    
    await page.type("#usernameId",id)
    await page.type("#passwordId",password)
    console.log(id,password)
    
    await Promise.all([page.click("#loginBtnPnl"),page.waitForNavigation()])

    
  
    const page_url=page.url()
    console.log(page_url)
    if(page_url=="https://cumsdtu.in/student_dtu/login/login.jsp"){
        await browser.close()
        return "wrong password or id"
    }
    await Promise.all([page.click("#Link145"),page.waitForNavigation()])
    const dob=await page.$eval("#Label597",el=>el.textContent)
    console.log(dob);
    
    
    await browser.close()
    return dob;
}
var request_notices=setInterval(() => {
    latest_news= web_scrapping('tab4');
   not=web_scrapping('tab1');
   jobs=web_scrapping('tab2');
   tenders=web_scrapping('tab3');
   events= web_scrapping('tab5');
   firstyears= web_scrapping('tab8');


}, 5000);



    app.get('/latestnews', (req,res)=>{
        
        res.status(200).send(latest_news)
    });
    app.get('/notices', (req,res)=>{
        
        res.status(200).send(not)
    });
    app.get('/jobs', (req,res)=>{
        
        res.status(200).send(jobs)
    });
    app.get('/tenders', (req,res)=>{
        
        res.status(200).send(tenders)
    });
    app.get('/events', (req,res)=>{
       
        res.status(200).send(events)
    });
    app.get('/firstyear', (req,res)=>{
        res.status(200).send(firstyears)
    });
    app.get("/user-info/:name/:password", async function(req, res) {
        const name=req.params.name.replace(/_/g,"/");
        
        const password=decodeURI(req.params.password)
        console.log(password)
        if(name.length<10||password.length<8){
            res.status(200).send( "wrong id or password")
        }
        const ans=await get_user_info(name,password)
      res.status(200).send(ans)
      
    
      });


    
    app.listen(8000,()=>{console.log("RUNNING")})