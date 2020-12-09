const express = require('express');
const routerGlobal = express.Router();

routerGlobal.get('/', (requete, reponse) => {
  reponse.render('accueil.html.twig')
})
    

// Gérer l'error 404
routerGlobal.use((requete, reponse, suite) => {
  const error = new Error("Page non trouvée");
  error.status = 404;
  suite(error); //envoi à la route ci-dessous avec "error" générée
});

routerGlobal.use((error, requete, reponse) => {
  error.status(error.status || 500);
  reponse.end(error.message);
});

module.exports = routerGlobal