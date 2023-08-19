const form = document.getElementById("fileform")

const pdf = document.getElementById("pdffile")
const pdfsubmit = document.getElementById("pdfsubmit")
const loaderwrapper = document.getElementById("loaderwrapper")
const loader = document.getElementById("loader")

const chatcontainer = document.getElementById("chatcontainer")
const messagebox = document.getElementById("messagebox")
const message = document.getElementById("message")


const promptform = document.getElementById("promptform")
const prompt = document.getElementById("prompt")
const promptsubmit = document.getElementById("promptsubmit")

const hu_imgpath = '../assets/usericon.png'
const ai_imgpath = '../assets/bot.jpeg'



// when the file form is submitted this event is triggered
form.addEventListener('submit',async (e)=>{

    // for preventing the default behaviour of the form 
    e.preventDefault()

    
    if(pdf.files[0]!==undefined)
    {
        // displaying the loading animation
        loaderwrapper.style.display='block'

        // get the submitted file
        const pdfdata = pdf.files[0]

        // send the subbmitted file through form object
        let formobj = new FormData()
        formobj.append("pdf",pdfdata)

        let xhr = new XMLHttpRequest()

        xhr.open('POST','/pdfupload',true)

        xhr.onreadystatechange = ()=>{
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {

                    // Ater the text is extracted and stored in vector database 
                    // stop the loading animation
                    loaderwrapper.style.display='none'
                    // display the chat box
                    chatcontainer.style.display='block';
                    // server will send res in json format
                    console.log(JSON.parse(xhr.responseText).result); // This line prints "hello" from the server
                } else {
                    console.log("File upload request to the server is unsuccessful");
                }
            }
        }
        xhr.send(formobj)

    }
    else
    {
        window.alert("Please upload the file")
    }
    
})


/// chat message formation in the chat box
function createchatmessage(promptvalue,imgpath)
{
    const messdiv = document.createElement('div');
    messdiv.classList.add('message')

    const img = document.createElement('img')
    img.src=imgpath

    const typedmess = document.createElement('span')
    typedmess.textContent=promptvalue

    messdiv.appendChild(img)
    messdiv.appendChild(typedmess)

    return messdiv
}


// when a prompt is entered through the chat box this event will be triggered.
promptform.addEventListener('submit',(e)=>{
    e.preventDefault()
    // display the loader animation
    loader.style.display="block";

    // displaying the entered prompt in the chatbox
    const newmessage = createchatmessage(prompt.value,hu_imgpath)  
    messagebox.appendChild(newmessage);


    const data = {message : prompt.value}
    prompt.value="";
    const xhr = new XMLHttpRequest();

    xhr.open('POST','/query',true)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = ()=>{
      if(xhr.readyState === XMLHttpRequest.DONE){
        if(xhr.status=== 200){
  
          let result = JSON.parse(xhr.responseText).answer
          // after sending the prompt to the server , server will return  
          // a response by passing the prompt to the chatmodel

          // displaying the response from the server
          loader.style.display="none"
          const newmessage = createchatmessage(result,ai_imgpath)  
          messagebox.appendChild(newmessage);

        }
        else
        {
          console.error('Request failed with status:'+xhr.status)
        }
      }
    };
    xhr.send(JSON.stringify(data))

})
