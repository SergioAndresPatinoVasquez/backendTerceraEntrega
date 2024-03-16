import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cartId:{
        //se define la referencia a la colección de carts
        type:[
            {
                cart : {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts'
                }
            }
        ],
        default:[]
    },
    role : {
        type: String,
        default: 'USER' //para todos los usuarios normales excepto el admin
    },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ],
        default: []
    },
    last_connection: {
        type: Date,
    }

});

usersSchema.plugin(mongoosePaginate);
usersSchema.pre('find', function(){
    this.populate('cartId.cart');
});


const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;