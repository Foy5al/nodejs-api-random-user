const express = require('express')
const cors = require('cors')
const data = require('./data.json')
const { type } = require('express/lib/response');
const { body } = require('express-validator');
const fs = require('fs');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/all', (req, res) => {
    //http://localhost:5000/all?limit=4
    const query = req.query.limit
    if (query) {
        const queryData = data.splice(0, query);
        res.send(queryData)
    } else {
        res.send(data)
    }
})
app.get('/user/random', (req, res) => {
    const randomData = data[Math.floor((Math.random() * data.length) + 1)];
    res.send(randomData)
})

//save new user
app.post('/user/save', (req, res) => {
    console.log('got body', req.body);
    const newData = req.body;
    console.log(newData);

    fs.readFile('data.json', function (err, data) {
        let json = JSON.parse(data)
        json.push(newData)
        console.log(json);

        fs.writeFile("data.json", JSON.stringify(json), (err) => {
            if (err) {
                console.log('error in write')
                res.send('error in write')
            }
        })
    })
    res.send('User data in saved in json successfully')
})

//delete a user
app.delete('/user/delete/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('data.json', function (err, data) {
        let json = JSON.parse(data)
        const deleteUser = json.filter(user => user.id != id)
        fs.writeFile("data.json", JSON.stringify(deleteUser), (err) => {
            if (err) {
                console.log('error in write')
            }
            res.send(`${id} no Id is deleted successfully`)
        })
    })
})

//update a user
app.patch('/user/update/:id', (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    fs.readFile('data.json', function (err, data) {
        let json = JSON.parse(data)
        console.log(json[id], 'from out')
        let updateUser = json.filter(user => user.id != id)
        updateUser.push(updateData)
        console.log(updateUser)
        fs.writeFile("data.json", JSON.stringify(updateUser), (err) => {
            if (err) {
                console.log('error in write')
            }
            res.send(`${id} no Id is updated successfully`)
        })
    })
})


app.get('/', async (req, res) => {
    res.send(`<h1>Random user server is running</h1> 
    <h3>Get all user data use this end of the url ► <a href="https://randomuserapinodejs.herokuapp.com/all"> https://randomuserapinodejs.herokuapp.com/all</a></h3>
    <h3>Get a random user data use this end of the url ► /user/random</h3>
    <h3>For save user use this end of the url ► /user/save</h3>
    <h3>For delete a single user by id use this ► /user/delete/1</h3>
    <h3>For update a user data use this end of the url ► /user/update/:id</h3>
    `);
})

app.listen(port, () => {
    console.log(`Random user generator listening at ${port}`)
})