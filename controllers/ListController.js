const List = require('../models/List');
const ObjectId = require('mongoose').Types.ObjectId;

//helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');


module.exports = class ListController {
    //create card
    static async create(req, res) {
        const {name, description} = req.body;

        //Validations
        if(!name) {
            res.status(422).json({message: "Este campo é obrigatório!"});
            return;
        }

        if(!description) {
            res.status(422).json({message: "A descrição é obrigatória!"});
            return;
        }

        //get user from token
        const token = getToken(req);
        const user = await getUserByToken(token);

        //add card
        const list = new List({
            name,
            description,
            user: {
                _id: user._id,
            }
        })

        try {
            const newList = await list.save();
            res.status(201).json({message: "Adicionado ao card com sucesso!", newList,})
        } catch (err) {
            res.status(500).json({message: err});
        }
    }

    static async getAllUserCards(req, res) {

        //get user from token
        const token = getToken(req);
        const user = await getUserByToken(token);

        const lists = await List.find({'user._id': user._id}).sort('-createdAt');

        res.status(200).json({lists,})
    }

    static async removeListById(req, res) {

        const id = req.params.id;

        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: "Id inválido."});
            return;
        }

        const list = await List.findOne({_id: id});

        if(!list) {
            res.status(404).json({message: "Task não encontrada."});
            return;
        }

        //check if logged
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(list.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: "Houve um problema em processar a sua solicitação. Tente novamente mais tarde!"});
            return;
        }

        await List.findByIdAndRemove(id);

        res.status(200).json({message: "Task removida com sucesso!"});
    }

    static async updateList(req, res){

        const id = req.params.id;

        const { name, description } = req.body;

        const updatedData = {};

        const list = await List.findOne({_id: id});

        if(!list) {
            res.status(404).json({message: "Task não encontrada."});
            return;
        }

        //check if logged
        const token = getToken(req);
        const user = await getUserByToken(token);

        if(list.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: "Houve um problema em processar a sua solicitação. Tente novamente mais tarde!"});
            return;
        }

        //Validations
        if(!name) {
            res.status(422).json({message: "Este campo é obrigatório!"});
            return;
        } else {
            updatedData.name = name;
        }

        if(!description) {
            res.status(422).json({message: "A descrição é obrigatória!"});
            return;
        } else {
            updatedData.description = description;
        }

        await List.findByIdAndUpdate(id, updatedData);
        
        res.status(200).json({message: "Task atualizada com sucesso!"});
    }
}
