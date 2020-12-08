const l1 = {
  nom: "L'algorithmique selon H2PROG",
  auteur: "Matthier GASTON",
  pages: 200,
}

const l2 = {
  nom: "La france du 19ème",
  auteur: "Alber PATRICK",
  pages: 500,
}

const l3 = {
  nom: "Le monde des animaux",
  auteur: "Marc MERLIN",
  pages: 250,
}

const l4 = {
  nom: "Le virus d'Asie",
  auteur: "Tya MILO",
  pages: 120,
}


const afficherLivre = () => {
  const tableauLivres = document.querySelector('tbody')
  let livres = ''
  biblio.forEach((livre, index) => {
    livres += `<tr>
                  <td>${livre.nom}</td>
                  <td>${livre.auteur}</td>
                  <td>${livre.pages}</td>
                  <td><button onClick='afficherFormModification(${index})' class="btn btn-warning">Modifier</button></td>
                  <td><button onClick='supprimerLivre(${index})' class="btn btn-danger">Supprimer</button></td>
                </tr>`
  })
  tableauLivres.innerHTML = livres;
}


const biblio = [l1,l2,l3,l4]
afficherLivre();

const table = document.getElementById('tableauLivre')



const ajoutFormulaire = () => {
  document.getElementById('ajoutForm').removeAttribute('class');
  document.querySelector('#modifLivre').classList.add('d-none');
}

document.querySelector('#validationFormAjout').addEventListener('click', (event) => {
  event.preventDefault();
  const titre = document.querySelector('#ajoutForm #titre').value;
  const auteur = document.querySelector('#ajoutForm #auteur').value;
  const pages = document.querySelector('#ajoutForm #pages').value;
  ajoutLivre(titre, auteur, pages);
  document.querySelector('#ajoutForm').reset();
  document.querySelector('#ajoutForm').classList.add('d-none');
})

const ajoutLivre = (titre, auteur, pages) => {
  const livre = {
    nom: titre,
    auteur: auteur,
    pages: pages,
  };
  biblio.push(livre);
  afficherLivre();
}

const supprimerLivre = (position) => {
  if(confirm('Voulez-vous vraiment supprimer?')){
    biblio.splice(position, 1);
  }
  afficherLivre();
}

const afficherFormModification = (position) => {
  document.querySelector('#ajoutForm').classList.add('d-none');
  document.getElementById('modifLivre').removeAttribute('class');
  document.querySelector('#modifLivre #titre').value = biblio[position].nom;
  document.querySelector('#modifLivre #auteur').value = biblio[position].auteur;
  document.querySelector('#modifLivre #pages').value = biblio[position].pages;
  document.querySelector('#modifLivre #idModif').value = position;
}

document.querySelector('#validationFormModif').addEventListener('click', (e) => {
  e.preventDefault();
  titre = document.querySelector('#modifLivre #titre').value;
  auteur = document.querySelector('#modifLivre #auteur').value;
  pages= document.querySelector('#modifLivre #pages').value;
  position = document.querySelector('#modifLivre #idModif').value;
  biblio[position] = {
    nom: titre,
    auteur: auteur,
    pages: pages
  };
  afficherLivre();
})