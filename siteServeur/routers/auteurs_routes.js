const express = require('express');
const routerAuteur = express.Router();
const auteurController = require('../controllers/auteur_controller')

routerAuteur.get("/:id", auteurController.auteur_affichage);
routerAuteur.post("/", auteurController.auteur_ajout);
routerAuteur.get("/", auteurController.auteurs_affichage);
routerAuteur.post("/delete/:id", auteurController.auteur_delete);
routerAuteur.get("/modification/:id", auteurController.auteur_edit);
routerAuteur.post("/modificationServer", auteurController.auteur_update)

module.exports = routerAuteur;