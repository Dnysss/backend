const Card = require('../models/Card');
const ObjectId = require('mongoose').Types.ObjectId;

//helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');


module.exports = class CardController {
    //create card
    static async create(req, res) {
        const {name, category} = req.body;


        //Validations
        if(!name) {
            res.status(422).json({message: "O nome do card é obrigatório!"});
            return;
        }

        if(!category) {
            res.status(422).json({message: "Este campo é obrigatório!"});
            return;
        }

        //get user
        const token = getToken(req);
        const user = await getUserByToken(token);

        //add card
        const card = new Card({
            name,
            category,
            user: {
                _id: user._id,
            }
        })

        try {
            const newCard = await card.save();
            res.status(201).json({message: "Card criado com sucesso!", newCard,})
        } catch (err) {
            res.status(500).json({message: err});
        }
    }

    static async getAllUserCards(req, res) {

        //get user from token
        const token = getToken(req);
        const user = await getUserByToken(token);

        const cards = await Card.find({'user._id': user._id}).sort('-createdAt');

        res.status(200).json({cards,})
    }

    static async getCardById(req, res) {

        const id = req.params.id;

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id inválido."});
            return;
        }

        //check id card
        const card = await Card.findOne({_id: id});

        if(!card) {
            res.status(404).json({message: "Card não encontrado."});
            return;
        }

        res.status(200).json({
            card: card,
        })
    }

    static async removeCardById(req, res) {

        const id = req.params.id;

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id inválido."});
            return;
        }

        const card = await Card.findOne({_id: id});

        if(!card) {
            res.status(404).json({message: "Card não encontrado."});
            return;
        }

        //check if logged
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(card.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: "Houve um problema em processar a sua solicitação. Tente novamente mais tarde!"});
            return;
        }

        await Card.findByIdAndRemove(id);

        res.status(200).json({message: "Card removido com sucesso!"});

    }

    static async updateCard(req,res) {

        const id = req.params.id;

        const { name, category } = req.body;

        const updatedData = {};

        //check card exists
        const card = await Card.findOne({_id: id});

        if(!card) {
            res.status(404).json({message: "Card não encontrado."});
            return;
        }

        //check if logged
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(card.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: "Houve um problema em processar a sua solicitação. Tente novamente mais tarde!"});
            return;
        }

        //Validations
        if(!name) {
            res.status(422).json({message: "O nome do card é obrigatório!"});
            return;
        } else {
            updatedData.name = name;
        }

        if(!category) {
            res.status(422).json({message: "Este campo é obrigatório!"});
            return;
        } else {
            updatedData.category = category;
        }

        await Card.findByIdAndUpdate(id, updatedData);

        res.status(200).json({message: "Card atualizado com sucesso!"});
    }
}
