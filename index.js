const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
const db = new sqlite3.Database('Warehouse.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});



// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/form.html`);
});

// Handle the form submission
app.post('/search', (req, res) => {
  const partNumber = req.body.partNumber;
  const query = `
    SELECT Shelf.ShelfLocation, Bin.BinID, COUNT(PartNumber.PartNumberID)
    FROM PartNumber
    JOIN Bin ON PartNumber.BinID = Bin.BinID
    JOIN Shelf ON Bin.ShelfID = Shelf.ShelfID
    WHERE PartNumber.PartNumbers = ?
  `;
  db.get(query, [partNumber], (err, row) => {
    if (err) {
      console.error(err.message);
    }
    res.send(`
    <html>
    <head>
      <title>Warehouse </title>
      <style>
        body {
          background: rgb(178, 178, 178);
          background: radial-gradient(
            circle,
            rgba(178, 178, 178, 1) 0%,
            rgba(168, 211, 221, 1) 100%
          );
        }
        h1 {
            text-align: center;
        }
  
        #output {
          margin-top: 50px;
          font-size: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
    <h1>Result</h1>
    <table border="1">
  <thead>
    <tr>
      <th>Shelf Number</th>
      <th>Bin Number</th>
      <th>Count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${row.ShelfLocation}</td>
      <td>${row.BinID}</td>
      <td>${row['COUNT(PartNumber.PartNumberID)']}</td>
    </tr>
  </tbody>
        </table>
    </body>
  </html>
    `);
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});