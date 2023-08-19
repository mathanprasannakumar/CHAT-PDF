import express from "express"
import path from "path"
import fileUpload from "express-fileupload";
import PdfParse from "pdf-parse";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'; 
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from "langchain/memory";
import { ConversationalRetrievalQAChain } from 'langchain/chains';

import dotenv from "dotenv";


// configuring all the variables in the dotenv file to the environment
dotenv.config()

const app = express();
const port = process.env.PORT || 5000

// boilerplate
app.set("view engine","ejs")
app.set("views",path.join(path.resolve(),'views'))
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(fileUpload())
app.use(express.static(path.resolve()))

// embedding model
const embeddings = new OpenAIEmbeddings();

// pincone obj for connecting to the pinecone API
const pinecone = new PineconeClient();

let vectorstore
let chain


await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT ?? '', //this is in the dashboard
    apiKey: process.env.PINECONE_API_KEY ?? '',
  });

// connecting to the index 
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);


// every new session or every refresh  all the vectors in the index will be removed
async function delete_vec()
{
    await index.delete1({
        deleteAll:true,
        namespace:"chatpdf",
    })
}


// home page 
app.get("/",(req,res)=>{    

    delete_vec()
    res.render("home")
})


// when the user uploaded pdf
app.post('/pdfupload',(req,res)=>{

    if(req.files)
    {
        // pdf will be in buffer binary format ,so need to convert to text
        PdfParse(req.files.pdf)
            .then(async (content)=>{
                // splitting the text into suitable chunk size as required by the model
                const textSplitter = new RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 200,
                  });
                const text = content.text

                const docs = await textSplitter.createDocuments([text]);

                // creating a vector store for handling the document/records in the index
                const vs = await PineconeStore.fromDocuments(docs,embeddings,{
                    pineconeIndex: index,
                    namespace:"chatpdf",
                    textKey:"text"
                })
                vectorstore=vs
                console.log("Successfully stored the embedding inside the vector store")
                res.json({result : "Sucessfully stored the embedding inside vector store"})
            })
            .catch((error)=>{
                res.send(error)
            })
    }
    else
    {
        res.send("Upload file not found")
    }
})

// creating a chain for retrieval augmentation with buffer memory
function preparechain()
{
    // chat model
    const chatmodel = new ChatOpenAI({
        temperature: 0, 
        modelName: 'gpt-3.5-turbo', 
      });
    
    // buffer memory will track last 5 message completion
    const windowmemory = new BufferMemory({
        maxMessages:5,
        memoryKey:"chat_history",
        inputKey:"question",
        outputKey:"text",
        returnMessages:true,
    })

    // forming retrieval chain
    let chain = ConversationalRetrievalQAChain.fromLLM(
        chatmodel,
        vectorstore.asRetriever(),
        {
            memory:windowmemory,
        })
    return chain
}

// when the user enters prompt
app.post('/query',async (req,res)=>{

    console.log("entered query")
    const {message} = req.body
    console.log(message)
    if(chain === undefined)
    {
        chain = preparechain()
    }

    // req : entered prompt is passed to the chain 
    // 1) current prompt and history are combined to a standalone question
    // 2) relevent records are retrieved from the vector store as per the gn standalone question
    // 3) response is generated for the standalone question based on the retrived records from the vector store as knowledge base
    const response = await chain.call({question :message})

    // sending the response back to the client 
    res.json({answer:response.text})

})




app.listen(port,()=>{
    console.log("Application is running in the port 5000")
})
