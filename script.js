const PROXY_URL = 'YOUR_PROXY_URL';
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const paraphraseButton = document.getElementById('paraphraseButton');
const styleSelector = document.getElementById('styleSelector');
const charCount = document.getElementById('charCount');
const copyButton = document.getElementById('copyButton');
const spinner = document.querySelector('.spinner');

// Character counter
inputText.addEventListener('input', () => {
    charCount.textContent = inputText.value.length;
});

// Copy functionality
copyButton.addEventListener('click', () => {
    if (outputText.value) {
        navigator.clipboard.writeText(outputText.value)
            .then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            })
            .catch(err => console.error('Copy failed:', err));
    }
});

async function paraphraseText() {
    const text = inputText.value.trim();
    const style = styleSelector.value;

    if (!text) {
        outputText.value = "Please enter some text first";
        return;
    }

    try {
        paraphraseButton.disabled = true;
        paraphraseButton.querySelector('.btn-text').textContent = 'Paraphrasing...';
        spinner.style.display = 'block';

        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'text/plain',
                'Paraphrase-Style': style
            },
            body: text
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const paraphrased = await response.text();
        outputText.value = paraphrased;

    } catch (error) {
        console.error('Error:', error);
        outputText.value = "⚠️ Error: Could not paraphrase. Please try again.";
    } finally {
        paraphraseButton.disabled = false;
        paraphraseButton.querySelector('.btn-text').textContent = 'Paraphrase Now';
        spinner.style.display = 'none';
    }
}

paraphraseButton.addEventListener('click', paraphraseText);
