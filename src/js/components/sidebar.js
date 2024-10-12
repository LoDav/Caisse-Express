export default {
    data(){
        return{

        }
    },
    methods:{
        switchMenu(menuToGo){
            this.$emit("changeMenu", menuToGo)
        }
    },
    template: `
        <div class="nav">
            <h1 style="color: #6A9C89; text-align: center;">*Caisse Express</h1>
            <br>
            <br>
            <br>
            <br>
            <br>
            <ul class="nav-item">
                <li><a href="#" @click="switchMenu('Article')">Article</a></li>
                <li class="active" @click="switchMenu('Vente')"><a href="#">Vendre</a></li>
                <li><a href="#" @click="switchMenu('Activite')">Activité</a></li>
                <li><a href="#">Paramètre</a></li>
            </ul>
        </div>
    `
};
