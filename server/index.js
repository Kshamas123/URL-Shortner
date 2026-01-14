const express = require('express')
const cors = require('cors')
const { randomBytes } = require('crypto');
const db = require('./db')
const url_model = require('./models/urlschema')
const axios = require('axios');
const app = express()
const port = 3000
app.use(cors());
app.use(express.json())

db()

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

app.post('/shorten-url', async (req, res) => {
    try {
        
        const urlink = req.body.urllink
        console.log(urlink)
        if(urlink==null ||urlink=="" || urlink==" ")
            return res.status(400).json({
"error": "Invalid input data",
"details": "The 'email' field is missing."
})
// const pattern =
//   /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

  if(isValidUrl(urlink))
  {
        const existing = await url_model.findOne({ long_url: urlink });
        if (existing) {
            console.log("URL already exists");
            return res.json({ shortlink: existing.short_link });
        }
    
  
    let reachable = false;

try {
    const response = await axios.get(urlink, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true
    });
   console.log(response)
    if (response.status < 500) {
        reachable = true;
    }
    else
    {
        return res.json({shortlink: "URL does not exist" });
    }
} catch (err) {
    reachable = false;
}

if (!reachable) {
    return res.json({ shortlink: "URL does not exist or is unreachable" });
}
else
    {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const shortlink = Array.from(randomBytes(10)).map(b => chars[b % chars.length]).join('');
        console.log(shortlink)
        const r = await url_model.create({
            long_url: urlink,
            short_link: shortlink
        })
        console.log(r)
        return res.json({ shortlink:shortlink })
    }
  }
else
{
    return res.json({ shortlink: "not valid url" })
}

    }
    catch (err) {
        console.log(err)
        return res.json({ errormessage: err })
    }
})

app.get('/final_link/:shortlink', async (req, res) => {
    const s_link = req.params.shortlink;
    const r = await url_model.findOne({ short_link: s_link });
     console.log(r.long_url)
    if (!r) {
        return res.status(404).json({ message: "Short URL not found" });
    }

    res.redirect(r.long_url);
});

app.listen(port, () => {
    console.log(`server started at port ${port}`)
})