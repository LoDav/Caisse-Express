export default{
    data(){
        return{
            res:[],
            date:this.getNowDate(),
            total:0
        }
    },
    mounted(){
        window.Api.getVentByDate(this.date).then((responses)=>{
            for(let response of responses){
                this.res.push(response)
                console.log(response);
            }    
        })
    },
    methods:{
        formatterEnMonnaie(nombre) {
            return new Intl.NumberFormat("fr-FR", {
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(nombre);
        },
        changeDate(){
            console.log(this.date)
            this.total = 0
            window.Api.getVentByDate(this.date).then((responses)=>{
                this.res = []
                for(let response of responses){
                    this.res.push(response)
                    this.total += response.total
                    console.log(response);
                }    
            })
        },
        printDailyRepport(){
            window.print()
            document.title='My new title';
            return false;
        },
        getNowDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
            const day = String(today.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        },
        Majuscule(chaine) {
            if (!chaine) return ""; // Vérifie si la chaîne est vide
            return chaine.charAt(0).toUpperCase() + chaine.slice(1);
        }
    },
    template:`
        <div class="animate__animated animate__fadeIn">
            <article>
                <h3>RAPPORT QUOTIDIEN DES VENTES DU {{date}} </h3>
                <div style="float:right;">
                    <h3>Total du jour : {{formatterEnMonnaie(total)}} Fc</h3>
                </div>
            </article>
            <div class="inputSection">
                <input type="date" 
                    placeholder="date" 
                    v-model = "date" 
                    @change="changeDate()">
                    <button @click="printDailyRepport()">imprimer</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Produits</th>
                            <th>Quantité vendu</th>
                            <th>Prix unitaire</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for = "response of res">
                            <td>{{Majuscule(response.designation)}}</td>
                            <td>{{response.qte_vendu}}</td>
                            <td>{{formatterEnMonnaie(response.prix_unitaire)}} Fc</td>
                            <td>{{formatterEnMonnaie(response.total)}} Fc</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
}