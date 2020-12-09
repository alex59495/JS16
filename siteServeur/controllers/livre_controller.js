const livreModel = require('../models/livre_model');
const auteurModel = require('../models/auteur_model');
const mongoose = require('mongoose');
const fs = require('fs');

exports.livres_affichage = (requete, reponse) => {
  auteurModel.find()
    .exec()
    .then(auteurs => {
      livreModel
        .find()
        .populate("auteur")
        .exec()
        .then((livres) => {
          reponse.render('livres/liste.html.twig', { 
            liste: livres, 
            message: reponse.locals.message,
            auteurs: auteurs,
           })
        })
        .catch(error => console.log(error));
    }).catch(error => console.log(error));
}

exports.livre_affichage = (requete, reponse) => {
  livreModel.findById(requete.params.id)
    .populate('auteur')
    .exec()
    .then((livre) => {
      reponse.render('livres/livre.html.twig', { livre: livre, isModification: false })
    })
    .catch(error => console.log(error));
}


exports.livre_ajout = (requete, reponse) => {
  const livre = new livreModel ({
    _id: new mongoose.Types.ObjectId(),
    nom: requete.body.titre,
    auteur: requete.body.auteur,
    pages: requete.body.pages,
    description: requete.body.description,
    image: requete.file.path.substring(14) //Delete the 14 first element (public/images)
  });
  livre.save()
    .then(resultat => {
      console.log(resultat);
      reponse.redirect('/livres');
    });
    console.log(livre);
}

exports.livre_suppression = (requete, reponse) => {
  const livre = livreModel.findById(requete.params.id)
    .select('image')
    .exec()
    .then(livre => {
      fs.unlink(`./public/images/${livre.image}`, error => {
        console.log(error);
      })
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
    })
    .catch(error => console.log(error));
}

exports.livre_modification = (requete, reponse) => {
  auteurModel.find()
    .then(auteurs => {
      livreModel.findById(requete.params.id)
      .populate('auteur')
      .exec()
      .then((livre) => {
        reponse.render('livres/livre.html.twig', { livre: livre, isModification: true, auteurs: auteurs})
      })
      .catch(error => console.log(error));
    }).catch(error => console.log(error))
}

exports.livre_modification_server = (requete, reponse) => {
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
}

exports.update_image = (requete, reponse) => {
  const livre = livreModel.findById(requete.body.id)
    .select('image')
    .exec()
    .then(livre => {
      fs.unlink(`./public/images/${livre.image}`, error => {
        console.log(error);
      })

      const livreUpdate = {
        image: requete.file.path.substring(14)
      };
      livreModel.update({_id: requete.body.id}, livreUpdate)
        .exec()
        .then(resultat => {
          reponse.redirect(`/livres/modification/${requete.body.id}`)
        })
        .catch(error => {
          console.log(error);
        })
    });
}