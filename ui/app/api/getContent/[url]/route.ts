import { JSDOM } from 'jsdom';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: "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" });



export async function GET(
  req: Request,
  { params }: {
    params: {
      url: any
    }
  }
) {
  try {
    
    // const { searchParams } = new URL(req.url);
    const fullURL: any = params.url

    console.log("Got URL");    

    const page1 = await fetch(decodeURIComponent(fullURL));
    console.log("step 1");    
    const html1 = await page1.text();
    console.log("step 2");    
    const dom1 = new JSDOM(html1);
    console.log("step 3");    
    const document1 = dom1.window.document;
    console.log("step 4");    
    
    const userName = document1.querySelector('[data-testid="User-Name"]')?.textContent;
    console.log("step 5");    
    const tweetText = document1.querySelector('[data-testid="tweetText"]')?.textContent;
    console.log("step 6");    
    
    const nextData = {
      userName: userName ? userName.split('\n')[0] : "-",
      userID: userName ? userName.split('\n')[1].substring(1) : "-",
      tweetText: tweetText,
      postedOn: '-',
    };
    
    console.log("step 7");    
    const page2 = await fetch(`https://twitter.com/${nextData.userID}`);
    const html2 = await page2.text();
    const dom2 = new JSDOM(html2);
    const document2 = dom2.window.document;
    
    const userDesc = document2.querySelector('[data-testid="UserDescription"]')?.textContent;
    const userProf = document2.querySelector('[data-testid="UserProfessionalCategory"]')?.textContent;
    
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


    return Response.json({
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
