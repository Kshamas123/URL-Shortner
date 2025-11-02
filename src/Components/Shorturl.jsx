import React, { useState } from 'react';
import './Shorturl.css';
import axios from 'axios';


const Shorturl = () => {
  const [urllink, seturllink] = useState('');
  const [final_short_link,setfinal_short_link]=useState('')
  async function handlesubmit()
  {
    try
    {
    const response=await axios.post('http://localhost:3000/shorten-url',{
      urllink:urllink})
    const data=response.data.shortlink
    const temp = `http://localhost:3000/final_link/${data}`;
    setfinal_short_link(temp);
    }
    catch(error)
    {
      console.log(error)
    }
  }
  return (
    <div className="shorturl-wrapper">
      <div className="glitch-input-wrapper">
        <div className="input-container">
          <input
            type="text"
            id="holo-input"
            className="holo-input"
            placeholder=""
            value={urllink}
            onChange={(e) => seturllink(e.target.value)}  
            required
          />
          <label
            htmlFor="holo-input"
            className="input-label"
            data-text="Enter the URL"
          >
            Enter the URL
          </label>

          <div className="input-border"></div>
          <div className="input-scanline"></div>
          <div className="input-glow"></div>
        </div>
      </div>

      
      <div className="button-container">
        <button type="submit" className="unique-blue-button" onClick={handlesubmit}>
          Submit
        </button>
      </div>


      {final_short_link && {urllink} && <a href={final_short_link}>{final_short_link}</a>}

    </div>
  );
};

export default Shorturl;

