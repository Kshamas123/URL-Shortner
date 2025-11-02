const express = require('express')
const cors = require('cors')
const { randomBytes } = require('crypto');
const db = require('./db')
const url_model = require('./models/urlschema')
const app = express()
const port = 3000
app.use(cors());
app.use(express.json())

db()
app.post('/shorten-url', async (req, res) => {
    try {
        const urlink = req.body.urllink
        if(urlink==null ||urlink=="" || urlink==" ")
            return res.status(400).json({
"error": "Invalid input data",
"details": "The 'email' field is missing."
})
        const existing = await url_model.findOne({ long_url: urlink });
     console.log(existing)
        if (existing) {
            console.log("URL already exists");
            return res.json({ shortlink: existing.short_link });
        }
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+=-';
        const shortlink = Array.from(randomBytes(10)).map(b => chars[b % chars.length]).join('');
        console.log(shortlink)
        const r = await url_model.create({
            long_url: urlink,
            short_link: shortlink
        })
        console.log(r)
        return res.json({ shortlink:shortlink })
    }
    catch (err) {
        console.log(err)
        return res.json({ errormessage: err })
    }
})

app.get('/final_link/:shortlink',async (req, res) => {
    const s_link=req.params.shortlink
    const r=await url_model.findOne({ short_link: s_link });
    res.redirect(r.long_url)
})

app.listen(port, () => {
    console.log(`server started at port ${port}`)
})