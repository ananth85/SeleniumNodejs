const objects = require("../Pages/ObjectRepo.json")
const commonmodule = require("../CoreModules/modules")

async function test1() {

let browser = new commonmodule.CoreModules();

await browser.InitialiseDriver()
await browser.navigate(process.env.URL)
await browser.click(objects.Home.lnk_IamMovingHouseandNeedEnergy);
await browser.click(objects.MoveHouseNeedPowerPopup.btn_go_back);
await browser.WriteReport();
await browser.quit();
}

module.exports = {test1}