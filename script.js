// DOM Elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const paraphraseButton = document.getElementById('paraphraseButton');
const styleSelector = document.getElementById('styleSelector');
const charCount = document.getElementById('charCount');
const copyButton = document.getElementById('copyButton');
const spinner = document.querySelector('.spinner');

// Configuration
const PROXY_URL = 'https://paraphraser.tanmay-patange.workers.dev'; // Replace with your worker URL

// Real-time character counter
inputText.addEventListener('input', () => {
    const currentLength = inputText.value.length;
    charCount.textContent = `${currentLength}/500`;
    
    // Add warning emoji when approaching limit
    charCount.style.color = currentLength >= 450 ? '#ff4757' : '#57606f';
    charCount.innerHTML = currentLength >= 450 
        ? `${currentLength}/500 🔥` 
        : `${currentLength}/500 ✍️`;
});

// Copy to clipboard with visual feedback
copyButton.addEventListener('click', async () => {
    if (!outputText.value) return;

    try {
        await navigator.clipboard.writeText(outputText.value);
        copyButton.innerHTML = '📋 Copied! ✅';
        setTimeout(() => {
            copyButton.innerHTML = '📋 Copy';
        }, 2000);
    } catch (err) {
        console.error('Copy failed:', err);
        copyButton.innerHTML = '📋 Failed! ❌';
        setTimeout(() => {
            copyButton.innerHTML = '📋 Copy';
        }, 2000);
    }
});

// Main paraphrasing function
async function paraphraseText() {
    const text = inputText.value.trim();
    const style = styleSelector.value;

    // Clear previous output
    outputText.value = '';
    
    // Validate input
    if (!text) {
        outputText.value = "✨ Please enter text to paraphrase!";
        return;
    }

    try {
        // UI Loading State
        paraphraseButton.disabled = true;
        paraphraseButton.innerHTML = `🔄 Processing... ${spinner.outerHTML}`;
        copyButton.style.opacity = '0.5';

        // API Request
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'text/plain',
                'Paraphrase-Style': style
            },
            body: text
        });

        // Handle HTTP errors
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        // Get and display result
        const paraphrased = await response.text();
        outputText.value = paraphrased || "🤷♂️ No changes suggested";

    } catch (error) {
        // Error handling with emoji feedback
        console.error('Paraphrase Error:', error);
        outputText.value = `⚠️ ${error.message.replace('Error: ', '')}`;
        
        // Special case for empty responses
        if(error.message.includes("empty")) {
            outputText.value = "🔮 The AI suggested no changes to your text!";
        }
    } finally {
        // Reset UI State
        paraphraseButton.disabled = false;
        paraphraseButton.innerHTML = '🪄 Paraphrase Now';
        copyButton.style.opacity = '1';
    }
}

// Event Listeners
paraphraseButton.addEventListener('click', paraphraseText);
inputText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        paraphraseText();
    }
});
