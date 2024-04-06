<template>
    <div class="flex justify-center items-center w-full ">
        <UCard class="mt-4 w-11/12 " :ui="{
            base: '',
            ring: '',
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: {
                padding: '',
                base: 'divide-y divide-gray-200 dark:divide-gray-700',
            },
        }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-xl align-text-bottom text-gray-900 dark:text-white">
                        Détail de la livraison
                    </h2>

                    <div>
                        <UButton @click="showModalAddDt" label="Add" class="mx-10" />
                    </div>
                    <div>
                        <ULink to="livraisons" type="button">
                            <UButton>Retour</UButton>
                        </ULink>
                    </div>
                </div>
            </template>
            <!-- Header and Action buttons -->
            <div class="flex justify-between p-4">
                <div class="flex text-gray-600">
                    <p class="pr-1 font-medium">Date:</p>
                    <p>{{ format(new Date(livraison.date), "dd MMM yyyy") }}</p>
                </div>
                <div class="flex text-gray-600">
                    <p class="pr-1 font-medium">Client:</p>
                    <p>{{ clientName}}</p>
                </div>
                       
            </div>
            <!---------------------------------table ---------------------->
            <UTable :columns="columns" :rows="dataTable" :ui="{
            tr: {
                base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 w-full table table-fixed',
                selected: 'bg-green-50 hover:bg-green-100',
            },
            thead: 'table table-fixed w-full',

            tbody: 'block w-full max-h-[200px] overflow-y-scroll',
        }">
                <template #actions-data="{ index, row }">
                   
                    <UButton class="mx-2" icon="i-heroicons-trash" size="2xs" color="red" variant="outline"
                        :ui="{ rounded: 'rounded-full' }" square @click="deleteDt(index)" />
                </template>
                <template>

                </template>
            </UTable>

        </UCard>
    </div>
</template>
<script setup lang="ts">
import type { Client, DT, Livraison } from '../utils/types'
import { format, parseISO } from "date-fns";
import "v-calendar/dist/style.css";

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const idLivraidon: string = route.query._id as unknown as string;
const idClient:string = route.query.client as string

let livraison: Livraison = reactive({
    date: new Date(),
    client: "",
    dts: [],
    lien: ""

})


let dataTable:DT[] = reactive([])

const clientName:Ref<string> = ref("")

    const refresh = ref(false)
//--------------------- fetch livraison -----------------------
const getLivraison = async() => {
    try {
        livraison  = await $fetch<Livraison>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/livraisons/${idLivraidon}`
        )

        livraison.dts.forEach((elem,index)=>{

            dataTable[index]= Object.assign({},elem)

        })
        refresh.value = !refresh.value;
    } catch(error) {
        console.log(error);
    }
}

const getClientName=async ()=>{
    try {
        const client = await $fetch<Client>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients/${idClient}`

        )

       clientName.value = client.nom

    } catch(error) {
        console.log(error);
    }
}

const showModalAddDt = ()=>{

    console.log("modal add dt")
}



await getLivraison()
await getClientName()

//-------------------------------------- table dt ------------------------------------
const columns = [
  {
    key: "date",
    label: "Date",
    sortable: true,
  },
  {
    key: "idClient",
    label: "Client",
    sortable: true,
  },
  {
    key: "idEquipement",
    label: "Equipement",
    sortable: true,
  },
  {
    key: "panne",
    label: "Objet",
    sortable: false,
  },
  {
    key: "état",
    label: "Etat",
    sortable: false,
  },

  {
    key: "test",
    label: "Test",
    sortable: true,
  },

  {
    key: "observation",
    label: "Observation",
    sortable: false,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
  },
];

const deleteDt = (index:number)=>{

}




let dts: DT[] = reactive([])


//------------------------------ chargement list Equipement --------------------------

let equipements: Equipement[] = reactive([]);


try {
    equipements = await $fetch<Equipement[]>(
        `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/equipements`
    );
} catch (error) {
    console.log(error);
}

//--------------------------chargement list dts----------------------------
const getClientIdByEquipementId = (idEquipement: string) => {
    const result = equipements.filter((equipement) => {
        if (equipement._id) return equipement._id == idEquipement;
    });

    if (result != null && result.length == 1) return result[0].idClient;
    else return undefined;
};

try {
    dts = await $fetch<DT[]>(
        `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/dts`
    );

    //------------------------ ajout idclient--------------------------
    dts.map((dt) => {
        dt.idClient = getClientIdByEquipementId(dt.idEquipement);
    });


} catch (error) {
    console.log(error);
}

//---------------------------  chargement list clients--------------------

let clients: Client[] = reactive([]);

try {
    clients = await $fetch<Client[]>(
        `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients`
    );
} catch (error) {
    console.log(error);
}




</script>