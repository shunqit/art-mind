import express from "express"
import got from "got"

//const {v4: uuid} = require('uuid');

const apiKey = 'acc_5fcb72da9146b91';
const apiSecret = 'd75a290d89fdfb8880cac889c4409dfa';
//const autho='Basic YWNjXzVmY2I3MmRhOTE0NmI5MTpkNzVhMjkwZDg5ZmRmYjg4ODBjYWM4ODljNDQwOWRmYQ=='
const url = 'https://api.imagga.com/v2/tags?image_url=';

// create the app
const app = express();

// define the port where client files will be provided
const port = process.env.PORT || 3000;
// start to listen to that port
const server = app.listen(port);
console.log("server running on port 3000")

// Used to decode the API calls that come from our web page
app.use(express.json())

// provide static access to the files
// in the "public" folder
app.use(express.static('public'));

// create the API point so we can make a Imagga API call
// our API will be at <webpage_url>/api
app.post("/api", async (req, res) => {
    // Check if the web page sent us an image. If not we can send an error message back
    if (!req.body.image)
       return res.json({error: "There was no image"})

    // Get the image url from the page data
    const imageURL = req.body.image
    // combine the url and the image url
    const imaggaURL = `${url}${encodeURIComponent(imageURL)}`

    // send the api call to imagga.
    try {
        const data = await got(imaggaURL, {username: apiKey, password: apiSecret}).json()
        // send the data back to the webpage
        res.json(data)
    } catch (error) {
        // If there was an error with imagga we will end up here
        console.log(error)
        console.log(error.response.body)
        // send the error back to the webpage
        res.json({error: error.response.body})
    }
})



