const { contextBridge } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Chemin vers votre base de données SQLite
const dbPath = path.join(__dirname, "/database/pytchounette.db");
let db;

function openDatabase() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(
                "Erreur lors de l'ouverture de la base de données:",
                err.message
            );
        } else {
            console.log("Base de données SQLite ouverte avec succès.");
        }
    });
}

const getAllVente = async () => {
    return new Promise((resolve, reject) => {
        const request = "select * from produit";
        db.all(request, (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

const addVente = (num_ref, qte_vendu) => {
    let request = `insert into vente (date, num_ref, qte_vendu) values(CURRENT_DATE,'${num_ref}','${qte_vendu}')`;
    try{
        db.exec(request);
        console.log("1 row affected");
    }catch(err){
        console.error("Erreur lors de l'exécution de la requête : ", err);
        throw new Error("Échec de l'exécution de la requête SQL");
    }
};


const VenteController = {
    getVentByDate(date){
        console.log(date)
        return new Promise((resolve, reject) => {
            const request = `
            select 
                produit.designation, 
                vente.qte_vendu,
                produit.prix_unitaire,
                produit.prix_unitaire*vente.Qte_vendu as total 
            from 
                vente,produit 
                where vente.num_ref = produit.num_ref and vente.date = '${date}'`;
            
            console.log(request)
            db.all(request, (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }
}

openDatabase();

contextBridge.exposeInMainWorld("Api", {
    getAllVente: getAllVente,
    addVente: addVente,
    getVentByDate:VenteController.getVentByDate
});
