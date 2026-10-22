// ─── Gemini AI Configuration ───────────────────────────────────────────────
// API key is loaded from config.js (which is in .gitignore to protect your key).
// You can also set it via localStorage: localStorage.setItem("GEMINI_API_KEY", "your_key")
function getApiKey() {
    if (typeof GEMINI_API_KEY !== "undefined" && GEMINI_API_KEY && GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
        return GEMINI_API_KEY;
    }
    return localStorage.getItem("GEMINI_API_KEY") || "";
}

const SYSTEM_PROMPT = `You are Mental Health ChatBOT, a compassionate and professional AI mental health support chatbot.
Your role is to:
- Provide empathetic, warm, and non-judgmental emotional support
- Help users manage stress, anxiety, depression, loneliness, and other mental health concerns
- Offer practical coping strategies like deep breathing, grounding exercises, mindfulness, and journaling
- Give basic health information for common physical conditions (cold, diabetes, hypertension, migraine, asthma, etc.)
- Always remind users that you are an AI and encourage them to seek professional help for serious concerns
- Use gentle, supportive language with appropriate emojis to feel warm and human
- Keep responses concise (2–4 sentences) unless more detail is genuinely needed
- Never diagnose, prescribe medication, or replace a licensed mental health professional
- If a user expresses suicidal thoughts or self-harm, immediately urge them to call a crisis helpline (e.g., iCall: 9152987821 in India) and contact a trusted person
- Respond in the same language the user uses`;

// ─── Chatbot Core ─────────────────────────────────────────────────────────────
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Stores conversation turns for multi-turn memory
const conversationHistory = [];

async function sendMessage() {
    let userText = userInput.value.trim();
    if (userText === "") return;

    displayMessage(userText, "user");
    userInput.value = "";
    userInput.disabled = true;

    const typingDiv = showTypingIndicator();

    try {
        const botReply = await getGeminiResponse(userText);
        typingDiv.remove();
        displayMessage(botReply, "bot");
    } catch (error) {
        typingDiv.remove();
        console.error("Gemini API error:", error);
        const fallback = getKeywordFallback(userText);
        displayMessage(fallback, "bot");
    } finally {
        userInput.disabled = false;
        userInput.focus();
    }
}

// ─── Gemini API Call ──────────────────────────────────────────────────────────
async function getGeminiResponse(userMessage) {
    const key = getApiKey();
    if (!key) {
        // Fallback to keyword responses if no key is configured
        return getKeywordFallback(userMessage);
    }

    conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    const requestBody = {
        system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: conversationHistory
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${key}`;
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP ${response.status}`;
        throw new Error(errMsg);
    }

    const data = await response.json();
    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text
        || "I'm here to support you. 💜 Could you tell me more?";

    // Keep last 20 turns to avoid token overflow
    conversationHistory.push({
        role: "model",
        parts: [{ text: botText }]
    });
    if (conversationHistory.length > 20) {
        conversationHistory.splice(0, 2);
    }

    return botText;
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("chat-message", "bot");
    typingDiv.innerHTML = `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (!document.getElementById("typing-style")) {
        const style = document.createElement("style");
        style.id = "typing-style";
        style.textContent = `
            .typing-dots span {
                display: inline-block;
                animation: typingBounce 1.2s infinite;
                font-size: 22px;
                line-height: 1;
            }
            .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typingBounce {
                0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                40%            { transform: translateY(-6px); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    return typingDiv;
}

// ─── Display Message ──────────────────────────────────────────────────────────
function displayMessage(text, sender) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ─── Keyword Fallback (offline backup when API is unavailable) ───────────────
function getKeywordFallback(input) {
    input = input.toLowerCase();

    const responses = {
        "hello": "Hi! 😊 How can I support you today?",
        "how are you": "I'm just a bot, but I'm here to listen! 🧡",
        "i am sad": "I'm sorry you're feeling this way. 🫂 You're not alone.",
        "i am happy": "That's great! 🌈 Tell me what made you smile today!",
        "thank you": "You're welcome! 💖 I'm always here for you.",
        "bye": "Goodbye! Take care and be kind to yourself. 🌿",
        "i feel anxious": "Try deep breathing: inhale 4s, hold 4s, exhale 4s. 🌬️",
        "i feel lonely": "I'm here for you. Connecting with a loved one can help. 💜",
        "i cant sleep": "Try avoiding screens before bed and practice deep breathing. 🌙",
        "i feel like giving up": "You're stronger than you think. You're not alone. 💪",
        "i feel depressed": "I'm really sorry you feel this way. 💙 Please consider speaking to a counsellor.",
        "stress": "Try taking short breaks and deep breaths. You've got this! 🌿",
        "panic attack": "Breathe in 4s, hold 4s, breathe out 4s. Name 5 things you can see. You are safe. 🤍",
        "diabetes": "Symptoms→ Frequent urination, thirst, fatigue. Treatment→ Insulin, diet, exercise.",
        "migraine": "Symptoms→ Severe headache, nausea, light sensitivity. Treatment→ Pain relievers, rest in dark room.",
        "asthma": "Symptoms→ Wheezing, shortness of breath, chest tightness. Treatment→ Inhalers, avoid triggers.",
        "covid": "Symptoms→ Fever, dry cough, fatigue. Treatment→ Supportive care, rest, hydration.",
        "cold": "Symptoms→ Runny nose, sore throat, mild fever. Treatment→ Rest, hydration, warm salt gargle.",
    };

    for (let key in responses) {
        if (input.includes(key)) return responses[key];
    }

    return "I'm here to listen. 💜 Tell me more about how you're feeling.";
}

// ─── Keyboard & UI Controls ───────────────────────────────────────────────────
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function reset() {
    document.querySelector(".chat-box").innerText = " ";
    conversationHistory.length = 0;
}

function show() {
    document.querySelector(".outline").style.display = "block";
    document.querySelector(".show").style.display = "none";
    document.querySelector(".video").style.display = "none";
    document.querySelector(".heading").style.display = "none";
    document.querySelector(".image").style.display = "block";
}

function hide() {
    document.querySelector(".outline").style.display = "none";
    document.querySelector(".show").style.display = "block";
    document.querySelector(".video").style.display = "block";
    document.querySelector(".image").style.display = "none";
    document.querySelector(".heading").style.display = "block";
}