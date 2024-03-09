import OpenAI from 'openai';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import path from 'path'

const openai = new OpenAI({ apiKey: process.env.API_KEY });



export async function GET(req: Request) {
  try {
    
    const link = new URL(req.url);
    const fullURL: any = link.searchParams.get("url")

    console.log("Got URL");    
    const mainURL = decodeURIComponent(fullURL);
    console.log(mainURL);


    const chromePath = path.resolve(__dirname, '../../../../../chrome/linux-124.0.6343.0/chrome-linux64/chrome');

    console.log(chromePath);
    
    const browser = await puppeteer.launch({
      // executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(mainURL);
    const data = await page.title();

    const regex = /on X:(.*?)(?=\/ X)/;

    const match = data.match(regex);
    const tweetContent = match ? match[1].trim() : "-";
    
    const regex2 = /^(.*?)(?=\s*on X:)/;
    const match2 = data.match(regex2);
    const userName = match2 ? match2[1].trim() : "-";
    
    const urlRegex = /https:\/\/([^.]+)\.com\/([^\/]+)\/status/;
    const match3 = mainURL.match(urlRegex);
    const userID = match3 ? match3[2] : "-";
    
    
    const nextData = {
        userName: userName,
        userID: userID,
        tweetText: tweetContent,
        postedOn: "-"
    }
    if(nextData.tweetText == "-"){
        throw new Error("Puppeteer did not work.");
    }

    await browser.close();

    console.log(nextData);

    const browser2 = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page2 = await browser2.newPage();
    await page2.goto(`https://twitter.com/${nextData.userID}`);

    const page2Content = await page2.content();
    const $ = cheerio.load(page2Content);
    const userDescriptionDiv = $('div[data-testid="UserDescription"]');
    const userDesc = userDescriptionDiv.text();
    const userProfSpan = $('span[data-testid="UserProfessionalCategory"]');
    const userProf = userProfSpan.text();

    console.log(userDesc);
    console.log(userProf);
    

    await browser2.close();
    
    
    console.log("Scraped tweet data.");
    

    

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `${nextData.tweetText}\n This is a tweet about a hiring or a gig or a hackathon or a startup program. Extract following details:
            1. commitment(full-time, part-time, freelance),
            2. description,
            3. location,
            4. deadline,
            5. min_pay,
            6. max_pay,
            7. is_remote 
            The fields which are not specified in the tweet will have - as the value. Return a JSON with only the specified fields and their values.`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    console.log("Got OpenAI API response");
    

    const responseContent: any = completion.choices[0].message['content'];
    const scrapedData = JSON.parse(responseContent);
    const { commitment, description, deadline, min_pay, max_pay, is_remote, location } = scrapedData;

    console.log(scrapedData); 


    return Response.json({
        commitment: commitment ? commitment : "-",
        description: description ? description : "-",
        deadline: deadline ? deadline : "-",
        min_pay: min_pay ? min_pay : "-",
        max_pay: max_pay ? max_pay : "-",
        is_remote: is_remote ? is_remote : true,
        location: location ? location : "-",
        userID: nextData.userID,
        tweetContent: nextData.tweetText,
        postedOn: "-",
        userName: nextData.userName,
        userDescription: userDesc,
        org: userProf
      }, {
      status: 200
    });
  } 
  catch (error: any) {
    return Response.json({
      msg: error.message
    }, {
      status: 500
    })
  }
}
