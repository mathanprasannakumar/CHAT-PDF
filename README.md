# CHAT-PDF
A chat-pdf application for interacting with pdf. User can upload pdf and ask questions related to the  uploaded documents.

<h3>DEMO : <a href="https://matensor.com/chatpdf"> CHAT-PDF</a></h3>

<h3>Video : <a href = ""> link </a> </h3>


<h3>Implementaion</h3>
<hr>
<p> Technologies used : vanilla js (logic) , express(server), nodejs(runtime) , langchain(connect with openai models) , html and css (ui) </p>
<p> With this implementation , you  can easily build a chatgpt like application for any docs or for an any organization</p>

<h3>Step 1 : Setting up the api keys and environment </h3>
<ul>
    <li>
       <p>For embedding the text and for the chat model Open AI model is used</p>
    </li>
    <li>
       <p> For accessing the open ai model through langchain we need to have open ai api key</p>
    </li>
    <li>  
      <p> Please visit open ai platform  <a href="https://platform.openai.com/">link</a> Make an 
       account and Create apikey and saved it </p>
    </li>
    <li>
       <p> Visit the Pinecone site and create api key , create an index </p>
    </li>
    <li>
       <p> Index is the storage where we can store the vectors an retrieve the vectors from it</p>
    </li>
    <li>
       <p> All the api keys and index information are initalized as a values for variables in 	
       inside the .env files </p>
    </li>
</ul>
<h3>Step 2 : Building the UI for file upload and chat box </h3>
<p> </p>
<p> </p>

<h3>Step 3 : Handling the uploaded pdf file </h3>

<ul>
    <li>
       <p> file is send to the server , which is then parsed by pdfparser for extracting the text 
       data from the binary data</p>
    </li>
    <li>
       <p> The text is then splittted into chunks of size : 1000 and overlap size : 100</p>
    </li>
    <li>
       <p> All the text is converted to vector embeddings by OpenAI Embeeding model and stored 	
       inside the index by using PineconeStore, this will return a vector store which can be used for manipulating the vector embeddings in the database for similarity search during the time of 
       query<p>
    </li>
</ul>

<h3> Step 4 : Handling the prompt </h3>

<ul>
    <li>
       <p>The messages sent through the chatbox is forward to the server</p>
    </li>
    <li>
       <p> Here , we need to consider the chat history and we need to setup openai model to generateresponse as per the externalknowledgebase that we just formed before</p>
    <li>
       <p> For the chat history , buffer memory from langchain is created where the last 5 message completion will be tracked</p>
    </li>
    <li>
       <p>For external knowledgebase , ConversationalRetrievalChain is created </p>
    </li>
    <li>
       <pre> 
             1) Here the input prompt is combined with the chat history to forma standalone question
             2) Then similiar records from the vector database related to the query is retrieved
             3) Model will receive the standalone question and having the retreived data for the knowledgebase , it will generate a relevent response
       </pre>
    </li>
</ul>

<h3> References </h3>
<ul> 
    <li> 
       <p>  Langchain documentation helped a lot , if you  dont understand the docs,ask the  chatbot in the documentation. As openAi chatgpt dont even know what is langchain.</p>
    </li>
    <li>
      <p> Youtube links -  All the implementation is done in python ,streamlit and typescript, i only took the idea from those videos </p>
      <p> <a href = "https://www.youtube.com/watch?v=RIWbalZ7sTo&t=2s"> Streamlit & python </a> </p>
      <p> <a href = "https://www.youtube.com/watch?v=RM-v7zoYQo0"> Chatgpt - typescript </a> </p>
      <p> <a href = "https://www.youtube.com/watch?v=dXxQ0LR-3Hg&t=3551s"> Streamlit & python</a> </p> 
    </li>
</ul>
    
       
