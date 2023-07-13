const mongoose = require('mongoose');
const { Schema } = mongoose;

const Card = mongoose.model(
    'Card',
    new Schema(
        {
            name: {
                type: String,
                required: true
            },
            category: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            user: Object,
        }, {timestamps: true}
    )
)

module.exports = Card;
