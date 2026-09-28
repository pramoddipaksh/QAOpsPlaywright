const ExcelJs = require('exceljs'); // exceljs = built-in 
import { test, expect } from '@playwright/test';

async function writeExcelTest(searchText, replaceText, change, filePath) {    // 4th parameter if price of mango change to 350
    // async function writeExcelTest(searchText, replaceText, filePath) {  // for 3 parameters 

    const workbook = new ExcelJs.Workbook();
    //await workbook.xlsx.readFile("/Users/Namita/Downloads/exceldownloadTest.xlsx"); // read excel file
    await workbook.xlsx.readFile(filePath); // read excel file
    const worksheet = workbook.getWorksheet('Sheet1'); // get first sheet of excel file

    const output = await readExcel(worksheet, searchText); // this calls function 'readExcel' by passing 'worksheet'

    //const cell = worksheet.getCell(3,2); // get cell value of row 3 and column 2
    //const cell = worksheet.getCell(output.row, output.column); // points row & column
    const cell = worksheet.getCell(output.row, output.column + change.colChange); // here to update price incremented col value+2; instead of hard-coded values as above line, done dynamic values by using "output" object created above
    //cell.value = "Republic"; // update cell value of row 3 and column 2
    cell.value = replaceText;
    //await workbook.xlsx.writeFile("/Users/Namita/Downloads/exceldownloadTest.xlsx"); // write updated value to excel file
    await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {
    let output = { row: -1, column: -1 }; // object 'output' created to hold dynamic values for row and column instead passing hard-coded values
    worksheet.eachRow((row, rowNumber) =>         // iterate through each row of excel sheet
    {
        row.eachCell((cell, colNumber) =>     // iterate through each cell of row
        {
            // console.log(cell.value); // print cell value
            // if(cell.value === "Banana")
            if (cell.value === searchText) // check if cell value is equal to TestCaseName
            {
                //console.log(rowNumber); // print row number of the cell which has value = Apple
                //console.log(colNumber); // print column number of the cell which has value = Apple
                output.row = rowNumber; // store row number of the cell which has value = Apple
                output.column = colNumber; // store column number of the cell which has value = Apple
            }
        })
    })
    return output;
}
// update mango price to 350
// writeExcelTest("Mango", 350, {rowChange:0,colChange:2}, "/Users/Namita/Downloads/exceldownloadTest.xlsx"); // to change price of Mango to 350; 4th parameter price column of mango which is after 2 columns
//writeExcelTest("Mango", "Republic", "/Users/Namita/Downloads/exceldownloadTest.xlsx"); // to change Mango to Republic; 3-parameters

test('Upload download excel validation', async ({ page }) => {
    const textSearch = 'Mango';
    const updateValue = '350';

    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    const downloadPromise = page.waitForEvent('download'); // waits for downloading excel file completes
    await page.getByRole("button", { name: 'Download' }).click(); // clicks on 'Download' button & file downloads
    const download = await downloadPromise; // wait for download to complete

    const downloadPath = "C:/Users/Namita/Downloads/download.xlsx";
    await download.saveAs(downloadPath); // save it to a known, guaranteed location

    await writeExcelTest("Mango", 350, { rowChange: 0, colChange: 2 }, downloadPath); //now safe to read/edit — awaited; to change price of Mango to 350; 4th parameter price column of mango which is after 2 columns 

    // upload file
    await page.locator("#fileinput").click(); // clicks on 'choose file' or 'upload' button
    await page.locator("#fileinput").setInputFiles(downloadPath); // setInputFiles() works only when elemets attribute type="file", this method upload file 
    //Assertions
    const textlocator = page.getByText(textSearch);
    const desireRow = await page.getByRole('row').filter({ has: textlocator });
    await expect(desireRow.locator("#cell-4-undefined")).toContainText(updateValue);





});