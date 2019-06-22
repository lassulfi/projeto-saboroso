var connection = require('./db');
var Pagination = require('./pagination');
var moment = require('moment');

module.exports = {
    render(req, res, error, success) {
        res.render('reservations', 
            {
                title: 'Reservas - Restaurante Saboroso!', 
                background: 'images/img_bg_2.jpg',
                headerTitle: 'Reserve uma Mesa!',
                body: req.body,
                error,
                success
            }
        );
    },
    save(fields) {

        if(fields.date.indexOf('/') > -1) {
            let date = fields.date.split('/');
            fields.date = `${date[2]}-${date[1]}-${date[0]}`;
        }

        let query, params = [fields.name, fields.email, fields.people, fields.date, fields.time];

        if(parseInt(fields.id) > 0) {
            query = `UPDATE tb_reservations SET name = ?, email = ?, people = ?, date = ?, time = ? WHERE id = ?`;
            params.push(fields.id);
        } else {
            query = `INSERT INTO tb_reservations(name, email, people, date, time) VALUES (?, ?, ?, ?, ?)`;
        }

        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, result) => {
                if(err) {
                    reject(err); 
                } else {
                    resolve(result);
                }

            });    
        });
    },
    getReservations(req) {
        return new Promise((resolve, reject) => {
            let page = req.query.page;
            
            if(!page) page = 1;

            let params = [];
            let dateStart = req.query.start;
            let dateEnd = req.query.end;
            if(dateStart && dateEnd) params.push(dateStart, dateEnd);

            let pagination = new Pagination(`SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations 
                ${(dateStart && dateEnd) ? 'WHERE date BETWEEN ? AND ?' : ''}
                ORDER BY date DESC LIMIT ? , ?`, params);

            pagination.getPage(page).then(data => {
                resolve({
                    data,
                    links: pagination.getNavigation(req.query)
                });
            });
        });
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM tb_reservations WHERE id = ?`, 
                [id], 
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
        });
    },
    getChartData(req) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT 
                CONCAT(YEAR(date), '-', MONTH(date)) AS date, 
                COUNT(*) AS total, 
                SUM(people) / COUNT(*) AS avg_people 
                FROM tb_reservations WHERE 
                    date BETWEEN ? AND ? 
                GROUP BY YEAR(date), MONTH(date) 
                ORDER BY YEAR(date) DESC, MONTH(date) DESC;`, 
                [req.query.start, req.query.end], 
                (err, results) => {
                    if (err) { reject(err); 
                    } else {
                        let months = [], values = [];
                        results.forEach(row => {
                            months.push(moment(row.date).format('MMM YYYY'));
                            values.push(row.total);
                        });
                        resolve({
                            months,
                            values
                        });
                    }
                })
        })
    }
}