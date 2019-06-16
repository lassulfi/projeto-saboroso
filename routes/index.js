var connection = require('./../inc/db');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  menus.getMenus().then(results => {
    res.render('index', 
      {
        title: 'Restaurante Saboroso!',
        menus: results,
        isHome: true
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
  menus.getMenus().then(results => {
    res.render('menus', 
      {
        title: 'Menus - Restaurante Saboroso!', 
        background: 'images/img_bg_1.jpg',
        headerTitle: 'Saboreie nosso menu!',
        menus: results
      }
    );
  });  
});

router.get('/reservations', function(req, res, next) {
  reservations.render(req, res);
});

router.post('/reservations', function(req, res, next) {
  if(!req.body.name){
    reservations.render(req, res, "Informe um nome");
  } else if(!req.body.email){
    reservations.render(req, res, "Informe um email");
  } else if(!req.body.people){
    reservations.render(req, res, "Informe o numero de pessoas");
  } else if(!req.body.date){
    reservations.render(req, res, "Informe uma data");
  } else if(!req.body.time){
    reservations.render(req, res, "Informe um horário");
  } else {
    reservations.save(req.body).then(results => {
      req.body = {};
      reservations.render(req, res, null, "Sua reserva foi efetuada com sucesso!");
    }).catch(err => {
      reservations.render(req, res, err.message);
    });
  }

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
