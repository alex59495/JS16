const express = require('express');
const routerLivre = express.Router();
const multer = require('multer');

// Controllers
const livreController = require('../controllers/livre_controller')

const storage = multer.diskStorage({
  destination: (requete, file, callback) => {
    callback(null, "./public/images/");
  },
  filename: (request, file, callback) => {
    const date = new Date().toLocaleDateString().replace(/\//g,'');
    callback(null, date+"-"+Math.round(Math.random() * 1000)+"-"+file.originalname);
  }
});

const fileFilter = (requete, file, callback) => {
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(new Error("L'image n'est pas accepté"), false);
  }
}

const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
})

// Affichage détaillé des livres
routerLivre.get('/', livreController.livres_affichage);

// Affichage détaillé d'un livre
routerLivre.get('/:id', livreController.livre_affichage);

// Ajout d'un livre
routerLivre.post('', upload.single('image'), livreController.livre_ajout);

// Suppression d'un livre
routerLivre.post('/delete/:id', livreController.livre_suppression);

// Modification d'un livre
routerLivre.get('/modification/:id', livreController.livre_modification);

routerLivre.post("/modificationServer", livreController.livre_modification_server)

// Modification Image
routerLivre.post('/updateImage', upload.single('image'), livreController.update_image);

module.exports = routerLivre