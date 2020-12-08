const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const livreModel = require('./models/livre.model');
const multer = require('multer');

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

router.get('/', (requete, reponse) => {
  reponse.render('accueil.html.twig')
})

// Affichage détaillé des livres
router.get('/livres', (requete, reponse) => {
  livreModel
    .find()
    .exec()
    .then((livres) => {
      reponse.render('livres/liste.html.twig', { liste: livres, message: reponse.locals.message })
    })
    .catch();
});

// Affichage détaillé d'un livre
router.get('/livres/:id', (requete, reponse) => {
  livreModel.findById(requete.params.id)
    .exec()
    .then((livre) => {
      reponse.render('livres/livre.html.twig', { livre: livre, isModification: false })
    })
    .catch(error => console.log(error));
});

// Ajout d'un livre
router.post('/livres', upload.single('image'), (requete, reponse) => {
  const livre = new livreModel ({
    _id: new mongoose.Types.ObjectId(),
    nom: requete.body.titre,
    auteur: requete.body.auteur,
    pages: requete.body.pages,
    description: requete.body.description,
  });
  livre.save()
    .then(resultat => {
      console.log(resultat);
      reponse.redirect('/livres');
    });
    console.log(livre);
});

// Suppression d'un livre
router.post('/livres/delete/:id', (requete, reponse) => {
  livreModel.remove({ _id: requete.params.id })
    .exec()
    .then(resultat => {
      requete.session.message = {
        type: 'success',
        content: "Suppression effectuée",
      };
      reponse.redirect('/livres');
    })
    .catch(error => console.log(error));
});

// Modification d'un livre
router.get('/livres/modification/:id', (requete, reponse) => {
  livreModel.findById(requete.params.id)
    .exec()
    .then((livre) => {
      reponse.render('livres/livre.html.twig', { livre: livre, isModification: true})
    })
    .catch(error => console.log(error));
});

router.post("/livres/modificationServer", (requete, reponse) => {
  const livreUpdate = {
    nom: requete.body.titre,
    auteur: requete.body.auteur,
    pages: requete.body.pages,
    description: requete.body.description,
  };
  livreModel.update({_id: requete.body.id}, livreUpdate)
    .exec()
    .then(resultat => {
      if(resultat.nModified < 1) throw new Error("Requête de modification échouée");
      requete.session.message = {
        type: 'success',
        content: 'Modification effectuée'
      };
      reponse.redirect('/livres');
    })
    .catch(error => {
      requete.session.message = {
        type: 'danger',
        content: error.message,
      };
      reponse.redirect('/livres');
    })
})

// Gérer l'error 404
router.use((requete, reponse, suite) => {
  const error = new Error("Page non trouvée");
  error.status = 404;
  suite(error); //envoi à la route ci-dessous avec "error" générée
});

router.use((error, requete, reponse) => {
  error.status(error.status || 500);
  reponse.end(error.message);
});

module.exports = router