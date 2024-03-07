
import puppeteer from 'puppeteer';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: "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" });



export async function GET(req: Request) {
  try {
    
    const url = new URL(req.url);
    const fullURL: any = url.searchParams.get("url");


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(decodeURIComponent(fullURL));

    const userNameEl = await page.$('div[data-testid="User-Name"]');
    const userName = await page.evaluate((el: HTMLElement | null) => (el ? el.innerText : '-'), userNameEl);

    const tweetTextEl = await page.$('div[data-testid="tweetText"]');
    const tweetText = await page.evaluate((el: HTMLElement | null) => (el ? el.innerText : '-'), tweetTextEl);

    const nextData = {
      userName: userName.split('\n')[0],
      userID: userName.split('\n')[1] ? userName.split('\n')[1].substring(1) : '-',
      tweetText: tweetText,
      postedOn: '-',
    };
    

    const page2 = await browser.newPage();
    await page2.goto(`https://twitter.com/${nextData.userID}`);


    const userDescEl = await page2.$('div[data-testid="UserDescription"]');
    const userDesc = await page2.evaluate(
        (el: HTMLElement | null) => el ? el.innerText : "-", userDescEl
    );
    const userProfEl = await page2.$('div[data-testid="UserProfessionalCategory"]');
    const userProf = await page2.evaluate(
        (el: HTMLElement | null) => el ? el.innerText : "-", userProfEl
    );

    

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

    const responseContent: any = completion.choices[0].message['content'];
    const scrapedData = JSON.parse(responseContent);
    const { commitment, description, deadline, min_pay, max_pay, is_remote, location } = scrapedData;


    await browser.close();

    return NextResponse.json({
        status: 200,
        commitment: commitment ? commitment : "-",
        description: description ? description : "-",
        deadline: deadline ? deadline : "-",
        min_pay: min_pay ? min_pay : "-",
        max_pay: max_pay ? max_pay : "-",
        is_remote: is_remote ? is_remote : true,
        location: location ? location : "-",
        userID: nextData.userID,
        tweetContent: tweetText,
        postedOn: "-",
        userName: nextData.userName,
        userDescription: userDesc,
        org: userProf
    });
  } 
  catch (error: any) {
    return NextResponse.json({
      status: 500,
      msg: error.message
    })
  }
}
