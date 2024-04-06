<template>
   
  <div class="flex justify-center items-center w-full">
        <UCard class="mt-4 w-8/12" :ui="{
            base: '',
            ring: '',
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: {
                padding: '',
                base: 'divide-y divide-gray-200 dark:divide-gray-700',
            },
            footer: { padding: 'p-4' },
        }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-xl align-text-bottom text-gray-900 dark:text-white">
                        Livraisons
                    </h2>
                    <div>
                        <UButton @click="isOpenAddLivraison = true" label="Add" class="mx-10" />
                    </div>
                </div>
            </template>
            <!-- Header and Action buttons -->
            <div class="flex justify-between items-center w-full px-4">

                <div>
                    <UInputMenu v-model="choixClient" :options="clients" placeholder="Clients" option-attribute="nom"
                        value-attribute="_id" :search-attributes="['nom']" :ui="{ icon: { leading: { pointer: '' } } }">
                        <template #leading>
                            <UButton v-show="choixClient !== ''" color="gray" variant="link"
                                icon="i-heroicons-x-mark-20-solid" :padded="false" @click="
            choixClient = '';
        refreshSearch = !refreshSearch;
        " />
                        </template>
                    </UInputMenu>
                </div>
                <!-- Filters -->
                <div class="flex items-center justify-end gap-3 px-4 py-3">
                    <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid"
                        placeholder="Numéro de série" />
                </div>

                <div class="flex items-center gap-1.5">
                    <span class="text-sm leading-5">Rows per page:</span>

                    <USelect v-model="pageCount" :options="[3, 5, 10, 20, 30, 40]" class="me-2 w-20" size="xs" />
                </div>
            </div>

            <UTable :columns="livraisonsColumns" :rows="selectedRows"
                :ui="{ tr: { base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50' } }">
                <template #client-data="{ row }">
                    {{ getClientName(row) }}
                </template>
                <template #actions-data="{row}">
                    <nuxt-link :to="{ path: 'detailLivraison', query: row }">
                        <UButton class="mx-2" icon="i-heroicons-arrow-right-start-on-rectangle" size="2xs"
                            color="primary" variant="outline" :ui="{ rounded: 'rounded-full' }" square />
                    </nuxt-link>
                    <UButton class="mx-2" icon="i-heroicons-printer" size="2xs"
                    :disabled="row.dts.length==0"
                            color="primary" variant="outline" :ui="{ rounded: 'rounded-full' }" square />
                    <UDropdown :items="items(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>

            </UTable>
            <!-- Number of rows & Pagination -->

            <template #footer>
                <div class="flex flex-wrap justify-between items-center">
                    <div>
                        <span class="text-sm leading-5">
                            Showing
                            <span class="font-medium">{{ pageFrom }}</span>
                            to
                            <span class="font-medium">{{ pageTo }}</span>
                            of
                            <span class="font-medium">{{ pageTotal }}</span>
                            results
                        </span>
                    </div>

                    <UPagination v-model="page" :page-count="parsePageCount" :total="pageTotal" :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: {
                activeButton: {
                    variant: 'outline',
                },
            },
        }" />
                </div>
            </template>
        </UCard>

  
    <!-- ------------------------- modal add livraison ----------------- -->

    <UModal v-model="isOpenAddLivraison" :ui="{ wrapper: 'max-w-1/12' }">
        <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }">
            <template #header>
                <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                    Ajouter une Livraison
                </h2>
            </template>
            <UForm :state="editedLivraison" @submit="addLivraison" autocomplete="off">

                <UFormGroup label="Date" name="date" required>
                    <UPopover :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-calendar-days-20-solid"
                            class="bg-transparent text-neutral-600 border font-thin w-full hover:bg-transparent"
                            :label="format(editedLivraison.date, 'd MMM, yyy')" />

                        <template #panel="{ close }">
                            <DatePicker v-model="editedLivraison.date" @close="close" />
                        </template>
                    </UPopover>
                </UFormGroup>

                <UFormGroup label="Client" name="client" required>
                    <UInputMenu v-model="editedLivraison.client" :options="clients" option-attribute="nom"
                        :search-attributes="['nom']" value-attribute="_id" />
                </UFormGroup>

                <div class="h-8 flex justify-center mt-4">
                    <UButton label="Add" type="submit" />
                </div>
            </UForm>
        </UCard>

    </UModal>
     <!-- ------------------------- modal modif livraison ----------------- -->

     <UModal v-model="isOpenModifLivraison" :ui="{ wrapper: 'max-w-1/12' }">
        <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }">
            <template #header>
                <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                    Modifier une Livraison
                </h2>
            </template>
            <UForm :state="editedLivraison" @submit="ModifLivraison" autocomplete="off">

                <UFormGroup label="Date" name="date" required>
                    <UPopover :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-calendar-days-20-solid"
                            class="bg-transparent text-neutral-600 border font-thin w-full hover:bg-transparent"
                            :label="format(editedLivraison.date, 'd MMM, yyy')" />

                        <template #panel="{ close }">
                            <DatePicker v-model="editedLivraison.date" @close="close" />
                        </template>
                    </UPopover>
                </UFormGroup>

                <UFormGroup label="Client" name="client" required>
                    <UInputMenu v-model="editedLivraison.client" :options="clients" option-attribute="nom"
                        :search-attributes="['nom']" value-attribute="_id" />
                </UFormGroup>

                <div class="h-8 flex justify-center mt-4">
                    <UButton label="Update" type="submit" />
                </div>
            </UForm>
        </UCard>

    </UModal>
    <UNotifications />
</div>

</template>
<script setup lang="ts">
import type { Client, Livraison } from '../utils/types'
const runtimeConfig = useRuntimeConfig();
import { DatePicker } from "v-calendar";
import { format, parseISO } from "date-fns";
import "v-calendar/dist/style.css";

const toast = useToast();

const search = ref("");
const choixClient = ref("");


//-----------------------  table livraison---------------------
let livraisons: Livraison[] = reactive([])
const livraisonsColumns = [{
    key: 'date',
    label: 'Date',
    sortable: true
},
{
    key: 'client',
    label: 'Client',
    sortable: true
},
{
    key: "actions",
    label: "Actions",
    sortable: false,
   
},
]


const items = (row: Livraison) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => showModalUpdateLivraison(row),
    },
  ],

  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteLivraison(row),
    },
  ],
];


const showModalUpdateLivraison = (row:Livraison)=>{
    editedLivraison._id=row._id
    editedLivraison.date=new Date(row.date)
    editedLivraison.client=row.client
    isOpenModifLivraison.value=true

}

const deleteLivraison = async (livraison: Livraison) => {
  toast.add({
    title: "Suppression livraison ",
    description: "Etes-vous sur de vouloir supprimer cet livraison ?",
    actions: [
      {
        label: "Delete",
        click: async () => {
          if (livraison.dts.length>0) {
            toast.add({
              title: "Erreur ",
              description: "La livraison possède des DT ",
              timeout: 10000,
              color: "red",
            })
          } else {
            try {
              await $fetch(
                `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/livraisons/${livraison._id}`,
                {
                  method: "DELETE",
                }
              );
              raffraichir();
            } catch (error) {
              toast.add({
                title: "Erreur ",
                description: (error as Error).message,
                timeout: 10000,
                color: "red",
              });
            }

            toast.add({
              title: "Suppression livraison ",
              description: "La livraison a bien été supprimée",
            });
            raffraichir();
          }
        },
        variant: "solid",
        color: "primary",
      },
    ],
    color: "orange",
  });
};



const printLivraison = (row: Livraison) => {

}



const totalLivraisons = computed(() => {
    if (filteredRows.value) return filteredRows.value.length;
    else return 0;
});

const parsePageCount = computed(() => {
    return parseInt(pageCount.value.toString());
});
// Pagination
const page = ref(1);
const pageCount = ref(5);
const pageTotal = totalLivraisons; // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
    Math.min(page.value * pageCount.value, pageTotal.value)
);

//---------------------------- modal add livraion -------------------------
const isOpenAddLivraison = ref(false)



const schemaAddLivraison = [{}]

const editedLivraison: Livraison = reactive({
    date: new Date(),
    client: "",
    dts: [],
    lien: ""
})








//-------------------------------- modification livraison -------------------

const isOpenModifLivraison = ref(false)

const ModifLivraison = async ()=>{ 

    isOpenModifLivraison.value=false

    try {

await $fetch<Client[]>(
    `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/livraisons/${editedLivraison._id}`,
    {
        method: "PUT",
        body: editedLivraison

    }
);

toast.add({
    title: 'Modifier une livraison ',
    description: 'La livraison a bien été modifié',

})

} catch (error) {
toast.add({
    title: 'Erreur ',
    description: (error as Error).message,
    timeout: 10000,
    color: 'red'
})
}

raffraichir();




}

//-------------------------------data -----------------------------------

const refreshSearch = ref(false);

const addLivraison = async () => {

    isOpenAddLivraison.value = false
    try {
        await $fetch<Livraison>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/livraisons`,
            {
                method: "POST",
                body: editedLivraison,
            }
        );

        toast.add({
            title: "Ajout livraison ",
            description: "La livraison a bien été ajouté",
        });
    } catch (error) {
        toast.add({
            title: "Erreur ",
            description: (error as Error).message,
            timeout: 10000,
            color: "red",
        });
    }

    await raffraichir();

}

const  refresh = ref(false)

const raffraichir = async () => {
    try {

        livraisons = await $fetch<Livraison[]>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/livraisons`
        );

        refresh.value=!refresh.value
    } catch (error) {

        console.log(error);
    }


};



const getClientName = (row: Livraison) => {
    const result = clients.filter((client) => {
        return client._id === row.client;
    });

    return result[0].nom;
};

//------------------------------  selection nombre livraison visible -------------------
const selectedRows = computed(() => {
    refresh.value
    if (filteredRows.value) {
        return filteredRows.value.filter((dt, index: number) => {
            return (
                index < page.value * pageCount.value &&
                index >= (page.value - 1) * pageCount.value
            );
        });
    } else return [];
});



//-----------<>>>>>>>>>>>>> filtrage suivant client -------------------------
const filteredRows = computed(() => {
    refresh.value
    if (choixClient.value == "") return livraisons;
    else if (livraisons.length > 0) {
        return livraisons.filter((livraison) => {
            return livraison.client == choixClient.value;
        });
    } else return [];

});

//---------------------------  chargement list clients--------------------

let clients: Client[] = reactive([]);

try {
    clients = await $fetch<Client[]>(
        `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients`
    );
} catch (error) {
    console.log(error);
}
await raffraichir()
</script>
