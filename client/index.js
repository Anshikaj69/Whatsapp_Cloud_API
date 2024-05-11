// Sample data representing conversations
const conversations = [
    { name: "Jatin Patil", initial: "J", color: "indigo", phone: '917559118424' },
    { name: "Anshika Jaiswal", initial: "A", color: "#7099c1", phone: '917558312631' },
    { name: "Madhura Chavan", initial: "M", color: "orange", phone: '91' },
    { name: "Chanda jaiswal", initial: "C", color: "pink", phone: '919637163261' },
    { name: "Aditya Jaiswal", initial: "A", color: "purple", phone: '91' }
];

// Function to populate chat header based on clicked conversation
function populateChatHeader(conversation) {
    const headerInitial = document.getElementById("headerInitial");
    const headerName = document.getElementById("headerName");
    const headerPhone = document.getElementById("headerPhone");
    const messagesContainer = document.querySelector(".messages-container");

    messagesContainer.innerHTML = "";

    headerInitial.textContent = conversation.initial;
    headerInitial.style.backgroundColor = conversation.color
    headerName.textContent = conversation.name;
    headerPhone.textContent = conversation.phone;

    //fetch user Messages from backend 
    fetch(`http://localhost:5001/api/cloud/messages`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Update the chat window with the retrieved messages
            data.messages.forEach(message => {
                if (message.from === conversation.phone || message.to === conversation.phone) {
                    if (message.from === conversation.phone) {
                        updateChatWindow(message.message, "You", "left", message.type);
                    } else {
                        updateChatWindow(message.message, conversation.initial, "right", message.type);
                    }
                }
            });
        }).catch(error => {
            console.error("Error retrieving messages:", error);
        });
}

// Function to generate HTML for conversations
function generateConversations() {
    const container = document.getElementById("conversationsContainer");

    // Clear previous content
    container.innerHTML = "";

    // Iterating through conversations array
    conversations.forEach(conversation => {
        const button = document.createElement("button");
        button.className = "flex flex-row items-center hover:bg-gray-100 rounded-xl p-2";

        //click event
        button.addEventListener("click", () => {
            populateChatHeader(conversation);
        });

        const initialDiv = document.createElement("div");
        initialDiv.className = "flex items-center justify-center w-8 h-8 bg-" + conversation.color + "-200 rounded-full";
        initialDiv.textContent = conversation.initial;
        button.appendChild(initialDiv);

        const nameDiv = document.createElement("div");
        nameDiv.className = "ml-2 text-sm font-semibold";
        nameDiv.textContent = conversation.name;
        button.appendChild(nameDiv);

        container.appendChild(button);
    });
}

// Calling function to generate conversations initially
generateConversations();

// Connecting to the WebSocket server
const socket = io('http://localhost:5001');

socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

// listening and event handling
socket.on('newMessage', (msg) => {
    console.log('New message received:', msg);
    const headerPhone = document.getElementById("headerPhone");
    const headerInitial = document.getElementById("headerInitial");

    // Check if the message is for the current conversation
    if (msg.from === headerPhone.textContent) {
        updateChatWindow(msg.data.text, headerInitial, "left", "text");
    }
});

//handle sending Text Messages
document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.querySelector(".send-button");
    const messageInput = document.querySelector(".message-input");
    const contactNumber = document.getElementById("headerPhone");
    const messagesContainer = document.querySelector(".messages-container");

    sendButton.addEventListener("click", function (event) {
        event.preventDefault();
        const message = messageInput.value;

        if (message) {
            console.log(message, contactNumber.innerText)

            // Display the typed message instantly in the message container
            updateChatWindow(message, "A", "right", "text");

            // Call a function to send the message to the backend
            sendMessageToBackend(message, contactNumber);

            messageInput.value = "";

            function sendMessageToBackend(message, contactNumber) {
                fetch("http://localhost:5001/api/cloud/send-text", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        to: contactNumber.innerText,
                        message: message
                    })
                })
                    .then(response => response.json())
                    .catch(error => {
                        console.error("Error sending message:", error);
                    });
            }
        }

        // Check if a file is selected
        if (selectedFile) {
            const File = selectedFile;

            // Call handleFileUpload if a file is selected
            handleFileUpload(Type, File)
                .then(response => {
                    // Display uploaded file in chat window
                    const message = document.createElement('div');
                    message.classList.add('message-bubble', 'right');
                    message.textContent = response.message;
                    messagesContainer.appendChild(message);
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                });
        } else {
            // If no file is selected, simply send the text message to the backend
            console.log("file not selected");
        }
    });


})


// Toggle attachment options visibility
function toggleAttachmentOptions() {
    const attachmentOptions = document.getElementById("attachmentOptions");
    attachmentOptions.style.display = attachmentOptions.style.display === "none" ? "flex" : "none";
}

function showInput(type) {
    // Hide attachment options
    const attachmentOptions = document.getElementById("attachmentOptions");
    attachmentOptions.style.display = "none";

    // Show the corresponding file input field
    const fileInput = document.getElementById(type + "Input");
    fileInput.style.display = "block";
}

let selectedFile = null;

//check if file is selected 
function handleFileInputChange(type) {
    const fileInput = document.getElementById(type + 'Input');
    console.log(fileInput);
    const files = fileInput.files;
    console.log(files[0]); // Check if files are correctly retrieved

    // Store the selected file in the global variable
    selectedFile = files[0];
    console.log(selectedFile);
}

//send upload request to backend on the basis of file type
async function handleFileUpload(type, file) {
    const formData = new FormData();
    formData.append('file', file);
    const headerPhone = document.getElementById('headerPhone');
    formData.append('to', headerPhone.textContent)

    return fetch(`http://localhost:5001/api/cloud/send-${type}`, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            console.log(JSON.stringify(response));
            return response.json();
        })
        .catch(error => {
            console.error('Error during file upload:', error);
            throw error;
        });
}


//update chats window 
function updateChatWindow(message, initial, direction, mediaType) {
    const messagesContainer = document.querySelector(".messages-container");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message-element");

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message-bubble", "ml-3", "text-md", "bg-white", "py-3", "px-5", "shadow", "rounded-xl");

    let mediaElement;
    if (mediaType == 'image') {
        mediaElement = document.createElement("img");
        mediaElement.src = message;
        mediaElement.classList.add("w-64", "h-64")
    } else if (mediaType === 'audio') {
        mediaElement = document.createElement("audio");
        mediaElement.src = message;
        mediaElement.controls = true;
    } else if (mediaType === 'video') {
        mediaElement = document.createElement("video");
        mediaElement.src = message;
        mediaElement.classList.add("w-64", "h-52")
        mediaElement.controls = true; 
    } else if (mediaType === 'document') {
        mediaElement = document.createElement("a");
        mediaElement.href = message;
        mediaElement.target = "_blank"; 
        mediaElement.textContent = "Download Document";
    } else {
        messageBubble.innerText = message;
    }

    // Set the message alignment based on the direction parameter
    if (direction === "right") {
        messageElement.classList.add("justify-end");
        messageBubble.classList.add("bg-blue-100", "right", "right-0", "mb-3");
    } else {
        messageElement.classList.add("justify-start");
        messageBubble.classList.add("bg-white", "left", "left-0", "mb-3");
    }

    messageElement.appendChild(messageBubble);

    if (mediaElement) {
        messageBubble.appendChild(mediaElement);
    }
    
    messagesContainer.appendChild(messageElement);

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
