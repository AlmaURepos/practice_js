const { resolve } = require('dns');
const http = require('http');
const PORT = 3000

const fetchUserData = async () => {
    return new Promise((resolve) => {
        setTimeout( () => {
            resolve({
                id: 101,
                username: 'AlmauStudent2026',
                theme: 'dark'

            })
        }, 500)
    })
}

function escapeForInlineScript(value){
    return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function renderHTML(userData) {
    const safeInitialState = escapeForInlineScript(userData);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSR Hydration Lab</title>

  <script>
    window.__INITIAL_STATE__ = ${safeInitialState};
  </script>

  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 2rem;
      background: #f7f7fb;
      color: #1f2937;
    }

    .hydration-target {
      border: 2px dashed #0066cc;
      padding: 1rem;
      border-radius: 12px;
      background: white;
      max-width: 480px;
    }

    .loading {
      opacity: 0.5;
    }

    #status-badge {
      font-weight: 700;
    }

    #connect-btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      background: #0066cc;
      color: white;
      cursor: pointer;
      margin-top: 0.5rem;
    }

    #connect-btn[disabled] {
      cursor: not-allowed;
      opacity: 0.7;
    }

    .meta {
      color: #6b7280;
      font-size: 0.95rem;
    }
  </style>
</head>
<body>
  <h1>Dashboard</h1>

  <div id="user-profile" class="hydration-target loading" data-hydrate="true">
    <h2>Welcome, <span id="display-name">${userData.username}</span></h2>
    <p>Status: <span id="status-badge">Offline</span></p>
    <p class="meta">User ID: <span id="user-id">${userData.id}</span></p>
    <p class="meta">Preferred theme: <span id="user-theme">${userData.theme}</span></p>
    <button id="connect-btn" disabled>Connecting...</button>
  </div>

  <script src="/client.js"></script>
</body>
</html>`;

}

function getClientCode() {
  return `
// client.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Ready. Starting Hydration Process...");

  // 1. Read initial state safely
  const initialState = window.__INITIAL_STATE__ || {};
  console.log("Hydrating with state:", initialState);

  // 2. Locate nodes that demand hydration
  const profileNode = document.getElementById("user-profile");
  const connectBtn = document.getElementById("connect-btn");
  const statusBadge = document.getElementById("status-badge");
  const displayName = document.getElementById("display-name");
  const userTheme = document.getElementById("user-theme");

  if (!profileNode || !connectBtn || !statusBadge) {
    console.error("Hydration failed: Target nodes missing.");
    return;
  }

  // optional sync check against SSR DOM
  if (displayName && initialState.username) {
    displayName.textContent = initialState.username;
  }

  if (userTheme && initialState.theme) {
    userTheme.textContent = initialState.theme;
  }

  // 3. Perform Hydration
  setTimeout(() => {
    profileNode.classList.remove("loading");
    connectBtn.removeAttribute("disabled");
    connectBtn.textContent = "Go Online";

    // Attach Event Listeners
    connectBtn.addEventListener("click", () => {
      if (statusBadge.textContent === "Offline") {
        statusBadge.textContent = "Online";
        statusBadge.style.color = "green";
        connectBtn.textContent = "Go Offline";

        console.log("User " + initialState.username + " connected to socket.");
      } else {
        statusBadge.textContent = "Offline";
        statusBadge.style.color = "inherit";
        connectBtn.textContent = "Go Online";
      }
    });

    console.log("[SUCCESS] Node Hydrated Successfully");
  }, 1000);
});
`;
}


const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        try{
            const userData = await fetchUserData()
            const html = renderHTML(userData)

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(html)

        }
        catch(error){
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
            res.end('Internal Server Error')
        }
       
    }else if(req.url === '/client.js'){
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' })
        res.end(getClientCode())
    }else{
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Not Found')
    }

})


server.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})