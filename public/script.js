const send = document.querySelector('#send-btn');
const messageInput = document.querySelector('#txtInput');
const chatbody = document.querySelector('.chat-body');
let loading = document.querySelector("#loading");
let camera = document.querySelector('#camera');
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let video = document.querySelector("#video");
let videoContainer = document.querySelector('.video-container');

let count = 0;
let pic_count = 0;
let counter = 0;
let SendPicActive = false;
let areas = [];
let scrolling = chatbody.scrollHeight;
let weekday = new Date();
let CamActive = camera.style.display == "none"? false : true;

let DateObj = {
    day : new Date().toLocaleString('en-us', {  weekday: 'long' }), 
    date : new Date().toDateString(),
    time : getTime(),
    today : new Date().toLocaleString('en-us', {  weekday: 'long' }), 
    month : new Date().toLocaleString('default', { month: 'long' }),
    year : new Date().toLocaleDateString().slice(6)
}

let Data = fetch("/data")
.then(response => response.json())
.then(information => {
    Data = information;
});

const StopWebCam = ()=> {
    let stream = video.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
}

document.querySelector('#close-video').addEventListener('click', (e) => {
    if (document.querySelector('#close-video').style.display === "flex") {
        document.querySelector('#close-video').style.display = "none";
        document.querySelector('#send-video').style.display = "none";
        videoContainer.style.display = "none";
        CamActive = false;
    }
    StopWebCam();
});


document.querySelector('#send-video').addEventListener('click', (e) => {
    if (pic_count > 0) {
        console.log(CamActive);
        SendPicActive = true;
        appendUserMessage();
        SendPicActive = true;
        context.clearRect(0, 0, canvas.width, canvas.height);
        count++, pic_count = 0;
    }
});


camera.addEventListener('click', (e) => {
    
    CamActive = true;
    if (videoContainer.style.display === "none") {
        videoContainer.style.display = "flex";
    }
    const constraints = {
        audio: false,
        video: {
            width: {min: 200, ideal: 200, max: 200},
            height: {min: 200, ideal: 200, max: 200}
        }
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                video.srcObject = stream;
                video.play();
            });
        } catch (err) {
            if (err) videoContainer.style.display = "none";
        }
        document.querySelector('#snap').addEventListener('click', (e) => {
            context.drawImage(video, 0, 0, 200, 200);
            pic_count++;
        });
    } 
});

const sendPicture = () => {
    if (count < 1) appendDate();
    let t = getTime();
    const dataURI = canvas.toDataURL();
    let timeBody = document.createElement('div');
    let pic = document.createElement('img');
    pic.src = dataURI;
    let messageBody = document.createElement('div');
    timeBody.innerHTML = t;
    timeBody.classList.add("user-time");
    messageBody.classList.add("message-body");
    messageBody.append(pic);
    messageBody.appendChild(timeBody);
    chatbody.append(messageBody);
}

function getTime() {
    const t = new Date().toLocaleTimeString();

    let i = 0, j = -1;
    let hour = t.slice(0, 2);
    let min = t.slice(2, 5);
    let meridiem = String;

    for (i; i < 24; i++) {
        j++;
        if (i == 13) j = 1;
        if (i == hour) break;
    }

    if (i < 12) meridiem = " AM";
    if (i >= 12) meridiem = " PM";
    if (i == 24) meridiem = " AM";

    hour = j;
    return hour + min + meridiem;
};

const appendMessage = (message) => {
    let t = getTime();
    let timeBody = document.createElement('div');
    let messageBody = document.createElement('div');
    timeBody.innerHTML = t;
    timeBody.classList.add("bot-time");
    messageBody.classList.add("bot-message");
    messageBody.innerHTML = message;
    messageBody.appendChild(timeBody)
    chatbody.append(messageBody);
}

const timer = () => {
    
}


messageInput.addEventListener('keydown', (e) => {
    const message = messageInput.value;
    scrolling = 1;
    if (e.keyCode === 13) {
        if (count < 1) appendDate();
        const len = botData(message);
        const millisecs = getResponseSec(len);
        appendUserMessage(message);
        setTimeout(() => {
            displayLoading();
        },800);
        setScrollPosition();
        setTimeout(() => {
            botMessage(message);
            displayLoading();
            setScrollPosition();
        },millisecs);
    }
});

send.addEventListener('click', (e) => {
    if (count < 1) appendDate();
    const message = messageInput.value;
    scrolling = 1;
    const len = botData(message);
    const millisecs = getResponseSec(len);
    appendUserMessage(message);
    setTimeout(() => {
        displayLoading();
    },800);
    setScrollPosition();
    setTimeout(() => {
        botMessage(message);
        displayLoading();
        setScrollPosition();
    },millisecs); 
    
});


const setScrollPosition = () => {
    if (scrolling > 0) {
        chatbody.scrollTop = chatbody.scrollHeight;
    }
};

const appendUserMessage = (message) => {
    if (CamActive && pic_count >= 1 && SendPicActive) {
        scrolling = 1, sendPicture(), setScrollPosition();
        botMessage("photo");
    } else {
        count++;
        let t = getTime();
        let time = document.createTextNode(t);
        let msgBody = document.createElement('div');
        let text = document.createTextNode(message);
        let timeBody = document.createElement('div');
        timeBody.appendChild(time);
        msgBody.appendChild(text);
        msgBody.appendChild(timeBody);
        timeBody.classList.add("user-time");
        msgBody.classList.add('message-body');
        chatbody.append(msgBody);
        messageInput.value = "";
    }
}

let botMessage = (message) => {
    let text = "";
    let userLocation = String;
    let country = String;
    if (counter === 1) {
        country = getCountry(message);
        areas.push(country);
        text = "Enter City or Parish!";
        counter++; 
    } else if (message.includes("weather")) {
        counter = 0;
        counter++;
        text = "Enter Country or State!";
    } else if (counter === 2) {
        counter++;
        areas.push(message);
        text = "Enter Town or District!";
    } else if (counter === 3) {
        counter++;
        areas.push(message);

        for (let i = 0; i < 3; i++) {
            userLocation += " " + areas[i];
        }
        scrolling = 1;
        getWeather(userLocation)
        .then(data => {
            text = "The Weather for " + data.country + " " + data.region;
            text += " " + data.area + " at your localtime (" + data.localtime + ") is: ";
            text += data.weather + " Temperature: " + data.temperature + " Farenheits";
            text += ", Wind Speed: " + data.windspeed + " Farenheits" + ", Observe at: " + data.ob_time ;
            setTimeout(() => {
                if (data.country === undefined) {
                    appendMessage("Ooops!! Sorry! can't tell you the Weather Forecast at the moment");
                    setScrollPosition();
                } else {
                    appendMessage(text);
                    setScrollPosition();
                }
            },3000)
        });
        text = "Retrieving weather now....";
        counter = 5;
    }

    else if (counter === 0 || counter === 5)  {
        text = doTheMath(message,[], 0);
        text = getDate(text);
        if (text == message) text = botData(message);
        text = text.charAt(0).toUpperCase() + "" + text.slice(1, text.length);
    }
    appendMessage(text);
};


const botData = (userinput) => {

    let rand = 0, len = 0;
    let response = "";
    for (let i = 0; i < Data.intents.length + 1; i++) {
        if (i == Data.intents.length) {
            response = getResponse(userinput);
            return response;
        } else if (Data.intents[i].patterns.includes(userinput)) {
            len = Data.intents[i].responses.length;
            rand = Math.floor(Math.random() * len + 1) - 1;
            return Data.intents[i].responses[rand];
        } 
    }
};

const getResponse = (message) => {
    let numWords = message.split(' ');
    let tags = [], patterns = [], bag_of_words = [];
    let probability = 0, matches = 0, index = 0;

    for (var i = 0; i < Data.intents.length; i++) {
        tags.push(Data.intents[i].tag);
        patterns.push(Data.intents[i].patterns)
    }
    for (var i = 0; i < patterns.length; i++) {
        let string_of_words = "";
        for (var j = 0; j < patterns[i].length; j++) {
            string_of_words += patterns[i][j] + " ";
        }
        let words = new Set(string_of_words.split(' '));
        bag_of_words.push(Array.from(words));
    }
    for (var i = 0; i < bag_of_words.length; i++) {
        for (var j = 0; j < bag_of_words[i].length; j++) {
            if (bag_of_words[i].includes(numWords[j])) {
                matches+=5;
            }
        }
        if (i < tags.length) {
            if (numWords.includes(tags[i])) matches+=100;
        }
        if (matches > probability ) {
            probability = matches;
            matches = 0, index = i;
        }
        matches = 0;
    }
    if (probability === 0) return "please try saying something else";

    let len = Data.intents[index].responses.length;
    let rand = Math.floor(Math.random() * len + 1) - 1;
    return Data.intents[index].responses[rand];
}


async function getWeather(country_city) {
    let params = new URLSearchParams({
        access_key: "0084956c30512c2724a9140aaa101ccb",
        query: country_city,
        units: "f",
    });
    try {
        const response = await fetch(
            `http://api.weatherstack.com/current?${params}`
            );
            const data = await response.json();
            let json = await data;

                return {
                country: json.location.country,
                region: json.location.region,
                area : json.location.name,
                localtime: json.location.localtime,
                weather: json.current.weather_descriptions,
                ob_time: json.current.observation_time,
                temperature: json.current.temperature,
                windspeed: json.current.wind_speed
            }

    } catch(error) {
        return ( "Sorry!!",error);
    }  
}

const getCountry = (country) =>
{
    for (var i = 0; i < Data.intents.length; i++) {
        if (Data.intents[i].patterns.includes(country)) {
            return country;
        } else if (i == Data.intents.length-1) {
            return `can't retrieve any data for ${country}!`;
        }
    }
}

let appendDate = () => {
    let d = new Date().toDateString();
    const msgDate = document.createElement("div");
    msgDate.innerHTML = d;
    msgDate.classList.add("date-class");
    chatbody.append(msgDate);
};

let getResponseSec = (response) => {
    return response.length * 30;
};


let displayLoading = () => {
    
    if (loading.style.display === "none") {
        console.log("loading");
        loading.style.display = "flex";
    } else {
        loading.style.display = "none";
    }
};

class mathFunctions {

    factorial(zero, n) {
        if (n < 2) {
            return 1;
        }
        let func = new mathFunctions();
        return n * func.factorial(zero, n - 1)
    }  
    addition (answer = 0,  numbers = [] ) {
        numbers.forEach(number => {
            answer += number;
        })
        return answer;
    }
    percentage (answer = 0, numbers = []) {
        return answer = numbers[0]/numbers[1] * 100;
    }
    multiplication (answer = 0, numbers = []) {
        answer = 1;
        numbers.forEach(number => {
            answer *= number;
        })
        return answer;
    }
    division (answer = 0, numbers = []) {
        answer = 1;
        numbers.forEach(number => {
            answer /= (answer*numbers[0]) / number;
        })
        return answer;
    } 
    subtraction (answer = 0, numbers = []) {
        answer = numbers[0]*2;
        numbers.forEach(number => {
            answer -= number;
        })
        return answer;
    }
}

function doTheMath(message, words = [], increment) {

    let operationList = { 
       operands: [
            ["+","add","sum","plus","addition"],
            ["-","minus","difference","takeaway","from"],
            ["/","divide","quotient","divident","divided"],
            ["*","times","product","multiply","by"],
            ["%","percent", "percentage"],
            ["^2","squared","square"],
            ["^3","cubed", "cube",],
            ["!", "factorial", "factorial"]
        ]
    }
    console.log("Message:",message)
    let calculate = new mathFunctions();
    let values = message.match(/\d+/g);
    if (values == null) return message;
    let numbers = new Array;
    values.forEach(val => numbers.push(parseFloat(val)))
    words = Array.from(message.split(" "));
    
    let operations = [
        calculate.addition(0,numbers),
        calculate.subtraction(0,numbers),
        calculate.division(0,numbers),
        calculate.multiplication(0,numbers),
        calculate.percentage(0,numbers),
        numbers[0]*numbers[0],
        numbers[0]*numbers[0]*numbers[0],
        calculate.factorial(0,numbers[0]),
    ]
    let op = operationList.operands;
    if (increment < op.length) {
        for (let i = 0; i < op[increment].length; i++) {
            for (let j = 0; j < words.length; j++) {
                if (op[increment][i] === words[j]) { 
                    let string = new Intl.ListFormat('en-US').format(values);
                    return `the ${op[increment][2]} of ${string} is ${operations[increment]}`
                }
            }
        }
        return doTheMath(message, words, increment + 1);
    } 
    return message;  
}


function postData(url = "", data = {}) {
    fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
}


const getDate = (message = "") => {
    const keyWords = [
        "today", "month", "year", "date", "time", "day"
    ];
    const messageWords = message.split(" ");

    for (var i = 0; i < keyWords.length; i++) {
        for (var j = 0; j < messageWords.length; j++) {
            if (keyWords[i] === messageWords[j]) {
                return `${keyWords[i]} is ${DateObj[messageWords[j]]}`;
            }
        }
    }
    return message;
}  
