const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const { default: puppeteer } = require('puppeteer');
const port=process.env.PORT||8000
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
    const browser=await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] ,ignoreDefaultArgs: ['--disable-extensions']})
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
    await page.screenshot({path:'p1.png'})
    await Promise.all([page.click("#Link145"),page.waitForNavigation()])
    
    await page.screenshot({path:'p2.png'})
    var dob=await page.$eval("#Label597",el=>el.textContent)
    dob=dob.split('\n').join(' ')
    var Branch=await page.$eval("#Label613",el=>el.textContent)
    Branch=Branch.split('\n').join(' ')
    var email=await page.$eval("#Label240",el=>el.textContent)
    email=email.split('\n').join(' ')
    var Father_name=await page.$eval("#Label242",el=>el.textContent)
    Father_name=Father_name.split('\n').join(' ')
    var Mother_name=await page.$eval("#Label243",el=>el.textContent)
    Mother_name=Mother_name.split('\n').join(' ')
    var Phone=await page.$eval("#Label265",el=>el.textContent)
    Phone=Phone.split('\n').join(' ')
    var Address=await page.$eval("#Label596",el=>el.textContent)
    Address=Address.split('\n').join(' ')
    var Availing_Hostel=await page.$eval("#ListItem735",el=>el.textContent)
    Availing_Hostel=Availing_Hostel.split('\n').join(' ')
    console.log(dob,Branch,email,Father_name,Mother_name,Phone,Address,Availing_Hostel);
    user_profile.push({id,dob,Branch,email,Father_name,Mother_name,Phone,Address,Availing_Hostel})
    
    
    await browser.close()

    return user_profile;
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
    app.get('/',(req,res)=>{res.status(200).send('welcome to dtu-unoffical-api')})
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


    
    app.listen(port,()=>{console.log("RUNNING",{port})})