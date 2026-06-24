self.onmessage = function(event) {
    const rawTextChunk = event.data;
    let parsedMessages = [];

    // Upgraded Regex to handle Android, iOS, and missing spaces after colons
    const recordRegex = /^\[?(\d{1,4}[/\.-]\d{1,2}[/\.-]\d{1,4})[, ]\s*(\d{1,2}:\d{2}(?::\d{2})?\s*[a-zA-Z]*)[\]\-]?\s+(.*?):\s*(.*)$/;

    const lines = rawTextChunk.split('\n');

    lines.forEach(line => {
        // THE FIX: Strip out the invisible WhatsApp formatting characters!
        const cleanLine = line.replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim();
        
        if (!cleanLine) return; // Skip completely blank lines

        // Try to find the timestamp and author
        const match = cleanLine.match(recordRegex);

        if (match) {
            // It's a brand new message!
            parsedMessages.push({
                date: match[1],
                time: match[2],
                author: match[3].trim(), // e.g., "Ket" or "~Mary Tan"
                text: match[4].trim()
            });
        } else if (parsedMessages.length > 0) {
            // It's a multi-line paragraph. Append it to the previous message.
            parsedMessages[parsedMessages.length - 1].text += `<br>${cleanLine}`;
        }
    });

    // Send the cleanly separated data back to the UI
    self.postMessage(parsedMessages);
};
