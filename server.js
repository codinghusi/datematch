const express = require('express');
const session = require('express-session');
const fs = require('fs');
const mysql = require('mysql2/promise');
const bodyparser = require('body-parser');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'datematch',
    user: 'datematch',
    password: 'asdf'
});


const app = express();

const json = bodyparser.json();
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/new');
});

app.get('/new', (req, res) => {
    res.send(fs.readFileSync('public/new.html').toString());
});

app.get('/select/:id/', (req, res) => {
    res.send(fs.readFileSync('public/select.html').toString());
});

app.post('/create', json, async (req, res) => {
    const {name, available} = req.body;
    console.log('body: ', req.body);
    // TODO: Hier ist irgendwo noch ein FEEEHLEEER
    const result = await (await connection).query('INSERT INTO survey (name) VALUES ?', [[name]]);
    console.log('result: ', result);
    await (await connection).query('INSERT INTO available (survey_id, date) VALUES ?', available.map(day => ([result.insertId, new Date(day)])))
        .catch(err => console.log(err));
});


app.listen(5000);