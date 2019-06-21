var connection = require('./db');

module.exports = {
    save(fields) {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO tb_emails (email) VALUES (?)`, 
            [fields.email],
            (err, results) => {
                if(err) {
                    reject(err.message);
                } else {
                    resolve(results);
                }
            });
        });
    },
    getEmails() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM tb_emails ORDER BY email`, (err , results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM tb_emails WHERE id = ?`, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        })
    }
}