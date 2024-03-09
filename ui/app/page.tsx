'use client';

import { useEffect, useState } from 'react';
import add from './add';

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);

  useEffect(() => {
    setShowInfo(false);
  }, [searching])


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await add(encodeURIComponent(url));
    } 
    catch (error: any) {
      console.log('Some error occured in submission: ', error.message);            
      setInfo("Some error occured.Please try again.")
      setShowInfo(true);
      setSearching(false);
    }
    setInfo("Data added successfully")
    setShowInfo(true);
    setSearching(false);
  }




  return (
    <main className="flex flex-col justify-start items-center w-screen min-h-screen h-auto overflow-x-hidden overflow-y-auto">

      <div className="w-[80vw] ">
        <h1 className="mb-12 text-4xl sm:text-7xl text-center font-bold mt-12 sm:mt-20">Tweet Scraper</h1>
      </div>

      <div className="flex flex-col w-screen justify-center items-center mb-4 gap-2">
        <input
          type="text"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Tweet URL"
          className="mr-2 px-2 outline-none border-[1px] border-gray-500 rounded-[10px] w-[90vw] sm:w-[60vw] h-[6vh]"
        />
        <button
          type="submit"
          onClick={(e) => {
            setSearching(true);
            handleSubmit(e);
          }}
          className="bg-blue-300 hover:bg-blue-500 text-xl font-bold px-2 py-1 sm:px-4 rounded-[10px] border-[1px] border-gray-500 text-black text-center flex flex-row justify-center items-center active:bg-slate-400"
        >
          {searching ? "Fetching..." : "Fetch"}
        </button>
      </div>


      {
        showInfo && 
        <p>{info}</p>
      }

    </main>
    
  );
};

