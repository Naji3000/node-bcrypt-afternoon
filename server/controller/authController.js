const bcrypt = require('bcryptjs')

module.exports = {

    register: async (req, res) => {
        const {username, password, isAdmin} = req.body
        const dbInstance = req.app.get('db')
        const result = await dbInstance.get_user([username])
        const existingUser = result[0];
        if(existingUser) {
            return res.status(409).json('Username Already Taken')
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)
        const registeredUser = await dbInstance.register_user([isAdmin,username,hash])
        const user = registeredUser[0]

        req.session.user = { 
            isAdmin: user.is_admin, 
            username: user.username,
            id: user.id
        }
        return res.status(201).json(req.session.user)


    },

    login: async (req, res) => {
        const {username, password} = req.body
        const foundUser = await req.app.get('db').get_user([username])
        const user = foundUser[0]
        if(!user) {
            return res.status(401).json('User not found. Please register as a new user before logging in')
        }
            const isAuthenticated = bcrypt.compareSync(password, user.hash)
            if(!isAuthenticated){
                return res.status(403).json('Incorrect Password')
            } 
            req.session.user = {
                    isAdmin: user.is_admin, 
                    id: user.id,
                    username: user.username,
                }
                return res.json(req.session.user)
    },

    logout: (req, res) => {
        req.session.destroy()
        return res.sendStatus(200)
        
    }
}