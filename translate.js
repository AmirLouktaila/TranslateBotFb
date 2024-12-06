const axios = require('axios');

async function translate(text, from, to) {
    /**
     * Translate text from one language to another using Google's translation API.
     * @return {String} Translated text
     */
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await axios.get(apiUrl);
        const translatedWords = response.data[0].map(entry => entry[0]);
        const fullText = translatedWords.join("");
        return fullText;
    } catch (error) {
        console.error("Error translating text:", error);
        throw error;
    }
}

module.exports = { translate };