var connection = require('./../inc/db');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM tb_menus ORDER BY title', (err, results) => {
    if(err) console.log(err);
    
    res.render('index', 
      {
        title: 'Restaurante Saboroso!',
        menus: results
      }
    );
  });

});

router.get('/contacts', function(req, res, next) {
  res.render('contacts', 
    {
      title: 'Contato - Restaurante Saboroso!', 
      background: 'images/img_bg_3.jpg',
      headerTitle: 'Diga um oi!'
  }
  );
});

router.get('/menus', function(req, res, next) {
  res.render('menus', 
    {
      title: 'Menus - Restaurante Saboroso!', 
      background: 'images/img_bg_1.jpg',
      headerTitle: 'Saboreie nosso menu!'
    }
  );
});

router.get('/reservations', function(req, res, next) {
  res.render('reservations', 
    {
      title: 'Reservas - Restaurante Saboroso!', 
      background: 'images/img_bg_2.jpg',
      headerTitle: 'Reserve uma Mesa!'
    }
  );
});

router.get('/services', function(req, res, next) {
  res.render('services', 
    {
      title: 'Serviços - Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      headerTitle: 'É um prazer poder servir!'
    }
  );
});

module.exports = router;
