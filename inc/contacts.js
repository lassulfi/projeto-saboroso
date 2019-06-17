var connection = require('./db');

module.exports = {
    render(req, res, error, success){
        res.render('contacts', {
            title: 'Contato - Restaurante Saboroso!',
            background: 'images/img_bg_3.jpg',
            headerTitle: 'Diga um oi!',
            body: req.body,
            error,
            success
        });
    },
    save(fields){
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO tb_contacts (name, email, message) VALUES (?, ?, ?)", [
                fields.name,
                fields.email,
                fields.message
            ], (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}