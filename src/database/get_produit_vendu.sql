select 
    produit.designation,
    vente.qte_vendu,
    produit.prix_unitaire,
    produit.prix_unitaire*vente.Qte_vendu as total 
from 
    vente,produit 
where 
    vente.num_ref = produit.num_ref and vente.date = CURRENT_DATE