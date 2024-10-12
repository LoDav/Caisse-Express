import { createApp} from "../libs/vue.import.js";
import Vente from "./components/ventes.js"
import Sidebar from './components/sidebar.js'
import Activite from './components/activite.js'
createApp({
    data(){
        return{
            count : 50,
            is_seen:'Vente'
        }
    },
    methods:{
        changeMenu(data){
            this.is_seen = data
        }
    },
    components: {
        Vente,
        Sidebar,
        Activite
      },
}).mount("#app");
