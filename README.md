# ft.js

JS wrapper for the 42 school's API

## Presentation

ft.js is a lightweight client to interact with the 42 API easily.

Features :

- Simplifies fetching any API endpoint without manual token management (auto refresh included)
- Access basic user data and other common resources effortlessly
- Support multiple application credentials (client ID and secret) to handle rate limits by cycling through apps
- The creation of middlewares for http or express servers.

## Installation

```bash
npm install @saumon-brule/ft.js
```

## Usage

```js
import Ft from "@saumon-brule/ft.js";

const ft = new Ft([
  { clientId: "your_client_id1", clientSecret: "your_client_secret1" },
  { clientId: "your_client_id2", clientSecret: "your_client_secret2" },
]);

const users = await ft.get("/v2/users").then((response) => response.json());
console.log(users);
```

You may also want to allow registration to your app for users from a browser.<br/>
To allow this, the wrapper provides functions that you can use to create middlewares for an http or express server

```js
import Ft from "@saumon-brule/ft.js";
import express from "express";

const ft = new Ft([
  { clientId: "your_client_id1", clientSecret: "your_client_secret1" },
  { clientId: "your_client_id2", clientSecret: "your_client_secret2" },
]);

ft.on("userAdd", (user) => {
  user.get("/v2/me")
    .then((response) => response.json())
    .then((me) => console.log(me.login));
});

const app = express();

app.get("/error", (_, res) => { res.send("Authentification error"); });
app.get("/success", (_, res) => { res.send("Authentification success"); });

app.get("/", ft.userManager.authenticate());

app.get("/callback",
  ft.userManager.callback({ errorPage: "/error" }),
  (req, res) => res.redirect("/success")
);
```

## License

This project is licensed under the [MIT License](./LICENSE).  
You are free to use, modify, and distribute this project, as long as the original author is credited.
