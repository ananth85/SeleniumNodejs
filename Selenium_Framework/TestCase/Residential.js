const objects = require("../Pages/ObjectRepo.json")
const commonmodule = require("../CoreModules/modules")

async function Check_All_residential_link() {

let browser = new commonmodule.CoreModules();

await browser.InitialiseDriver()
await browser.navigate(process.env.URL)
await browser.click(objects.Home.lnk_Residential);
await browser.click(objects.Home.lnk_Electricity_and_Gas);
await browser.Type(objects.Residential_Electricity_Gas.txt_post_code,"2150");
await browser.click(objects.Home.logo_alinta_energy);
await browser.WriteReport();
await browser.quit();

}
Check_All_residential_link();
module.exports = {Check_All_residential_link}