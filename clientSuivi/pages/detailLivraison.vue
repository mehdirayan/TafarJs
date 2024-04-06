<template>
    <div class="flex justify-center items-center w-full">
        <UCard class="mt-4 w-11/12" :ui="{
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
                    <p>{{ clientName }}</p>
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
               
               <template #idEquipement-data="{ row }">
          <UPopover>
            <UButton color="white" :label="getEquipementName(row)" variant="link" />
            <template #panel="{ close }">
              <div class="p-8">
                <div v-html="getEquipementDetail(row)"></div>
                <div class="flex justify-center">
                  <UButton label="Close" @click="close" />
                </div>
              </div>
            </template>
          </UPopover>
        </template>
                <template #actions-data="{ index, row }">
                    <UButton class="mx-2" icon="i-heroicons-trash" size="2xs" color="red" variant="outline"
                        :ui="{ rounded: 'rounded-full' }" square @click="deleteDt(index)" />
                </template>
                <template> </template>
            </UTable>
            <template #footer>
                <UButton label="Générer le bon " class="h-8" @click="genererBonLivraison" />
            </template>
        </UCard>
        <UModal v-model="isOpenAddDT" :ui="{ width: 'sm:max-w-5xl', height: 'h-5/6' }">
            <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }">
                <template #header>
                    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                        Ajouter une DT
                    </h2>
                </template>
                <div>
                    <UTable :columns="columnsModal" :rows="filtredDt" v-model="selected" class="h-64">
                        <template #idEquipement-data="{ row }">
                            {{ getEquipementName(row) }}
                        </template>

                    </UTable>
                </div>
                <template #footer>
                    <UButton label="Add" class="h-8" @click="addDts" />
                </template>
            </UCard>
        </UModal>
    </div>
    <UNotifications />
</template>
<script setup lang="ts">
import type { Client, DT, Livraison } from "../utils/types";
import { format, parseISO } from "date-fns";
import "v-calendar/dist/style.css";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const route = useRoute();
const idLivraidon: string = route.query._id as unknown as string;
const idClient: string = route.query.client as string;

let livraison: Livraison = reactive({
    date: new Date(),
    client: "",
    dts: [],
    lien: "",
});

let dataTable: DT[] = reactive([]);

const clientName: Ref<string> = ref("");

const refresh = ref(false);
//--------------------- fetch livraison -----------------------
const getLivraison = async () => {
    try {
        livraison = await $fetch<Livraison>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/livraisons/${idLivraidon}`
        );

        livraison.dts.forEach((elem, index) => {
            dataTable[index] = Object.assign({}, elem);
        });
        refresh.value = !refresh.value;
    } catch (error) {
        console.log(error);
    }
};

const getClientName = async () => {
    try {
        const client = await $fetch<Client>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients/${idClient}`
        );

        clientName.value = client.nom;
    } catch (error) {
        console.log(error);
    }
};

await getLivraison();
await getClientName();

//-------------------------------------- table dt ------------------------------------
const columns = [
    {
        key: "date",
        label: "Date",
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

const deleteDt = (index: number) => { };

let dts: DT[] = reactive([]);

const selected: Ref<DT[]> = ref([]);



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

const getEquipementDetail = (row: DT) => {
  const result = equipements.filter((equipement) => {
    return equipement._id === row.idEquipement;
  });

  const html: string = `
    <div class="mb-4">
      <div class="flex">
        <h4 class="pr-2">Désignation :</h4>
        <p> ${result[0].désignation}</p>
      </div>
      <div class="flex">
        <h4 class="pr-2">Marque :</h4>
        <p> ${result[0].marque}</p>
      </div>
      <div class="flex">
        <h4 class="pr-2">Modèle :</h4>
        <p> ${result[0].modele}</p>
      </div>
      <div class="flex">
        <h4 class="pr-2">Num Série :</h4>
        <p> ${result[0].numSerie}</p>
      </div>
    </div>`;

  return html;
};

//------------------------------------------ modal add dt------------------------------

const columnsModal = [
    {
        key: "date",
        label: "Date",
        sortable: true,
    },

    {
        key: "idEquipement",
        label: "Equipement",
        sortable: true,
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

];

const isOpenAddDT = ref(false);

const showModalAddDt = () => {
    isOpenAddDT.value = true;
};

const filtredDt = computed(() => {

    const selectedDts: DT[] = dts.filter(dt => {
        return (dt.idClient == idClient && dt.état == eEtat.achevée)
    })

    return selectedDts


});

const getEquipementName = (row: DT) => {
    const result = equipements.filter((equipement) => {
        return equipement._id === row.idEquipement;
    });

    return result[0].désignation;
};

const addDts = async () => {

    selected.value.forEach(dt => {
        livraison.dts.push(dt)
    })

    try {

        await $fetch<Client[]>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/livraisons/${livraison._id}`,
            {
                method: "PUT",
                body: livraison

            }
        );

        toast.add({
            title: 'Ajouter des DT ',
            description: 'Les DT ont  bien été ajouet au bon de livraison',

        })

    } catch (error) {
        toast.add({
            title: 'Erreur ',
            description: (error as Error).message,
            timeout: 10000,
            color: 'red'
        })
    }

    //raffraichir();



}

//-------------------------------- génération bon de livraison ------------------
const genererBonLivraison=()=>{
    
}
</script>
