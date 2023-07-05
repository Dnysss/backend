const mongoose = require('mongoose');
const { Schema } = mongoose;

const List = mongoose.model(
    'List',
    new Schema(
        {
            name: {
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

module.exports = List;
