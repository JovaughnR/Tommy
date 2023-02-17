const msgIcon = document.querySelector("#message-icon");
const exit = document.querySelector(".exit");
const maximize = document.querySelector(".max");
const minimize = document.querySelector(".min");
let text_box = document.querySelector('.container');
const ai_background = document.querySelector('.ai-background');
const max_img = document.querySelector('#max');
const min_img = document.querySelector('#min');
const messageSection = document.querySelector('.chat-input');
const title = document.querySelector('.title');
const h6 = document.querySelector('.h6');
let checkbox = document.querySelector('.check');
let statusOn = document.querySelector('.status-ON');
let statusOff = document.querySelector('.status-OFF');
let sendButton = document.querySelector('#send-btn');
let textInput = document.querySelector('#txtInput');
let settingsArea = document.querySelector('.settings-area');
let settingIcon = document.querySelector('#options');
let settingBody = document.querySelector('#settings');
let videoConatainer = document.querySelector('.video-container');
let cam = document.querySelector('#camera');


cam.addEventListener('click', (e) => {
    if (document.querySelector('#send-video').style.display === "none") {
        document.querySelector('#send-video').style.display = "flex";
    }
    if (document.querySelector('#close-video').style.display === "none") {
        document.querySelector('#close-video').style.display = "flex";
    }
})

settingIcon.addEventListener('click', (e) => {
    if (settingBody.style.display === "none") {
        settingBody.style.display = "block";
    }
    else {
        settingBody.style.display = "none";
    }
});

window.addEventListener('click', (e) => {
    settingsArea.style.display = textInput.value == "" ? "flex" : "none";
})

sendButton.addEventListener('click', (e) => {
    settingsArea.style.display = "flex";
    sendButton.style.display = "none";
})

textInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        settingsArea.style.display = "flex";
        sendButton.style.display = "none";
    }
    else {
        settingsArea.style.display = "none";
        sendButton.style.display = "block";
    }
})

checkbox.addEventListener('click', (e) => {
    if (statusOn.style.display === 'none') {
        statusOn.style.display = 'block';
        statusOff.style.display = 'none';
    }
    else if (statusOff.style.display === 'none') {
        statusOn.style.display = 'none';
        statusOff.style.display = 'block';
    }
});

msgIcon.addEventListener('click', (e) => {
    console.log(min_img.style.display = "none");
    min_img.style.display = "none";
})


msgIcon.addEventListener('click',(e) => {
    
    msgIcon.style.display = "none";
    minimize.style.background = "rgba(255, 255, 255, 0.815)";
    if(text_box.style.display === "block") { 
        text_box.style.display = "none";
        ai_background.style.display = "none";
    }
    else {
        text_box.style.display = "block";
        ai_background.style.display = "flex";
    }
});


exit.addEventListener('click', (e) => {
    text_box.style.display = "none";
    msgIcon.style.display = "block";
    ai_background.style.display = "none";
});


maximize.addEventListener('click', (e) => {
    scrolling = text_box.scrollHeight;
    scrolling = 0;
    text_box.style.width = '30vw';
    text_box.style.height = '600px' 
    ai_background.style.width = "30vw";
    ai_background.style.height = "600px";
    ai_background.style.transition = "0.5s";
    text_box.style.transition = "0.7s";
    minimize.style.background = "rgb(250, 199, 33)";
    maximize.style.background = "rgba(255, 255, 255, 0.815)";
    maximize.style.cursor = "auto";
    max_img.style.display = "none";
    max_img.style.display = "auto";
    min_img.style.display = "block";
    minimize.style.cursor = "pointer";
});


minimize.addEventListener('click', (e) => {

    if(text_box.style.width > '24vw') {
        text_box.style.transition = "0.7s";
        text_box.style.height = '580px';
        text_box.style.width = '24vw';
        ai_background.style.width = "24vw";
        ai_background.style.transition = "0.5s";
        ai_background.style.height = "580px";
        maximize.style.background = "rgb(45, 194, 8)";
        maximize.style.cursor = "pointer";
        minimize.style.background = "rgb(236, 215, 187)";
        max_img.style.display = "block";
        min_img.style.display = "none";
    }
    if (text_box.style.width === '24vw')
    {
        maximize.style.display = "flex";
        minimize.style.background = "rgba(255, 255, 255, 0.815)";
        minimize.style.cursor = "auto";
    }
});