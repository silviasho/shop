const price = async(cart) => {
    try {

        var total = 0;
        for (var i = 0; i < cart.length; i++) {
            total = total + cart[i].price;
        }
        return total
    } catch (error) {
        return error;
    }
};

module.exports = { price };