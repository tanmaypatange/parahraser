const PROXY_URL = 'YOUR_WORKER_URL';
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const paraphraseButton = document.getElementById('paraphraseButton');
const styleSelector = document.getElementById('styleSelector');
const charCount = document.querySelector('.char-count');
const copyButton = document.getElementById('copyButton');
const spinner = document.querySelector('.spinner');

// Character counter with emoji
inputText.addEventListener('input', () => {
    const count = inputText.value.length;
    charCount.innerHTML = `${count}/500 ${count >= 450 ? '⚠️' : '🧮'}`;
});

// Copy button with emoji feedback
copyButton.addEventListener('click', () => {
    if (outputText.value) {
        navigator.clipboard.writeText(outputText.value)
            .then(() => {
                copyButton.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                }, 2000);
            })
            .catch(err => console.error('Copy failed:', err));
    }
});

async function castSpell() {
    const text = inputText.value.trim();
    const style = styleSelector.value;

    if (!text) {
        outputText.value = "🔮 Please enter some text first!";
        return;
    }

    try {
        paraphraseButton.disabled = true;
        paraphraseButton.innerHTML = `🔮 Brewing Magic... ${spinner.outerHTML}`;
        
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'text/plain',
                'Paraphrase-Style': style
            },
            body: text
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.text();
        outputText.value = result || "🧙♂️ Magic failed! Try again?";

    } catch (error) {
        console.error('Magic Error:', error);
        outputText.value = "⚡ Spell Backfired! Please try again later.";
    } finally {
        paraphraseButton.disabled = false;
        paraphraseButton.innerHTML = '🪄 Cast Paraphrase Spell';
    }
}

paraphraseButton.addEventListener('click', castSpell);
