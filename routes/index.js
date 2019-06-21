var connection = require('./../inc/db');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var reservationsController = require('./../inc/controllers/reservations-controller');
var contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');
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
  contacts.render(req, res);
});

router.post('/contacts', function(req, res, next) {
  if(!req.body.name){
    contacts.render(req, res, "Campo nome obrigatório");
  } else if(!req.body.email){
    contacts.render(req, res, "Campo e-mail obrigatório");
  } else if(!req.body.message){
    contacts.render(req, res, "Campo mensagem obrigatório");
  } else {
    contacts.save(req.body).then(results => {
      req.body = {};
      contacts.render(req, res, null, "Seu contato foi enviado com sucesso!");
    }).catch(err => {
      contacts.render(req, res, err.message);
    });
  }
});

router.post('/subscribe', function(req, res, next) {
  if(!req.body.email) {
    res.send({
      error: "Campo e-mail obrigatório"
    });
  } else {
    emails.save(req.body).then(results => {
      res.send(results);
    }). catch(err => {
      res.send(err);
    })
  }
})

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
  if(reservationsController.validateFields(req.body)){
    reservations.render(req, res, reservationsController.validateFields(req.body));
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
