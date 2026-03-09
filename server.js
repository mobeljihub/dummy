const express = require('express');
const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// ================= Fake database =================
const users = [
  { id: 1, username: "admin", password: "admin123" },
  { id: 2, username: "user", password: "user123" }
];

/*
--------------------------------------------------
1️⃣ SQL Injection Test Endpoint
--------------------------------------------------
*/
app.get('/login', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  console.log("Simulated Query:", query);

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    return res.json({ successs: true, user });
  }

  res.status(401).json({ success: false });
});


/*
--------------------------------------------------
2️⃣ Script Injection Test
--------------------------------------------------
*/
app.post('/submit', (req, res) => {
  console.log("Raw Body:", req.body);
  res.json({ received: req.body });
});


/*
--------------------------------------------------
3️⃣ Header Injection Test
--------------------------------------------------
*/
app.get('/headers', (req, res) => {
  console.log("Headers:", req.headers);
  res.json({ headers: req.headers });
});


/*
--------------------------------------------------
4️⃣ Credential Logging Test
--------------------------------------------------
*/
app.get('/secure', (req, res) => {
  const auth = req.headers.authorization;
  console.log("Authorization Header:", auth);
  res.json({ message: "Check server logs for credential exposure" });
});


// ================= START SERVER (ONLY ONCE) =================
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});