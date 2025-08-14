// const puppeteer = require("puppeteer");

// (async () => {
//     // Base URL for your image sequence
//     const baseUrl = "https://epaperstatic.gujaratsamachar.com/epaper/20250811-6898f2012f70094150644-11082025_RAJ-";

//     // Generate links dynamically from 0 to 16
//     const imageUrls = [];
//     for (let i = 0; i < 16; i++) {
//         imageUrls.push(`${baseUrl}${i}.jpg`);
//     }

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Build the HTML content with images
//     let htmlContent = `
//     <html>
//     <body style="margin: 0; padding: 0;">
//     <style>
//         @page {
//             margin: 0;
//         }
//         body {
//             margin: 0;
//             padding: 0;
//         }
//         img {
//             display: block;
//             margin: 0;
//             width: 100%;
//             height: 100vh; /* Ensure each image perfectly fills the page */
//             page-break-after: always;
//         }
//         img:last-child {
//             page-break-after: auto; /* Avoid a blank page after the last image */
//         }
//     </style>
//     `;

//     for (const url of imageUrls) {
//         htmlContent += `<img src="${url}" alt="Image" />`;
//     }

//     htmlContent += `
//     </body>
//     </html>`;

//     // Set the page content
//     await page.setContent(htmlContent, { waitUntil: "load" });
    
//     const date = new Date();

//     const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month (months are zero-indexed)
//     const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

//     const formattedDate = `${day}-${month}-${year}`;

//     // Convert the page to PDF
//     await page.pdf({
//         path: `Gujrat_${formattedDate}.pdf`, // Output file name
//         format: "A4",      // Paper format
//         printBackground: true,
//         preferCSSPageSize: true, // Use the defined page size in CSS

//     await browser.close();
//     console.log("PDF created successfully at 'output.pdf'!");
// })();

// before page 4 
const express = require("express");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core"); 
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { log } = require("util");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://newspaper-alpha-one.vercel.app",
})); // Allow frontend to connect

app.post("/generate-pdf", async (req, res) => {
    const { baseUrl, totalPages, page4Url } = req.body;

    console.log("p4",page4Url);

    if (!baseUrl || !totalPages) {
        return res.status(400).json({ error: "baseUrl and totalPages are required" });
    }

    try {
        // Generate all image URLs
        const imageUrls = [];
        for (let i = 0; i < totalPages; i++) {
            if( i == 3){
                imageUrls.push(page4Url); // Use the provided page 4 URL
                continue;
            }
            imageUrls.push(`${baseUrl}${i}.jpg`);
        }

        console.log("Image URLs:", imageUrls);

        // const browser = await puppeteer.launch({
        //     headless: "new",
        //     args: ["--no-sandbox", "--disable-setuid-sandbox"]
        // });
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        let htmlContent = `
        <html>
        <body style="margin:0;padding:0;">
        <style>
            @page { margin: 0; }
            body { margin:0; padding:0; }
            img {
                display: block;
                margin: 0;
                width: 100%;
                height: 100vh;
                page-break-after: always;
            }
            img:last-child { page-break-after: auto; }
        </style>
        `;

        for (const url of imageUrls) {
            htmlContent += `<img src="${url}" alt="Image" />`;
            console.log(`Processing image: ${url}`);
            
        }
        htmlContent += `</body></html>`;

        await page.setContent(htmlContent, { waitUntil: "load" });

        const date = new Date();
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;
        const fileName = `Gujrat_${formattedDate}.pdf`;
        const filePath = path.join(__dirname, fileName);

        await page.pdf({
            path: filePath,
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
        });

        await browser.close();

        // Send PDF file to frontend
        res.download(filePath, fileName, (err) => {
            if (err) console.error(err);
            fs.unlinkSync(filePath); // Delete file after sending
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "PDF generation failed" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
    res.send("Welcome to the PDF Generator API");
});


// after page 4 is added
