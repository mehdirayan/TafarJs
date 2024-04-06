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
            Opérations
          </h2>

          <div>
            <UButton @click="showModalAddOpération" label="Add" class="mx-10" />
          </div>
          <div>
            <ULink to="dts" type="button">
              <UButton>Retour</UButton>
            </ULink>
          </div>
        </div>
      </template>
      <!-- Header and Action buttons -->
      <div class="flex justify-between p-4">
        <div class="flex text-gray-600">
          <p class="pr-1 font-medium">Date:</p>
          <p>{{ format(new Date(dt.date), "dd MMM yyyy") }}</p>
        </div>
        <div class="flex text-gray-600">
          <p class="pr-1 font-medium">Client:</p>
          <p>{{ getClientName(dt) }}</p>
        </div>
        <div class="flex text-gray-600">
          <p class="pr-1 font-medium">Equipement:</p>
          <p>{{ getEquipement(dt).désignation }}</p>
        </div>
        <div class="flex text-gray-600">
          <p class="pr-1 font-medium">Num Série:</p>
          <p>{{ getEquipement(dt).numSerie }}</p>
        </div>
        <UBadge size="xs" :label="dt.état" variant="subtle" />
      </div>
      <!---------------------------------table ---------------------->
      <UTable :columns="columns" :rows="dataTable" @select="select" v-model="selected" :ui="{
      tr: {
        base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 w-full table table-fixed',
        selected: 'bg-green-50 hover:bg-green-100',
      },
      thead: 'table table-fixed w-full',

      tbody: 'block w-full max-h-[200px] overflow-y-scroll',
    }">
        <template #actions-data="{ index, row }">
          <UButton class="mx-2" icon="i-heroicons-pencil-square" size="2xs" color="orange" variant="outline"
            :ui="{ rounded: 'rounded-full' }" square @click="showModalEditOpération(row, index)" />

          <UButton class="mx-2" icon="i-heroicons-trash" size="2xs" color="red" variant="outline"
            :ui="{ rounded: 'rounded-full' }" square @click="deleteOpération(index)" />
        </template>
        <template>

        </template>
      </UTable>

    </UCard>
  </div>
  <div class="flex items-center w-full flex-col" v-if="dataTable.length > 0">

    <UCard class="w-11/12 mt-4" :ui="{
      base: '',
      ring: '',

      body: {
        padding: '',
        base: 'divide-y divide-gray-200 dark:divide-gray-700',
      },
    }">
      <div class="w-11/12">
        <p class="p-1 pb-1 font-medium">Détail</p>
      </div>
      <div>
        <UTextarea v-model="selected[0].détail" variant="outline" size="md" readonly />
      </div>
      <div class="flex items-center w-full flex-col mt-4 ">
        <div class="w-full">
          <p class="p-1 pb-1 font-medium ">Pièces</p>
        </div>
        <UCard class=" w-full" :ui="{
      base: '',
      ring: '',
      //divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-5' },
      body: {
        padding: '',
        base: 'divide-y divide-gray-200 dark:divide-gray-700',
      },
    }">
          <div>
            <UTable class="w-full mt-4" :columns="columnsPièces" :rows="computPièceTable" />
          </div>
        </UCard>
      </div>
      <template #footer>
        <div>
          <div class="flex">
            <p class="font-medium">Temps total :</p>
            <p class="px-2">{{ tempsTotal }}</p>
            <p>Heures</p>
          </div>
          <div class="flex">
            <p class="font-medium">Prix total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</p>
            <p class="px-2">{{ prixPièces }} </p>
            <p>DA</p>
          </div>

        </div>
      </template>
    </UCard>
  </div>

  <!-- ------------------------- modal add opération ----------------- -->

  <UModal v-model="isOpenAddOpération">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
      <template #header>
        <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
          Ajouter une Opération
        </h2>
      </template>
      <UForm :schema="schemaAddOpération" :state="editedOpération" @submit="addOpération" autocomplete="off">
        <div>
          <UFormGroup label="Date" name="date" required>
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton icon="i-heroicons-calendar-days-20-solid"
                class="bg-transparent text-neutral-600 border font-thin w-full hover:bg-transparent"
                :label="format(editedOpération.date, 'd MMM, yyy')" />

              <template #panel="{ close }">
                <DatePicker v-model="editedOpération.date" @close="close" />
              </template>
            </UPopover>
          </UFormGroup>
          <UFormGroup label="Lieu" name="lieu">
            <UInput v-model="editedOpération.lieu" />
          </UFormGroup>
          <UFormGroup label="User" name="user" required>
            <UInputMenu v-model="editedOpération.user" :options="users" option-attribute="nom"
              :search-attributes="['nom']" value-attribute="nom" />
          </UFormGroup>

          <UFormGroup label="Détail" name="détail">
            <UTextarea v-model="editedOpération.détail" />
          </UFormGroup>

          <UFormGroup label="Temps" name="temps">
            <UInput v-model="editedOpération.temps" />
          </UFormGroup>
        </div>
        <div class="flex justify-between p-4">
          <div>
            <UCheckbox v-model="acheverDt" name="achever" label="Achever" />
          </div>
          <div>
            <URadioGroup v-if="acheverDt" v-model="testStatus" legend="Test"
              :options="[eTest.ok, eTest.aTester, eTest.abandonée]" />
          </div>
        </div>
        <UDivider label="Pièces de rechange" />
        <div>
          <UTable :rows="editedOpération.pièces" :columns="piècesColumsAddOpération" @dblclick="isOpenPièces = true">
            <template #actions-data="{ row, index }">
              <UButton class="mx-2" icon="i-heroicons-trash" size="2xs" color="red" variant="outline"
                :ui="{ rounded: 'rounded-full' }" square @click="deletePièce(index)" />
            </template>
          </UTable>
        </div>
        <div class="h-8 flex justify-center mt-4">
          <UButton label="Add" type="submit" />
        </div>
      </UForm>
    </UCard>
    <!-------------------------------------------------------modal add pièces when add opération -------------------  -->
    <UModal v-model="isOpenPièces">
      <UCard>
        <template #header>
          Ajouter une pièce
        </template>
        <UForm :schema="schemaAddPièce" :state="editedPièce" @submit="addPièce" autocomplete="off">
          <UFormGroup label="Désignation" name="désignation">
            <UInput v-model="editedPièce.désignation" />
          </UFormGroup>
          <UFormGroup label="Référence" name="référence">
            <UInput v-model="editedPièce.référence" />
          </UFormGroup>
          <UFormGroup label="Quantité" name="quantité">
            <UInput v-model="editedPièce.quantité" />
          </UFormGroup>
          <UFormGroup label="Prix" name="prix">
            <UInput v-model="editedPièce.prix" />
          </UFormGroup>
          <div class="h-8 flex justify-center mt-4">
            <UButton label="Add" type="submit" />
          </div>
        </UForm>
      </UCard>
    </UModal>

  </UModal>

  <!-- ------------------------- modal update opération ----------------- -->

  <UModal v-model="isOpenUpdateOpération">
    <UCard :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
      <template #header>
        <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
          MOdifier une Opération
        </h2>
      </template>
      <UForm :state="editedOpération" @submit="UpdateOpération" autocomplete="off">

        <UFormGroup label="Date" name="date" required>
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid"
              class="bg-transparent text-neutral-600 border font-thin w-full hover:bg-transparent"
              :label="format(editedOpération.date, 'd MMM, yyy')" />

            <template #panel="{ close }">
              <DatePicker v-model="editedOpération.date" @close="close" />
            </template>
          </UPopover>
        </UFormGroup>
        <UFormGroup label="Lieu" name="lieu">
          <UInput v-model="editedOpération.lieu" />
        </UFormGroup>
        <UFormGroup label="User" name="user" required>
          <UInputMenu v-model="editedOpération.user" :options="users" option-attribute="nom"
            :search-attributes="['nom']" value-attribute="nom" />
        </UFormGroup>

        <UFormGroup label="Détail" name="détail">
          <UTextarea v-model="editedOpération.détail" />
        </UFormGroup>

        <UFormGroup label="Temps" name="temps">
          <UInput v-model="editedOpération.temps" />
        </UFormGroup>

        <div class="flex justify-between p-4">
          <div>
            <UCheckbox v-model="acheverDt" name="achever" label="Achever" />
          </div>
          <div>
            <URadioGroup v-if="acheverDt" v-model="testStatus" legend="Test" :options="[eTest.ok,eTest.aTester ,eTest.abandonée,]" />
          </div>
        </div>
        <UDivider label="Pièces de rechange" />
        <div>
          <UTable :rows="editedOpération.pièces" :columns="piècesColumsAddOpération" @dblclick="isOpenPièces = true">
            <template #actions-data="{ index }">
              <UButton class="mx-2" icon="i-heroicons-trash" size="2xs" color="red" variant="outline"
                :ui="{ rounded: 'rounded-full' }" square @click="deletePièce(index)" />
            </template>
          </UTable>
        </div>
        <div class="h-8 flex justify-center mt-4">
          <UButton label="Update" type="submit" />
        </div>
      </UForm>
    </UCard>
    <!-------------------------------------------------------modal add pièces when update opération -------------------  -->
    <UModal v-model="isOpenPièces">
      <UCard>
        <template #header>
          Ajouter une pièce
        </template>
        <UForm :schema="schemaAddPièce" :state="editedPièce" @submit="addPièce" autocomplete="off">
          <UFormGroup label="Désignation" name="désignation">
            <UInput v-model="editedPièce.désignation" />
          </UFormGroup>
          <UFormGroup label="Référence" name="référence">
            <UInput v-model="editedPièce.référence" />
          </UFormGroup>
          <UFormGroup label="Quantité" name="quantité">
            <UInput v-model="editedPièce.quantité" />
          </UFormGroup>
          <UFormGroup label="Prix" name="prix">
            <UInput v-model="editedPièce.prix" />
          </UFormGroup>
          <div class="h-8 flex justify-center mt-4">
            <UButton label="Add" type="submit" />
          </div>
        </UForm>
      </UCard>
    </UModal>

  </UModal>
  <UNotifications />
</template>
<script setup lang="ts">
import type { DT, Equipement, Client, Opération, Pièce } from "../utils/types";
import { eEtat, eTest } from "../utils/types";
import Joi from "joi";
import { DatePicker } from "v-calendar";
import { format, parseISO } from "date-fns";
import "v-calendar/dist/style.css";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const route = useRoute();
const idDt: string = route.query._id as unknown as string;
const refresh = ref(false);

let dt: DT = reactive({
  date: new Date(),
  idEquipement: "",
  panne: "",
  état: eEtat.nonCommence,
  test: eTest.pasFini,
  urgence: false,
  observation: "",
  opérations: [],
});



//---------------------------------- chargement  de la dt----------------------------------
const raffraichir = async (index?: number) => {
  try {
    dt = await $fetch<DT>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/dts/${idDt}`
    );
    refresh.value = !refresh.value;
    if (index) {
      select(dataTable.value[index])
    }
  } catch (error) {
    console.log(error);
  }
};

await raffraichir();

const dataTable = computed(() => {
  refresh.value;
  return dt.opérations;
});

let piècesTable: Pièce[] = [];

const defaultOpération = {
  date: new Date(),
  user: "",
  lieu: "Atelier",
  détail: "",
  temps: null,
  pièces: [],
};

let editedOpération: Opération = reactive(defaultOpération);

//---------------------------  chargement list clients--------------------

let clients: Client[] = reactive([]);

try {
  clients = await $fetch<Client[]>(
    `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients`
  );
} catch (error) {
  console.log(error);
}

const getClientName = (row: DT) => {
  const selectedequipement = equipements.filter((equipement) => {
    return equipement._id === row.idEquipement;
  });

  const result = clients.filter((client) => {
    return client._id === selectedequipement[0].idClient;
  });

  return result[0].nom;
};

//------------------------------ chargement list des utilisateurs ----------------

let users: User[] = reactive([]);

try {
  users = await $fetch<User[]>(
    `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/users`
  );
} catch (error) {
  console.log(error);
}
//------------------------------ chargement list Equipement --------------------------

let equipements: Equipement[] = reactive([]);

try {
  equipements = await $fetch<Equipement[]>(
    `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/equipements`
  );
} catch (error) {
  console.log(error);
}

const getEquipement = (row: DT) => {
  const result = equipements.filter((equipement) => {
    return equipement._id === row.idEquipement;
  });

  return result[0];
};

//--------------------- table opération --------------------------------------
const columns = [
  {
    key: "date",
    label: "Date",
    sortable: false,
  },
  {
    key: "user",
    label: "User",
    sortable: false,
  },
  {
    key: "temps",
    label: "Temps",
    sortable: false,
  },
  {
    key: "lieu",
    label: "Lieu",
    sortable: false,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
  },
];

const columnsPièces = [
  {
    key: "désignation",
    label: "Désignation",
    sortable: false,
  },
  {
    key: "référence",
    label: "Référence",
    sortable: false,
  },
  {
    key: "quantité",
    label: "Quantité",
    sortable: false,
  },
  {
    key: "prix",
    label: "Prix",
    sortable: false,
  },

];


//----------------------- table pièces ------------------------------------
const computPièceTable = computed(() => {
  refreshPièce.value
  return piècesTable
})

const refreshPièce = ref(false)



const selected: Ref<Opération[]> = ref([dataTable.value[0]]);

const select = (row: Opération) => {
  selected.value.length = 0;
  selected.value.push(row);
  piècesTable = row.pièces
  refreshPièce.value = !refreshPièce.value
};

//--------------------- selection première opération ------------
if (dt.opérations.length > 0) select(dt.opérations[0])



//--------------------------- modal add opération -----------------------
const isOpenAddOpération = ref(false);
const testStatus = ref(eTest.pasFini)


const acheverDt = ref(false)

watch(acheverDt, value => {

  dt.état = eEtat.achevée
})



const showModalAddOpération = () => {
  isOpenAddOpération.value = true;
};

watch(isOpenAddOpération, value => {
  if (!value) {

    editedOpération.détail = ""
    editedOpération.pièces.length = 0
    editedOpération.lieu = "Atelier"
    editedOpération.temps = null
    editedOpération.user = ""
    acheverDt.value = false

  }
})

const schemaAddOpération = Joi.object({
  date: Joi.date(),
  lieu: Joi.string(),
  user: Joi.string(),
  détail: Joi.string(),
  temps: Joi.number(),
  pièces: Joi.array()
});

const schemaAddPièce = Joi.object({
  désignation: Joi.string(),
  référence: Joi.string(),
  quantité: Joi.number(),
  prix: Joi.number(),

});

const piècesColumsAddOpération = [
  {
    key: "désignation",
    label: "Désignation",
    sortable: false,
  },
  {
    key: "référence",
    label: "Référence",
    sortable: false,
  },
  {
    key: "quantité",
    label: "Quantité",
    sortable: false,
  },
  {
    key: "prix",
    label: "Prix",
    sortable: false,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
  },

]

//---------------------------------------- modal update opération------------------------------

const isOpenUpdateOpération = ref(false)
let indexToUpdate: number | undefined = undefined
const showModalEditOpération = (row: Opération, index: number) => {
  indexToUpdate = index
  editedOpération.date = parseISO(row.date.toString())
  editedOpération.lieu = row.lieu
  editedOpération.temps = row.temps
  editedOpération.user = row.user
  editedOpération.détail = row.détail
  editedOpération.pièces.length = 0
  acheverDt.value = dt.état == "Achevée" ? true : false
  testStatus.value = dt.test
  row.pièces.forEach((pi, index) => {
    editedOpération.pièces[index] = pi
  })
  isOpenUpdateOpération.value = true
}


//--------------------------------------------- modal pièces--------------------------------



const isOpenPièces = ref(false)

const defaultPièce: Pièce = {
  désignation: "",
  référence: "",
  quantité: 0,
  prix: 0

}

let editedPièce: Pièce = reactive(Object.assign({}, defaultPièce))

const addPièce = () => {

  editedOpération.pièces.push(editedPièce)

  isOpenPièces.value = false

}

watch(isOpenPièces, value => {
  if (!value) {

    editedPièce = Object.assign({}, defaultPièce)
  }
})

const deletePièce = (row: number) => {
  editedOpération.pièces.splice(row, 1)
}
//---------------------------- data---------------------------


const addOpération = async () => {
  //select(editedOpération)

  dt.opérations.push(Object.assign({}, editedOpération));
  dt.état = acheverDt.value ? eEtat.achevée : dt.état
  dt.test = testStatus.value
  if (dataTable.value.length > 0)
    selected.value = [dataTable.value[dataTable.value.length - 1]]

  try {
    await $fetch<DT[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/dts/${dt._id}`,
      {
        method: "PUT",
        body: dt,
      }
    );

    toast.add({
      title: "Ajout opération ",
      description: "L'opération a bien été ajouté",
    });

    await raffraichir();
    if (dataTable.value.length > 0)
      select(dataTable.value[dataTable.value.length - 1])
      isOpenAddOpération.value = false;
  } catch (error) { console.log(error)
    toast.add({
      title: "Erreur ",
      description: (error as Error).data.message,
      timeout: 10000,
      color: "red",
    });
    raffraichir()
  }
 
};


const deleteOpération = (index: number) => {

  toast.add({
    title: 'Suppression opération', description: "Êtes-vous sur de vouloir supprimer cette opération ?",
    actions: [{
      label: 'Delete',
      click: async () => {
        dt.opérations.splice(index, 1)
        try {
          await $fetch<Client[]>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/dts/${dt._id}`,
            {
              method: "put",
              body: dt

            }
          );

        } catch (error) {

          toast.add({
            title: 'Erreur ',
            description: (error as Error).message,
            timeout: 10000,
            color: 'red'
          })
        }

        toast.add({
          title: 'Suppression opération ',
          description: 'l\'opération a bien été supprimer',

        })

        raffraichir()
        if (dataTable.value.length > 0)
          selected.value = [dataTable.value[dataTable.value.length - 1]]
      },
      variant: 'solid',
      color: 'primary',
    }],
    color: 'orange'
  })
};


const UpdateOpération = async () => {

  if (indexToUpdate != undefined) {
    dt.opérations[indexToUpdate] = editedOpération
    dt.état = acheverDt.value ? eEtat.achevée : dt.état
    dt.test = testStatus.value

    try {
      await $fetch<DT[]>(
        `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/dts/${dt._id}`,
        {
          method: "PUT",
          body: dt,
        }
      );

      toast.add({
        title: "Modification opération ",
        description: "L'opération a bien été modifiée",
      });

      isOpenUpdateOpération.value = false
      raffraichir(indexToUpdate);

    } catch (error) {
      toast.add({
        title: "Erreur ",
        description: (error as Error).data.message,
        timeout: 10000,
        color: "red",
      });
      raffraichir()
    }
  }
  indexToUpdate = undefined
}
//------------------------------------------ footer--------------------------------

const tempsTotal = computed(() => {
  refresh.value
  let total: number = 0
  dt.opérations.forEach(op => {

    total = total + Number(op.temps)

  })
  return total
})
const prixPièces = computed(() => {
  refresh.value
  let total = 0

  dt.opérations.forEach(op => {
    op.pièces.forEach(pi => {
      total = total + (pi.quantité * pi.prix)
    })
  })
  return total
})
</script>
