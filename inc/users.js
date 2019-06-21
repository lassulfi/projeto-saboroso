var connection = require('./db');

module.exports = {
    render(req, res, error) {
        res.render('admin/login', {
            body: req.body,
            error
        });
    },
    login(email, password) {
        console.log('LOGIN', email, password);
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tb_users WHERE email = ?', [
                email
            ], (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    if(!results.length > 0){
                        reject("Usuário ou senha incorretos");
                    } else {
                        let row = results[0];
                        if(row.password !== password) {
                            reject("Usuário ou senha incorretos");
                        } else {
                            resolve(row);
                        }
                    }
                }
            });
        });
    },
    getUsers() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM tb_users ORDER BY id`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });
    },
    save(fields) {
        let query, params = [fields.name, fields.email];

        if(parseInt(fields.id) > 0){
            query = `UPDATE tb_users SET name = ?, email = ? WHERE id = ?`;
            params.push(fields.id);
        } else {
            query = `INSERT INTO tb_users (name, email, password) VALUES (?, ?, ?)`;
            params.push(field.password);
        }

        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });   
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM tb_users WHERE id = ?`, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
};