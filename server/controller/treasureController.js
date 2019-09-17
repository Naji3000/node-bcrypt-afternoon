
module.exports = {

    dragonTreasure: async (req, res) => {
        const treasure = await req.app.get('db').get_dragon_treasure(1);
        return res.status(200).json(treasure)
    },

    getUserTreasure: async (req, res) => {
        const userTreasure = await req.app.get('db').get_user_treasure([req.session.user.id])
        return res.status(200).json(userTreasure)
    }, 

    addUserTreasure: async (req, res) => {
        const {treasureURL} = req.body
        const {id} = req.session.user
        const userTreasure = await req.app.get('db').add_user_treasure([treasureURL, id])

        return res.status(200).json(userTreasure)
    }, 

    getAllTreasure: async (req, res) => {
        const allTreasure = await req.app.get('db').get_all_treasure()
        return res.status(200).json(allTreasure)
    }
}