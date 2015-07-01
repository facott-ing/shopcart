var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    name: String,
    price: Number,
    stock: Number
});
Product = mongoose.model('Product', productSchema);


var cartSchema = mongoose.Schema({
    products:[{
        product: Object,
        amount: Number,
        price: Number
    }],
    totalprice: Number
});
Cart = mongoose.model('Cart', cartSchema);