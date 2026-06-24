self.onmessage = function(event) {
    const rawTextChunk = event.data;
    let parsedMessages = [];
    
    // Standard WhatsApp Regex
    const recordRegex = /^\[?(\d{1,4}[\/\.\-]\d{1,2}[\/\.\-]\d{1,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?\s?[A-Za-z]*)[\]\-]\s([^:]+):\s(.+)$/;
    const lines = rawTextChunk.split('\n');

    lines.forEach(line => {
        const match = line.match(recordRegex);
        if (match) {
            parsedMessages.push({
                date: match[1],
                time: match[2],
                author: match[3],
                text: match[4]
            });
        } else if (parsedMessages.length > 0 && line.trim() !== "") {
            // FIX: Catch multi-line paragraphs and append them to the previous bubble!
            parsedMessages[parsedMessages.length - 1].text += `<br>${line}`;
        }
    });

    self.postMessage(parsedMessages);
};
