const {GoogleGenerativeAI} = require("@google/generative-ai");


const dotenv = require('dotenv')
const express = require('express')
const fs = require('fs')
const multer = require('multer')
const path = require('path');
const { MIMEType } = require("util");
const port = 3000


dotenv.config();
const app = express();
app.use(express.json());


const genAI = new GoogleGenerativeAI(process.env.api_key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const upload = multer({ dest: 'uploads/' });

  

app.post("/generate-text", async (req, res) => {
    const {prompt} = req.body;    
    try{
        
        let result = await model.generateContent(prompt)
        let response = result.response
        // console.log(response.text())
        res.status(200).json({output: response.text() })
    }catch(error){
        // console.log(error)
        res.status(500).json({error: error.message}) 
    } 
})

const imageGeneratePart = (filePath) => ({
    inlineData: {
        data: fs.readFileSync(filePath).toString("base64"),
        mimetype: 'image/png'

    }
})

app.post("/generate-from-image",upload.single('image'), async (req, res) => {
    const prompt = req.body.prompt || 'describe the picture';
    const image = imageGeneratePart(req.file.path);
    
     try{
        
        let result = await model.generateContent([prompt, image])
        let response = result.response
        // console.log(response.text())
        res.status(200).json({output: response.text() })
    }catch(error){
        // console.log(error)
        res.status(500).json({error: error.message}) 
    } finally {
        fs.unlinkSync(req.file.path)
    }
})

app.post("/generate-from-document",upload.single('document'), async (req, res) => {
    const prompt = req.body.prompt || 'analyze the document';
    const path = req.file.path;
    const buffer = fs.readFileSync(path);
    const base64 = buffer.toString('base64');
    const mimetype = req.file.mimetype

    try{
        // const documentPart = {
        //     inlineData: {
        //         data: base64, mimetype
        //     }
        // }     
        const documentPart = imageGeneratePart(req.file.path, mimeType)
        let result = await model.generateContent([prompt, documentPart])
        let response = result.response
        // console.log(response.text())
        res.status(200).json({output: response.text() })
    }catch(error){
        // console.log(error)
        res.status(500).json({message: error.message}) 
    } finally {
        fs.unlinkSync(req.file.path)
    }
 })

app.post("/generate-from-audio",upload.single('audio'), async (req, res) => {
    const prompt = req.body.prompt || 'analyze the audio for describe';
    const path = req.file.path;
    const buffer = fs.readFileSync(path);
    const base64 = buffer.toString('base64');
    const mimetype = req.file.mimetype

    try{
        // const documentPart = {
        //     inlineData: {
        //         data: base64, mimetype
        //     }
        // }     
        const audioPart = imageGeneratePart(req.file.path, mimeType)
        let result = await model.generateContent([prompt, documentPart])
        let response = result.response
        // console.log(response.text())
        res.status(200).json({output: response.text() })
    }catch(error){
        // console.log(error)
        res.status(500).json({message: error.message}) 
    } finally {
        fs.unlinkSync(req.file.path)
    }
 })




app.listen(port, () =>{
    console.log(`this gemini api running on localhost    ${port}`);
})

