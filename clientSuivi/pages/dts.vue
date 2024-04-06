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
      footer: { padding: 'p-4' },
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-xl align-text-bottom text-gray-900 dark:text-white">
            Demande de travail DT
          </h2>
          <div>
            <UButton @click="showModalAddDt" label="Add" class="mx-10" />
          </div>
          <!-- Filters -->
          <div class="flex items-center justify-end gap-3 px-4 py-3">
            <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Numéro de série" />
          </div>
        </div>
      </template>
      <!-- Header and Action buttons -->
      <div class="flex justify-between items-center w-full px-4 py-3">
        <div class="flex items-center gap-1.5">
          <span class="text-sm leading-5">Rows per page:</span>

          <USelect v-model="pageCount" :options="[3, 5, 10, 20, 30, 40]" class="me-2 w-20" size="xs" />
        </div>
        <div>
          <UInputMenu v-model="choixClient" :options="clients" placeholder="Clients" option-attribute="nom"
            value-attribute="_id" :search-attributes="['nom']" :ui="{ icon: { leading: { pointer: '' } } }">
            <template #leading>
              <UButton v-show="choixClient !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                :padded="false" @click="
      choixClient = '';
    refreshSearch = !refreshSearch;
    " />
            </template>
          </UInputMenu>
        </div>
        <div>
          <UInputMenu v-model="choixEtat" :options="listEtat" placeholder="Etat"
            :ui="{ icon: { leading: { pointer: '' } } }">
            <template #leading>
              <UButton v-show="choixEtat !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                :padded="false" @click="
      choixEtat = '';
    refreshSearch = !refreshSearch;
    " />
            </template>
          </UInputMenu>
        </div>
      </div>
      <!---------------------------------table ---------------------->
      <UTable :columns="columns" :rows="appliquedRows"
        :ui="{ tr: { base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50' } }">
        <template #idClient-data="{ row }">
          {{ getClientName(row) }}
        </template>
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
        <template #état-data="{ row }">
          <UBadge size="xs" :label="row.état" variant="subtle" />
        </template>
        <template #test-data="{ row }">
          <UBadge size="xs" :label="row.test" variant="subtle" :color="row.test == 'Pas Fini' ? 'orange' : 'emerald'" />
        </template>
        <template #actions-data="{ row }">
          <nuxt-link :to="{ path: 'operations', query: row }">
            <UButton class="mx-2" icon="i-heroicons-arrow-right-start-on-rectangle" size="2xs" color="primary"
              variant="outline" :ui="{ rounded: 'rounded-full' }" square />
          </nuxt-link>
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
  </div>
  <!-------------------------------------- modal add DT------------------------------------------------- -->
  <UModal v-model="isOpenAddDt">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
      <template #header>
        <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
          Ajouter une DT
        </h2>
      </template>
      <UForm :schema="schemaAddDt" :state="editedRow" @submit="addDt" autocomplete="off">
        <div>
          <UFormGroup label="Date" name="date" required>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton icon="i-heroicons-calendar-days-20-solid"
                class="bg-transparent text-neutral-600 border font-thin w-full hover:bg-transparent"
                :label="format(editedRow.date, 'd MMM, yyy')" />

              <template #panel="{ close }">
                <DatePicker v-model="editedRow.date" @close="close" />
              </template>
            </UPopover>
          </UFormGroup>
          <UFormGroup label="Client" name="client" required>
            <UInputMenu ref="inputClient" v-model="editedRow.idClient" :options="clients" option-attribute="nom"
              :search-attributes="['nom']" value-attribute="_id" @change="onChoixClient" />
          </UFormGroup>

          <UFormGroup label="Equipement" name="equipement" required>
            <UInputMenu ref="inputEquipement" v-model="editedRow.idEquipement" :options="filtredEquipement"
              option-attribute="désignation" :search-attributes="['numSerie']" value-attribute="_id" />
          </UFormGroup>
          <UFormGroup label="Objet" name="panne">
            <UInput v-model="editedRow.panne" />
          </UFormGroup>

          <UFormGroup label="Observation" name="observation">
            <UInput v-model="editedRow.observation" />
          </UFormGroup>

          <UCheckbox v-model="editedRow.urgence" label="Urgence" name="urgence" class="mt-4" />
        </div>
        <div class="h-8 flex justify-center mt-4">
          <UButton label="Add" type="submit" />
        </div>
      </UForm>
    </UCard>
  </UModal>
  <!-------------------------------------- modal update DT ------------------------------------------------- -->
  <UModal v-model="isOpenUpdateDt">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
      <template #header>
        <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
          Modifier une DT
        </h2>
      </template>
      <UForm :schema="schemaUpdateDt" :state="editedRow" @submit="UpdateDt" autocomplete="off">
        <div>
          <UFormGroup label="Date" name="date" required>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton icon="i-heroicons-calendar-days-20-solid"
                class="bg-transparent text-neutral-600 border font-thin w-full hover:bg-transparent"
                :label="format(editedRow.date, 'd MMM, yyy')" />

              <template #panel="{ close }">
                <DatePicker v-model="editedRow.date" @close="close" />
              </template>
            </UPopover>
          </UFormGroup>
          <UFormGroup label="Client" name="client" required>
            <UInputMenu v-model="editedRow.idClient" :options="clients" option-attribute="nom"
              :search-attributes="['nom']" value-attribute="_id" @change="onChoixClient" />
          </UFormGroup>

          <UFormGroup label="Equipement" name="equipement" required>
            <UInputMenu ref="inputEquipement" v-model="editedRow.idEquipement" :options="filtredEquipement"
              option-attribute="désignation" :search-attributes="['numSerie']" value-attribute="_id" />
          </UFormGroup>
          <UFormGroup label="Objet" name="panne">
            <UInput v-model="editedRow.panne" />
          </UFormGroup>

          <UFormGroup label="Observation" name="observation">
            <UInput v-model="editedRow.observation" />
          </UFormGroup>

          <UCheckbox v-model="editedRow.urgence" label="Urgence" name="urgence" class="mt-4" />
        </div>

        <div class="h-8 flex justify-center mt-4">
          <UButton type="submit" label="Update" />
        </div>
      </UForm>
    </UCard>
  </UModal>
  <UNotifications />
</template>

<script setup lang="ts">
import Joi from "joi";
import type { Equipement, Client, DT } from "../utils/types";
import { eEtat, eTest } from "../utils/types"
import type { FormSubmitEvent } from "#ui/types";
import { reactive } from "vue";
import { format, parseISO } from "date-fns";
import { DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const search = ref("");

const choixClient = ref("");

const choixEtat = ref("");


//--------------------------------- table --------------------------------------------
const listEtat = [eEtat.nonCommence, eEtat.enCours, eEtat.achevée, eEtat.terminée]

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

const items = (row: DT) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => showModalUpdateDt(row),
    },
  ],

  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteDt(row),
    },
  ],
];

const getClientName = (row: DT) => {
  const result = clients.filter((client) => {
    return client._id === row.idClient;
  });

  return result[0].nom;
};

const getEquipementName = (row: DT) => {
  const result = equipements.filter((equipement) => {
    return equipement._id === row.idEquipement;
  });

  return result[0].désignation;
};

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

const getEquipementDetailObject = (row: DT) => {
  const result = equipements.filter((equipement) => {
    return equipement._id === row.idEquipement;
  });

  return result[0]

};

const totalDts = computed(() => {
  if (filteredRows.value) return filteredRows.value.length;
  else return 0;
});

const parsePageCount = computed(() => {
  return parseInt(pageCount.value.toString());
});
// Pagination
const page = ref(1);
const pageCount = ref(5);
const pageTotal = totalDts; // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);

//----------------------  modal add dt----------------------

const inputClient = ref<HTMLInputElement>();

const defaultDt: DT = {
  date: new Date(),
  idClient: "",
  idEquipement: "",
  panne: "",
  état: eEtat.nonCommence,
  test: eTest.pasFini,
  urgence: false,
  opérations: [],
  observation: "",
};

let editedRow: DT = reactive({
  date: new Date(),
  idClient: "",
  idEquipement: "",
  panne: "",
  état: eEtat.nonCommence,
  test: eTest.pasFini,
  urgence: false,
  opérations: [],
  observation: "",
});

const isOpenAddDt = ref(false);

watch(isOpenAddDt, (value) => {
  if (!value) {
    editedRow.date = new Date();
    editedRow.idClient = "";
    editedRow.idEquipement = "";
    editedRow.observation = "";
    editedRow.panne = "";
    editedRow.urgence = false;
  }
});

const schemaAddDt = Joi.object({
  _id: Joi.string().allow(""),
  date: Joi.date(),
  idClient: Joi.string().allow(""),
  idEquipement: Joi.string().required(),
  panne: Joi.string().allow(""),
  observation: Joi.string().allow(""),
  état: Joi.string().allow(""),
  urgence: Joi.boolean(),
  test: Joi.string().allow(""),
  opérations: Joi.array(),
});

const showModalAddDt = () => {
  //------------initialisation du client séléctionnées----------
  if (choixClient.value !== "") {
    editedRow.idClient = choixClient.value;
  } else editedRow.idClient = undefined;

  isOpenAddDt.value = true;
};

//----------------------  modal update dt----------------------
const isOpenUpdateDt = ref(false);

watch(isOpenUpdateDt, (value) => {
  if (!value) {
    editedRow.date = new Date();
    editedRow.idClient = "";
    editedRow.idEquipement = "";
    editedRow.observation = "";
    editedRow.panne = "";
    editedRow.urgence = false;
  }
});

const schemaUpdateDt = Joi.object({
  _id: Joi.string().allow(""),
  date: Joi.date(),
  idClient: Joi.string().allow(""),
  idEquipement: Joi.string().required(),
  panne: Joi.string().allow(""),
  observation: Joi.string().allow(""),
  état: Joi.string().allow(""),
  urgence: Joi.boolean(),
  test: Joi.string().allow(""),
  opérations: Joi.array().items(Joi.string()).min(0),
  __v: Joi.number().allow(""),
});

const showModalUpdateDt = (dt: DT) => {
  //editedRow = Object.assign({}, dt)
  editedRow.date = parseISO(dt.date.toString());
  editedRow._id = dt._id;
  editedRow.idClient = dt.idClient;
  editedRow.idEquipement = dt.idEquipement;
  editedRow.observation = dt.observation;
  editedRow.panne = dt.panne;
  editedRow.urgence = dt.urgence;

  onChoixClient(editedRow.idClient);
  isOpenUpdateDt.value = true;
};

//--------------------------   data-------------------------------------

const refreshSearch = ref(false);
let dts: DT[] | null = reactive([]);

//----------------------------- fonctions filtrage --------------------------

//---------------->>>>>> filtrage suivant état-------------------

const preFiltredRows = computed(() => {
  refreshSearch.value; //pour rafraichir
  if (choixEtat.value == "") return dts;
  else if (dts) {
    return dts.filter((dt: DT) => {
      return dt.état == choixEtat.value;
    });
  } else return [];
});

//-----------<>>>>>>>>>>>>> filtrage suivant client -------------------------
const filteredRows = computed(() => {
  if (preFiltredRows.value) {
    if (choixClient.value == "") return preFiltredRows.value;
    else if (preFiltredRows.value.length > 0) {
      return preFiltredRows.value.filter((dt) => {
        return dt.idClient == choixClient.value;
      });
    } else return [];
  }
});

const selectedRows = computed(() => {
  if (filteredRows.value) {
    return filteredRows.value.filter((dt, index: number) => {
      return (
        index < page.value * pageCount.value &&
        index >= (page.value - 1) * pageCount.value
      );
    });
  } else return [];
});

//----------------------  filtre pour recherche num de série-----------------------
const appliquedRows = computed(() => {

  if (!search.value) {
    return selectedRows.value
  }
  if (dts != null) {
    return dts.filter((dt) => {
      const equi = getEquipementDetailObject(dt)
      return equi.numSerie.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
    });
  }
  else {
    return selectedRows.value
  }

})

//---------------------------  chargement list clients--------------------

let clients: Client[] = reactive([]);

try {
  clients = await $fetch<Client[]>(
    `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients`
  );
} catch (error) {
  console.log(error);
}

//------------------------------ chargement list Equipement --------------------------

let equipements: Equipement[] = reactive([]);

let filtredEquipement: Equipement[] = reactive([]);

const inputEquipement = ref(null);

try {
  equipements = await $fetch<Equipement[]>(
    `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/equipements`
  );
} catch (error) {
  console.log(error);
}

//                       -----> selection equipement suivant client ---------------
const onChoixClient = (event: string | null | undefined) => {
  const filtre = equipements.filter((equipement) => {
    return equipement.idClient == event;
  });

  filtredEquipement.length = 0;
  filtre.forEach((ele) => {
    filtredEquipement.push(ele);
  });
};

//------------------------------- raffraichissement list dts -------------------
const getClientIdByEquipementId = (idEquipement: string) => {
  const result = equipements.filter((equipement) => {
    if (equipement._id) return equipement._id == idEquipement;
  });

  if (result != null && result.length == 1) return result[0].idClient;
  else return undefined;
};

const raffraichir = async () => {
  try {
    dts = await $fetch<DT[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/dts`
    );

    //------------------------ ajout idclient--------------------------
    dts.map((dt) => {
      dt.idClient = getClientIdByEquipementId(dt.idEquipement);
    });

    //---------------- ajout class pour style de la row --------------
    dts.map((dt) => {
      if (dt.urgence) {
        dt.class = "bg-orange-50 hover:bg-orange-100";
      }
    });

    refreshSearch.value = !refreshSearch.value;
  } catch (error) {
    console.log(error);
  }
};

await raffraichir();



const addDt = async () => {
  isOpenAddDt.value = false;

  const { _id, ...data } = editedRow;

  try {
    await $fetch<Equipement[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/dts`,
      {
        method: "POST",
        body: data,
      }
    );

    toast.add({
      title: "Ajout équipement ",
      description: "L'équipement a bien été ajouté",
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
};

const deleteDt = async (dt: DT) => {
  toast.add({
    title: "Suppression dt ",
    description: "Etes-vous sur de vouloir supprimer cet dt ?",
    actions: [
      {
        label: "Delete",
        click: async () => {
          if (dt.état != eEtat.nonCommence) {
            toast.add({
              title: "Erreur ",
              description: " La dt n'est pas dans l'état 'Non commencée'",
              timeout: 10000,
              color: "red",
            })
          } else {
            try {
              await $fetch(
                `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/dts/${dt._id}`,
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
              title: "Suppression dt ",
              description: "La dt a bien été supprimée",
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

const UpdateDt = async (event: FormSubmitEvent<Equipement>) => {
  isOpenUpdateDt.value = false;
  const { _id, ...data } = editedRow;
  try {
    await $fetch<Equipement[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/dts/${event.data._id}`,
      {
        method: "PUT",
        body: data,
      }
    );

    toast.add({
      title: "Modification DT ",
      description: "La DT a bien été modifiée",
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
};
</script>
