module.exports = function(app){

    // Principal page for select products
    app.get('/cart', function(req, res){
        Product.count({}, function(err, cntproducts){
            Product.find({}, {}, {sort: {name:1}}, function(err, products){
                res.render('index', {cntproducts: cntproducts, products:products, idcart:111, cartobj:null});
            });
        });
    });

    app.get('/cart/:cart', function(req, res){
        var prt = req.cart.products;
        var except = prt.map(function(e){ return(e.product._id)});
        Product.count({_id: {$nin:except}}, function(err, cntproducts){
            Product.find({_id: {$nin:except}}, {}, {sort: {name:1}}, function(err, products){
                res.render('index', {cntproducts: cntproducts, products:products, cartobj:req.cart, idcart:req.cart.id, pic:prt.length, pdsincart:req.cart.products});
            });
        });
    });

    // load Products
    app.get('/load', function(req, res){
        res.render('new-product');
    });
    app.post('/new-prdt', function(req, res){
        var b = req.body

        var product = new Product({
            name: b.name,
            price: b.price,
            stock: b.amount
        });

        product.save(function(err, p){
            if(err) console.log(err)
            res.redirect('/cart')
        });
    });

    // load products to cart
    app.post('/add', function(req, res){
        var b = req.body
        if(b.cart === '111'){
            Product.findOne({_id: b.product}, function(err, prod){
                console.log(prod)
                if(prod){
                    var pri = prod.price * b.amount
                    var cart = new Cart({
                        products:[{
                            product: prod,
                            amount: b.amount,
                            price:pri
                        }],
                        totalprice: pri
                    });
                    cart.save(function(err, cart){
                        var am = parseInt(b.amount);
                        am = prod.stock - am;
                        Product.update(
                            {_id:b.product},
                            {
                                stock:am
                            },
                            function(err){
                                if(err) console.log(err);
                                res.redirect('/cart/'+cart.id);
                            }
                        );

                    });
                }
            });


        }else{
            Cart.findOne({_id: b.cart}, function(err, crt){
                var total = crt.totalprice;
                var px = crt.products;

                Product.findOne({_id: b.product}, function(err, prd){
                    var amop = parseInt(b.amount);
                    var prixx = prd.price * amop
                    var nprd = new Object({
                        product: prd,
                        amount: amop,
                        price: prixx
                    });
                    px.push(nprd);
                    total = total + prixx;
                    Cart.update(
                        {_id: b.cart},
                        {
                            products:px,
                            totalprice:total
                        },
                        function(err){
                            if(err) console.log(err)
                            var pst = prd.stock - amop
                            Product.update(
                                {_id: prd._id},
                                {
                                    stock:pst
                                },
                                function(err){
                                    if(err) console.log(err)
                                    res.redirect('/cart/'+crt.id);
                                }
                            )

                        }
                    )


                });
            });

        }
    });


    //remove items from cart
    app.get('/remove/:cart/:product', function(req, res){
        var items = req.cart.products;
        var itemsnew = [];
        var c = 0;
        var stocknew = req.product.stock;
        var restprice = 0;
        while(items.length > c){
            if(items[c].product._id != req.product.id){
                itemsnew.push(items[c]);
            }else{
                stocknew=stocknew + items[c].amount
                restprice = items[c].price
            }
            c++
        }
        Product.update(
            {_id:req.product.id},
            {
                stock:stocknew
            },
            function(err){
                if(err) console.log(err);
                var newtotalpri = req.cart.totalprice - restprice
                Cart.update(
                    {_id:req.cart.id},
                    {
                        products: itemsnew,
                        totalprice: newtotalpri
                    },
                    function(err){
                        if(err) console.log(err)
                        res.redirect('/cart/'+req.cart.id);
                    }
                )
            }
        );

    });


    // remove all items from cart
    app.get('/removeall/:cart', function(req, res){
        var items = req.cart.products;
        var c = 0;
        Cart.update(
            {_id:req.cart.id},
            {
                products:[],
                totalprice:0
            },
            function(err){
                if(err) console.log(err);
                while(items.length > c){
                    var item = items[c].product._id;
                    var cartstock = items[c].amount;

                    Product.findOne({_id:item}, function(err, prd){
                        prd.stock = prd.stock + cartstock;
                        prd.save(function(err){
                            if(err) console.log(err);

                        });
                    });
                    c++
                }
                res.redirect('/cart/'+req.cart.id);

            }
        );
    });

    //done shopping
    app.get('/sale', function(req, res){
        res.render('success-sale')
    });


    //params
    app.param('cart', function(req, res, next, id){
        Cart.findOne({_id:id}, function(err, p){
            req.cart = p;
            next();
        });
    });
    app.param('product', function(req, res, next, id){
        Product.findOne({_id:id}, function(err, x){
            req.product = x;
            next();
        });
    });


}