// worker.js

// 1. Listen for messages from the main script
self.onmessage = function(event) {
    const rawTextChunk = event.data;
    let parsedMessages = [];

    // The standard WhatsApp Regex we used earlier
    const recordRegex = /^\[?(\d{1,4}[\/\.\-]\d{1,2}[\/\.\-]\d{1,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?\s?[A-Za-z]*)[\]\-]\s([^:]+):\s(.+)$/;
    const lines = rawTextChunk.split('\n');

    // 2. Do the heavy lifting (Parsing)
    lines.forEach(line => {
        const match = line.match(recordRegex);
        if (match) {
            parsedMessages.push({
                date: match[1],
                time: match[2],
                author: match[3],
                text: match[4]
            });
        }
    });

    // 3. Send the structured JSON array back to the main script
    self.postMessage(parsedMessages);
};
