const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
require('dotenv').config()
const objectRepo = require("../Pages/ObjectRepo.json")
const browsertype = process.env.BROWSER
const fsp = require('fs').promises, path = require('path')
const uuid = require("uuid4");

class CoreModules {

    constructor(){
        this.session = uuid() // holds unique id
        this.report = [] // holds all report
        this.skip = false // created this to skip a step when there is error
        this.overallstatus = "Pass"
        this.#start();
    }
    async InitialiseDriver() {
        this.driver = await new Builder().forBrowser(browsertype).build();
        // wait untill page is loaded
        
        return this;
    }

    async navigate( url) {
        await this.driver.get(url)
        return this;
    }

    async quit() {
        // await this.driver.close()
        await this.driver.quit();
    }

    async find(objectName, waitTime = 30) {
        return await this.driver.wait(until.elementLocated(this.ByObjDef(objectName)),waitTime * 1000);
    }
    // Click to click a element
    async click(objectname){
        let desc =  this.ByObjDesc("Clicked",objectname)
        try{
            (await this.find(objectname, process.env.ELEMENT_DISPLAY_WAIT)).click();
            await this.wait_readystate();
            let screenshot = await this.screenshot();
            this.WriteStatus(desc,true,"",screenshot)

        } catch(e) {
            this.WriteStatus(desc,false, e)
        }
        
        
            
    }
    // Type in text box
    async Type(objectname, value){
        let desc =  this.ByObjDesc("Typed text",objectname)
        try{
            (await this.find(objectname, process.env.ELEMENT_DISPLAY_WAIT)).sendKeys(value);
            let screenshot = await this.screenshot();
            this.WriteStatus(desc,true,"",screenshot)

        } catch(e) {
            this.WriteStatus(desc,false, e)
        }
        
        
            
    }
    async screenshot(){
        
        // var dirname = path.dirname(process.env.SCREENSHOT_PATH);
         var filePath = path.join(process.env.SCREENSHOT_PATH , this.session)
        await fsp.mkdir(filePath, { recursive: true }, (err) => {
            if (err) throw err;
          });

        return await this.driver.takeScreenshot().then(async(image)=> {
            var id = uuid();
            var report_path = filePath + "\\" + id+ ".png"
            if(process.env.STEP_SCREENSHOT.toLowerCase() ==="true"){
                await fsp.writeFile(report_path, image, 'base64').catch(e => console.log(e))
            }
            return image
        })
        
    }
    ByObjDef(ObjectRepoName) {
        debugger
        let using = Object.keys(ObjectRepoName)[0]
        let value = ObjectRepoName[using]
        return new By(using,value)
    }
    ByObjDesc(action, ObjectRepoName){
        return `${action} on ${ObjectRepoName["desc"] || ""} `
    }
    WriteStatus(desc, status, e="", pic=""){
        this.report.push({"step": desc , "status": status, "error": e, "screenshot":pic})
         if(!status){this.overallstatus = "Failed"}
    }

    async wait_readystate() {
        await this.driver.wait((driver = this.driver) => {
            return driver.executeScript('return document.readyState').then(function(readyState) {
                console.log(readyState)
              return readyState === 'complete';
            });
          });
    }
    async WriteReport() {
        this.#end();
        if(process.env.HTML_REPORT.toLowerCase() !="true") return;
        var filePath = path.join(process.env.SCREENSHOT_PATH , this.session)
        await fsp.mkdir(filePath, { recursive: true }, (err) => {
            if (err) throw err;
          });

        //   for (let index = 0; index < this.report.length; index++) {
        //     const element = this.report[index];
            
        //   }
        let text = `
          <html>
        <style>
        #fullpage {
            display: none;
            position: absolute;
            z-index: 9999;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-size: contain;
            background-repeat: no-repeat no-repeat;
            background-position: center center;
            background-color: black;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px;

          }
          
          th, td {
            text-align: left;
            padding: 8px;
          }
          
          tr:nth-child(even) {background-color: #f2f2f2;}
        </style>
        <body>
        <table border='1'><thead>
        <tr><td>Desc</td><td>STATUS</td></tr>
        </thead>
        <tbody>
        <tr><td>StartTime</td><td>${this.startTime}</td></tr>
        <tr><td>EndTime</td><td>${this.endTime}</td></tr>
        <tr><td>Elapsed</td><td>${this.elapsed}</td></tr>
        <tr><td>Overall Status</td><td>${this.overallstatus}</td></tr>
        </tbody>
        </table>
        <br/>
        <h3>Step Wise Status</h3>
        <table border='1'><thead><tr><td>STEP</td><td>STATUS</td><td>ERROR</td><td>SCREENSHOT</td></tr></thead><tbody>`
        for (let x in this.report) {
            text += "<tr><td>" + this.report[x].step + "</td><td>" + this.report[x].status + "</td><td>" + this.report[x].error + "</td><td><img height='10' width='10' src='data:image/png;base64," + this.report[x].screenshot + "'/></td></tr>";
        }
        text += `</tbody><div id=\"fullpage\" onclick=\"this.style.display='none';\"></div></table>
        <script>
        const imgs = document.querySelectorAll('img');
        const fullPage = document.querySelector('#fullpage');

        imgs.forEach(img => {
        img.addEventListener('click', function() {
        fullPage.style.backgroundImage = 'url(' + img.src + ')';
        fullPage.style.display = 'block';
        });
        });
        </script>
        </html>
        `  
        var report_path = filePath + "\\report.html"
            await fsp.writeFile(report_path, text).catch(e => console.log(e))
    }
    //start time of an execution
    #start() {
        this.startTime = new Date();
      };
      
      // end time of execution
      #end() {
        this.endTime = new Date();
        var timeDiff = this.endTime - this.startTime; //in ms 
        // strip the ms 
        timeDiff /= 1000; 
        
        // get seconds 
        var seconds = Math.round(timeDiff);
        this.elapsed = seconds + " seconds";
      }

    
}


module.exports = {CoreModules}