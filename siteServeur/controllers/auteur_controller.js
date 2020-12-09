const auteurModel = require('../models/auteur_model');
const mongoose = require('mongoose');
const fs = require('fs');
const livreModel = require('../models/livre_model')


// Afficher un auteur
exports.auteur_affichage = (requete, reponse) => {
  auteurModel.findById(requete.params.id)
    .populate('livres')
    .exec()
    .then(auteur => {
      console.log(auteur)
      reponse.render('auteurs/auteur.html.twig', {auteur: auteur})
    })
    .catch(error => console.log(error));
};

// Afficher la liste des auteurs
exports.auteurs_affichage = (requete, reponse) => {
  auteurModel.find()
    .populate('livres')
    .exec()
    .then(auteurs => {
      reponse.render('auteurs/liste.html.twig', {auteurs: auteurs, isModification: false})
    })
    .catch(error => {
      console.log(error)
    })
};

// Ajouter un auteur
exports.auteur_ajout = (requete, reponse) => {
  const auteur = new auteurModel({
    _id: new mongoose.Types.ObjectId,
    nom: requete.body.nom,
    prenom: requete.body.prenom,
    age: requete.body.age,
    sexe: (requete.body.sexe) ? true : false,
  });
  auteur.save()
    .then(resutlat => {
      reponse.redirect('/auteurs');
    })
    .catch(error => console.log(error));
};

// Supprimer un auteur
exports.auteur_delete = (requete, reponse) => {
  auteurModel.find()
    .where("nom").equals("anonyme")
    .exec()
    .then(auteur => {
      livreModel
      .updateMany({"auteur": requete.params.id}, {"$set": {"auteur": auteur[0]._id}}, {"multi": true})
      .exec()
      .then(
        auteurModel.remove({_id: requete.params.id})
          .where('nom').ne('anonyme') //ne = not equals
          .exec()
          .then(reponse.redirect('/auteurs'))
          .catch(error => console.log(error))
      )
      .catch(error => console.log(error))
    });
};


// Modifier un auteur
exports.auteur_edit = (requete, reponse) => {
  auteurModel.findById(requete.params.id)
    .populate('livres')
    .exec()
    .then(auteur => {
      console.log(auteur)
      reponse.render('auteurs/auteur.html.twig', {auteur: auteur, isModification: true})
    })
    .catch(error => console.log(error));
}

exports.auteur_update = (requete, reponse) => {
  const auteurUpdate = {
    nom: requete.body.nom,
    prenom: requete.body.prenom,
    age: requete.body.age,
    sexe: (requete.body.sexe) ? true : false,
  }
  auteurModel.update({_id: requete.body.id}, auteurUpdate)
    .exec()
    .then(resultat => {
      reponse.redirect('/auteurs')
    })
    .catch(error => console.log(error))
}