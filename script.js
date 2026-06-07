
// Login function
function login() {
    let username = document.querySelector(".username").value.trim();
    let userpassword=document.querySelector(".userpassword").value.trim();
    if (username === "") {
        alert("Please enter your Name! or Password");
        document.querySelector(".passname").textContent="*Enter your name";
        if (userpassword===""){
            alert("Please enter your Name! or Password");
            document.querySelector(".passpass").textContent="*Enter your password";
            return;
        }
        return;
    }
    
    localStorage.setItem("user", username);
    window.location.href = "chatbot.html";
}

// Check if user is logged in
function checkLogin() {
    let username = localStorage.getItem("user");
    if (!username) {
        window.location.href = "index.html";
    } else {
        document.getElementById("user-name").innerText = username;
    }
}

// Logout function
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// Chatbot Logic
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function sendMessage() {
    let userText = userInput.value.trim();
    if (userText === "") return;

    displayMessage(userText, "user");
    userInput.value = "";

    setTimeout(() => {
        let botReply = getBotResponse(userText);
        displayMessage(botReply, "bot");
    }, 800);
}



function displayMessage(text, sender) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(input) {
    input = input.toLowerCase();
    
    const responses = {
        "hello": "Hi! 😊 How can I support you today?",
        "how are you": "I'm just a bot, but I'm here to listen! 🧡",
        "i am sad": "I'm sorry you're feeling this way. 🫂 You're not alone.",
        "i am happy": "That's great! 🌈 Tell me what made you smile today!",
        "thank you": "You're welcome! 💖 I'm always here for you.",
        "safiya": "She is a Daughter of Ali babu",
        "bye": "Goodbye! Take care and be kind to yourself. 🌿",
        "nikhilarasu": "He is shanmuga priya best friend.",
        "how are you feeling today?": "It's okay to feel however you're feeling. Want to talk about it?",
        "do you often feel anxious?": "Anxiety can be tough. Deep breathing and grounding exercises can help.",
        "are you having trouble sleeping?": "Try limiting screen time before bed and practicing relaxation techniques.",
        "do you feel stressed about work or studies?": "Break tasks into smaller steps and take short breaks.",
        "what makes you happy?": "Finding joy in small things can be powerful! What are some things you love?",
        "do you practice self-care?": "Self-care is important! It can be anything from resting to engaging in hobbies.",
        "have you been eating well?": "A balanced diet can impact mood. Try incorporating nutritious foods.",
        "Do you exercise regularly?": "Exercise can boost mental health. Even a short walk helps!",
        "How is your mood today?": "It's okay to have ups and downs. Want to share more?",
        "What do you enjoy doing in your free time?": "Hobbies and relaxation can be great stress relievers!",
        "Do you feel lonely?": "You're not alone. Reaching out to friends or loved ones might help.",
        "Have you been spending time with friends or family?": "Social connections can boost well-being.",
        "What thoughts are on your mind?": "I'm here to listen. Feel free to share.",
        "How do you usually cope with stress?": "Healthy coping mechanisms, like journaling, can help manage stress.",
        "Do you have trouble concentrating?": "Taking short breaks and practicing mindfulness may improve focus.",
        "Are you getting enough rest?": "Rest is essential. Try a bedtime routine for better sleep.",
        "Have you experienced any panic attacks?": "Grounding techniques, like the 5-4-3-2-1 method, can help in those moments.",
        "Would you like relaxation tips?": "Deep breathing, meditation, and music can help reduce stress.",
        "Do you meditate?": "Meditation can help clear the mind. Even a few minutes daily can make a difference.",
        "Have you spoken to anyone about your feelings?": "Talking to someone can be very helpful. You're not alone.",
        "Do you feel overwhelmed?": "Taking small steps and prioritizing tasks may help.",
        "Are you facing any major life changes?": "Transitions can be tough. It's okay to take time to adjust.",
        "Do you feel motivated?": "Motivation can come in waves. Setting small goals may help.",
        "Would you like to practice deep breathing?": "Try inhaling for 4 seconds, holding for 4, and exhaling for 4.",
        "Do you experience mood swings?": "Mood changes can be normal. Self-care and reflection might help.",
        "Are you feeling burnt out?": "Rest and self-care are crucial. Taking breaks is okay.",
        "Would you like some stress relief techniques?": "Listening to calming music, stretching, or journaling can help.",
        "Do you feel stuck in negative thoughts?": "Challenging negative thoughts and practicing gratitude may help.",
        "What are some things that make you feel calm?": "Engaging in soothing activities like reading or nature walks can help.",
        "Do you enjoy listening to music?": "Music can be therapeutic! Do you have a favorite song?",
        "Are you struggling with low energy?": "Hydration, nutrition, and movement can improve energy levels.",
        "Would you like to learn mindfulness exercises?": "Focusing on the present moment can be grounding.",
        "Have you had any major life stressors recently?": "Big changes can be difficult. It's okay to seek support.",
        "Do you have a strong support system?": "Having a support network can make challenges easier.",
        "Are you feeling hopeless?": "You're not alone. Support and self-care can help.",
        "Would you like to set small daily goals?": "Small wins can build confidence and motivation.",
        "Have you been journaling your thoughts?": "Writing can help process emotions.",
        "Do you feel safe in your environment?": "Feeling safe is important. If not, consider talking to someone you trust.",
        "Are you struggling with social anxiety?": "Deep breathing and gradual exposure can help manage social anxiety.",
        "Would you like to talk about your emotions?": "Expressing emotions can be very helpful.",
        "Are you having trouble making decisions?": "Listing pros and cons can make decision-making easier.",
        "Do you have trouble managing anger?": "Deep breaths and stepping away can help manage anger.",
        "Have you tried any relaxation exercises?": "Stretching, yoga, and deep breathing are great options.",
        "Do you feel appreciated by others?": "You are valued and important!",
        "Do you feel emotionally drained?": "It's okay to take breaks and prioritize yourself.",

        "i feel anxious": "Im sorry youre feeling this way. Try deep breathing: inhale for 4 seconds, hold for 4, exhale for 4. Would you like more tips?",
        "i feel really down today": "Im here for you. Its okay to feel this way sometimes. Would you like to talk about whats on your mind?",
        "im overwhelmed with work": "That sounds tough. Taking short breaks and deep breaths can help. Would you like a time management tip?",
    "i cant sleep at night": "That must be frustrating. Try avoiding screens before bed and practicing deep breathing. Would you like a relaxation exercise?",
    "i feel lonely": "Im here for you. Connecting with a loved one or doing something you enjoy can help. Would you like some suggestions?",
    "i dont feel like doing anything today": "Thats okay. Some days are harder than others. Try taking small steps—whats one small thing you can do today?",
    "i think Im having a panic attack!": "Im here with you. Breathe in for 4 seconds, hold for 4, and exhale slowly. Try naming five things you see around you. You are safe.",
    "im so angry right now!": "Its okay to feel angry. Try taking deep breaths or writing down your thoughts. Would you like to talk about whats upsetting you?",
    "i feel like nothing will get better": "Im sorry you feel this way. You are not alone, and things can improve. Would you like to talk or hear a story of hope?",
    "i dont feel good enough": "You are enough just as you are. We all have strengths and weaknesses. Whats one thing you like about yourself?",
    "i cant focus on my work": "Try the Pomodoro technique—work for 25 minutes, then take a 5-minute break. Would you like more focus tips?",
    "i feel guilty about something I did": "Guilt can be tough. Making amends and forgiving yourself is important. Would you like help in processing this?",
    "i get nervous in social situations": "Youre not alone in this. Preparing conversation starters and taking deep breaths can help. Want some more tips?",
    "i just went through a breakup": "Im sorry. Breakups are painful, but you will heal with time. Want to talk about how youre feeling?",
    "i feel empty inside": "That sounds difficult. Sometimes, exploring hobbies or talking to someone can help. Would you like to try something new?",
    "my mind wont stop racing": "Overthinking can be exhausting. Try writing your thoughts down or listening to calming music. Want to try a grounding exercise?",
    "i feel like my friends dont care about me": "That must hurt. Have you tried sharing how you feel with them? I can suggest ways to start the conversation.",
    "someone criticized me, and I feel terrible": "Its okay to feel hurt. Constructive criticism can help us grow. What did they say, and how do you feel about it?",
    "i feel like a failure": "You are not a failure. Mistakes help us learn. Whats something small you accomplished recently?",
    "i dont know what to do with my life": "Its okay to feel uncertain. Exploring your passions and values can help. Want to try a self-reflection exercise?",
    "everyone seems to be doing better than me": "Social media only shows the highlights of peoples lives. Focus on your own journey. Whats something youre proud of?",
    "i feel so burned out": "Burnout is real. Taking breaks and self-care is important. Want some tips on recharging?",
    "im having problems with my family": "That sounds tough. Communication and setting boundaries can help. Would you like advice on handling conflict?",
    "i dont like the way I look": "You are beautiful just as you are. Self-love takes time. Want to try an affirmation exercise?",
    "im scared of whats going to happen in the future": "The future is uncertain, but you can control your present actions. Whats something you can focus on today?",
    "someone I trusted betrayed me": "That must hurt. Betrayal is painful, but healing is possible. Want to talk about what happened?",
    "i dont think I matter": "You do matter. You have unique gifts and people who care about you. Would you like to hear some affirmations?",
    "i regret something I did": "Regret is tough, but it can teach us valuable lessons. Whats something youve learned from this experience?",
    "i feel like giving up": "I hear you. Youre stronger than you think, and youre not alone. Want to talk about whats making you feel this way?",
    "i dont think anyone really loves me": "You are loved and valued. Sometimes, we dont see the love around us. Want to talk about whats making you feel this way?",
     

        "commonCold":"symptoms-->Sneezing, Runny nose, Sore throat, Cough, Mild fever :: Treatment--> Rest, Hydration, Over-the-counter cold medicines, Gargling with warm salt water",
        "diabetes":"Symptoms-->Frequent urination, Excessive thirst, Unexplained weight loss, Fatigue, Blurred vision :: Treatment-->Insulin therapy, Oral medications, Dietary changes, Regular exercise",
        "hypertension":"Symptoms-->Often no Symptoms, Headaches, Dizziness, Blurred vision, Chest pain :: Treatment-->Lifestyle changes, Low-sodium diet, Exercise, Medications like beta-blockers",
        "migraine":"Symptoms-->Severe headache, Nausea, Vomiting, Sensitivity to light and sound :: Treatment-->Pain relievers, Avoidin   triggers, Rest in a dark, quiet room, Prescription medications",
        "asthma":"Symptoms-->Shortness of breath, Wheezing, Coughing, Chest tightness :: Treatment-->Inhalers (bronchodilators), Avoidin   triggers, Steroid medications",
        "pneumonia":"Symptoms-->High fever, Cough with phlegm, Shortness of breath, Chest pain :: Treatment-->Antibiotics (if bacterial), Rest, Hydration, Oxygen therapy in severe cases",
        "covid-19":"Symptoms-->Fever, Dry cough, Loss of taste or smell, Shortness of breath, Fatigue :: Treatment-->Supportive care, Oxygen therapy in severe cases, Antiviral medications (Paxlovid)",
        "tuberculosis":"Symptoms-->Chronic cough, Night sweats, Weight loss, Fatigue, Chest pain :: Treatment-->Long-term antibiotics (Rifampin, Isoniazid), Proper nutrition, Isolation in contagious cases",
        "dengue":"Symptoms-->High fever, Severe joint and muscle pain, Skin rash, Bleeding (severe cases) :: Treatment-->Supportive care, Hydration, Pain relievers (avoid aspiri",
    
    };

    for (let key in responses) {
        if (input.includes(key)) {
            return responses[key];
        }
    }

    return "I'm here to listen. 💜 Tell me more about how you're feeling.";
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function reset (){
    document.querySelector(".chat-box").innerText=" "
}

function show (){
    document.querySelector(".outline").style.display="block";
    document.querySelector(".show") .style.display="none";
    document.querySelector(".video").style.display="none"; 
    document.querySelector(".heading").style.display="none";
    document.querySelector(".image").style.display="block"
}

function hide(){
    document.querySelector(".outline").style.display="none";
    document.querySelector(".show") .style.display="block";
    document.querySelector(".video").style.display="block"; 
    document.querySelector(".image").style.display="none";
    document.querySelector(".heading").style.display="block";
    
}