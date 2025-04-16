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

function safeJson(text) {
  try {
    return text ? JSON.parse(text) : undefined;
  }
  catch {
    return {};
  }
}



// Button Events
document.getElementById('send').addEventListener('click', async () => {
  const url = document.getElementById('url').value;
  const method = document.getElementById('method').value;
  const headers = safeJson(document.getElementById('headers').value);
  const body = safeJson(document.getElementById('body').value);
  const result = await window.reststop.sendRequest({ url, method, headers, body });
  const responseEl = document.getElementById('response-output');
  const responseHeaders = document.getElementById('headers-output');

  if (result.success) {
    const contentType = result.headers['content-type'] || '';
    responseHeaders.innerHTML = prettyPrint(result.headers);
    
    if (contentType.includes('application/json')) {
      responseEl.innerHTML = prettyPrint(result.data);
    } else if (contentType.includes('text/html')) {
      responseEl.textContent = prettyPrintHtml(result.data);
    } else {
      responseEl.textContent = result.data;
    }

    //  Add response time display
    document.getElementById('response-time').textContent = `⏱ ${result.duration} ms`;
    saveRequestToHistory({ url, method, headers, body });
  } else {
    responseEl.textContent = `Error: ${result.error} (Status: ${result.status || 'n/a'})`;
    //Add response time even on error
    document.getElementById('response-time').textContent = `⏱ ${result.duration || 'n/a'} ms`;
  }
});

document.getElementById('prettify-headers').addEventListener('click', async () => {
  const headers = document.getElementById('headers');
  const headersText = headers.value;
  headers.value = prettifyTextJson(headersText)
});

document.getElementById('prettify-body').addEventListener('click', async () => {
  const body = document.getElementById('body');
  const bodyText = body.value;
  body.value = prettifyTextJson(bodyText);
});