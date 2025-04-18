function safeJson(text) {
    try {
      return text ? JSON.parse(text) : undefined;
    }
    catch {
      return {};
    }
}

function prettyPrint(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    return jsonString
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
            let cls = 'text-gray-300';
            if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'text-purple-400';
            } else {
                cls = 'text-green-400';
            }
            } else if (/true|false/.test(match)) {
            cls = 'text-yellow-300';
            } else if (/null/.test(match)) {
            cls = 'text-pink-400';
            } else {
            cls = 'text-blue-300';
            }
            return `<span class="${cls}">${match}</span>`;
        }
    );
}
  
function prettyPrintHtml(htmlString) {
    const formatted = htmlString
        .replace(/></g, '>\n<')
        .replace(/^(.)/gm, '  $1');
    return formatted;
}

function prettifyTextJson(text) {
    const safe = safeJson(text);
    const formattedHeaders = JSON.stringify(safe, null, 2);
    if (formattedHeaders != '{}') {
        return formattedHeaders;
    }
    else {
        return `${text}\nJSON SYNTAX ERROR`;
    }
}