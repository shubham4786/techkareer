
import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import OpenAI from 'openai';

require('dotenv').config();

const openai = new OpenAI({ apiKey: "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" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userName, userID, tweetText, postedOn } = req.query;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `${tweetText}\n This is a tweet about a hiring or a gig or a hackathon or a startup program. Extract following details:
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
        
        // const userID = dataReceived.userID;
        const browser = await puppeteer.launch();
        const page2 = await browser.newPage();
        await page2.goto(`https://twitter.com/${userID}`);

        const userTitleEl = await page2.$('div[data-testid="UserName"]');
        const userTitle = await page2.evaluate(
            (el: HTMLElement | null) => el ? el.innerText : "-", userTitleEl
        );
        const userDescEl = await page2.$('div[data-testid="UserDescription"]');
        const userDesc = await page2.evaluate(
            (el: HTMLElement | null) => el ? el.innerText : null, userDescEl
        );
        const userProfEl = await page2.$('div[data-testid="UserProfessionalCategory"]');
        const userProf = await page2.evaluate(
            (el: HTMLElement | null) => el ? el.innerText : "-", userProfEl
        );

        const scrapedData = JSON.parse(responseContent);
        const { commitment, description, deadline, min_pay, max_pay, is_remote, location } = scrapedData;


        res.status(200).json({
            commitment: commitment ? commitment : "-",
            description: description ? description : "-",
            deadline: deadline ? deadline : "-",
            min_pay: min_pay ? min_pay : "-",
            max_pay: max_pay ? max_pay : "-",
            is_remote: is_remote ? is_remote : true,
            location: location ? location : "-",
            userID: userID,
            tweetContent: tweetText,
            postedOn: postedOn,
            userName: userName,
            userDescription: userDesc,
            org: userProf
        })

  } catch (error) {
    res.status(500).json({
      msg: 'An unexpected error occurred in the final step!',
      error: error,
    });
  }
}
