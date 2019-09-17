require('dotenv').config()
const express = require('express');
const app = express()
const session = require('express-session');
const massive = require('massive');
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const authController = require('./controller/authController')
const treasureController = require('./controller/treasureController')
const auth = require('./middleware/authMiddleware')

app.use(express.json())


massive(CONNECTION_STRING)
.then(dbInstance => {
    app.set("db", dbInstance)
    console.log("database connected")
})
.catch(error => console.log(error))

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
}))


app.post('/auth/register', authController.register)
app.post('/auth/login', authController.login)
app.get('/auth/logout', authController.logout)

app.get('/api/treasure/dragon', treasureController.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureController.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureController.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureController.getAllTreasure)

app.listen(4000, () => console.log('Listening on Port 4000'))
