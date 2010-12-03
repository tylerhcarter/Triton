// This is a very small subset of Markdown, and probably
// doesn't deserve its own file.

// It's completely naïve, too. It doesn't handle complex
// stuff very well. Nevertheless, it's fine for titles.

var SimpleMD = (function() {
    return {
        process: function(text) {
            // Replace **text** with <strong>text</strong>
            var boldSRegex = /\*\*(.+?)\*\*/g;
            var boldURegex = /^__(.+?)__/g;
            var boldRepl   = '<strong>$1</strong>';
            // Replace *text* with <em>text</em>
            var italSRegex = /\*(.+?)\*/g;
            var italURegex = /_(.+?)_/g;
            var italRepl   = '<em>$1</em>';
            // Replace `code` with <code>code</code>
            var codeRegex  = /`(.+?)`/g;
            var codeRepl   = '<code>$1</code>';

            var newText = text;
            newText = newText.replace(boldSRegex, boldRepl);
            newText = newText.replace(boldURegex, boldRepl);
            newText = newText.replace(italSRegex, italRepl);
            newText = newText.replace(italURegex, italRepl);
            newText = newText.replace(codeRegex, codeRepl);

            return newText;
        }
    };
})();
