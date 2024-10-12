export default {
    data() {
        return {
            articles: [],
            panier: [],
            total_global: 0,
            showPopUp: false,
            produit: "",
            Qte: "",
        };
    },
    mounted() {
        window.Api.getAllVente().then((produits) => {
            this.articles = produits;
        });
    },
    methods: {
        addOnPanier(data, Qte) {
            if (data === "" || Qte === "") {
                alert("veillez selectionner un produit");
            } else if (Qte <= 0) {
                alert("La quantité peut pas etre inferieur ou égal à 0");
            } else {
                for (let article of this.articles) {
                    if (
                        article.designation.toLowerCase() === data.toLowerCase()
                    ) {
                        data = article;
                        console.log(data);
                        let total = data.prix_unitaire * this.Qte;
                        this.panier.push({
                            produitID: data.num_ref,
                            nom: data.designation,
                            quantite: this.Qte,
                            prix: data.prix_unitaire,
                            total: total,
                        });
                        this.total_global = this.total_global + total;
                        this.produit = "";
                        this.Qte = "";
                        return;
                    }
                }
            }
        },
        formatterEnMonnaie(nombre) {
            return new Intl.NumberFormat("fr-FR", {
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(nombre);
        },
        mettrePremiereLettreEnMajuscule(chaine) {
            if (!chaine) return ""; // Vérifie si la chaîne est vide
            return chaine.charAt(0).toUpperCase() + chaine.slice(1);
        },
        enregistre() {
            this.printFacture()
            
        //    const panier_ = [...this.panier]
        //     console.log(panier_);
        //     if(panier_.length === 0){
        //         alert("Aucune valeur à Enregistre")
        //     }else{
        //         for(const element of panier_){
        //             window.Api.addVente(element.produitID,element.quantite)
        //         }
        //         this.panier = []
        //         this.total_global = 0
        //         alert("Enregistrement effectuer !!")
        //     }
        },
        supprimerElementParIndex(array, index) {
            const array_ = array[index]
            console.log(array_) 
            if (index > -1 && index < array.length) {
                array.splice(index, 1); // Supprime 1 élément à partir de l'index spécifié
                this.total_global =  this.total_global - array_.total
                console.log(this.total_global);
            } else {
                console.log("Index invalide");
            }
        },
        genererNumeroFacture() {
            const date = new Date();
            
            // Obtenez l'année, le mois, le jour, l'heure, les minutes et les secondes
            const annee = date.getFullYear();        // ex: 2024
            const mois = String(date.getMonth() + 1).padStart(2, '0'); // Ajoute un zéro si nécessaire
            const jour = String(date.getDate()).padStart(2, '0');
            const heure = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
            const seconde = String(date.getSeconds()).padStart(2, '0');
        
            // Générer une partie aléatoire pour plus d'unicité (par exemple, un nombre à 4 chiffres)
            const aleatoire = Math.floor(1000 + Math.random() * 9000); // Donne un nombre entre 1000 et 9999
        
            // Combinez la date, l'heure et le nombre aléatoire pour créer un numéro unique
            return `FACT-${annee}${mois}${jour}-${heure}${minute}${seconde}-${aleatoire}`;
        },
        printFacture(){
            let printWindow = window.open('', '', 'height=500, width=500');
            printWindow.document.open();
            printWindow.document.write(`
            <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Facture</title>
                    <style>
                        @media print {
                            @page {
                                    size: A5 landscape; /* auto is default portrait; */
                            }
                            body {
                                width: 60ch; /* Ch correspond à la largeur du caractère '0' */
                                font-family: monospace;
                                font-size: 12px; /* Ajustez selon la densité souhaitée */
                            }
                            .facture {
                                width: 60ch;
                                height: 20em; /* Adjust height for 20 lines */
                            }
                        }
                        .facture {
                            font-family: monospace;
                            white-space: pre; /* Important pour conserver l'espacement des caractères */
                        }
                    </style>
                </head>
                <body>
                    <div class="facture">
                
FACTURE N° `+this.generateFactureNumber()+`

Date: 03/10/2024
                        
Client: Jean Dupont
Adresse: 123 Rue de la Paix
Ville: Paris, France
                        
Produit          Qté   Prix Unitaire   Total
--------------------------------------------
Produit A         2      10,00 €        20,00 €
Produit B         1      25,00 €        25,00 €
Produit C         3       5,00 €        15,00 €
--------------------------------------------
                    Total à payer : 60,00 €


Merci pour votre achat!
                    </div>
                </body>
            </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    },
    template: `
    <div class="animate__animated animate__fadeIn">
        <br>
        <br>
        <h1>Vendre</h1>
        <div class="d-flex">
            <input type="text" list="cars" placeholder="Produits" v-model="produit" />
            <datalist id="cars">
                <option v-for="article of articles" :value="article.designation">{{formatterEnMonnaie(article.prix_unitaire)}} fc</option>
            </datalist>
            <input type="number" placeholder="Quantité" v-model="Qte">
            <button class="btn-save" @click="addOnPanier(produit,Qte)">Ajouter</button>
        </div>
        <div class="pop-article" v-if="showPopUp">
            <article v-for="article of articles" class="card">
                {{article.designation}} : {{article.prix_unitaire}}Fc
            </article>
        </div>
        <br>
        <br>
        <br>
        <div>
            <h1>Articles</h1>
            <div class="scrollable-container">
                <table>
                    <thead>
                        <tr>
                            <th>Produits</th>
                            <th>Quantité</th>
                            <th>Prix</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for ="item, index of panier" class="animate__animated animate__fadeInDown">
                            <td>{{mettrePremiereLettreEnMajuscule(item.nom)}}</td>
                            <td>{{item.quantite}}</td>
                            <td>{{formatterEnMonnaie(item.prix)}} fc</td>
                            <td>{{formatterEnMonnaie(item.total)}} fc</td>
                            <td>
                                <button class="btn_remove" @click="supprimerElementParIndex(panier, index)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <div class="tab-bottom">
                    <p>total general : <strong>{{formatterEnMonnaie(total_global) }} fc</strong></p>
                    <button class="btn-save" @click="enregistre()"> Enregistrer </button>
                </div>
            </div>
        </div>
    </div>
    `,
};