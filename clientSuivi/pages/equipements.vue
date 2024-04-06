<template>
  <div class="flex justify-center items-center w-full">
    <UCard
      class="mt-4 w-11/12"
      :ui="{
        base: '',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-5' },
        body: {
          padding: '',
          base: 'divide-y divide-gray-200 dark:divide-gray-700',
        },
        footer: { padding: 'p-4' },
      }"
    >
      <template #header>
        <h2
          class="font-semibold text-xl text-gray-900 dark:text-white leading-tight"
        >
          Equipements
        </h2>
      </template>
      <!-- Header and Action buttons -->
      <div class="flex justify-between items-center w-full px-4 py-3">
        <div class="flex items-center gap-1.5">
          <span class="text-sm leading-5">Rows per page:</span>

          <USelect
            v-model="pageCount"
            :options="[3, 5, 10, 20, 30, 40]"
            class="me-2 w-20"
            size="xs"
          />
        </div>
        <div>
          <UInputMenu
            v-model="choixClient"
            :options="clients"
            placeholder="Clients"
            option-attribute="nom"
            value-attribute="_id"
            :search-attributes="['nom']"
            @change="getEquipementsByClient()"
            :ui="{ icon: { leading: { pointer: '' } } }"
          >
            <template #leading>
              <UButton
                v-show="choixClient !== ''"
                color="gray"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click="
                  choixClient = '';
                  refreshSearch = !refreshSearch;
                "
              />
            </template>
          </UInputMenu>
        </div>
        <div>
          <UButton @click="showModalAddEquipement" label="Add" class="mx-10" />
        </div>
        <!-- Filters -->
        <div class="flex items-center justify-end gap-3 px-4 py-3">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search..."
          />
        </div>
      </div>
      <UTable
        :columns="columns"
        :rows="selectedRows"
        :row-class-name="'hover:bg-gray-200'"
      >
        <template #actions-data="{ row }">
          <UButton
            class="mx-2"
            icon="i-heroicons-pencil-square"
            size="2xs"
            color="orange"
            variant="outline"
            :ui="{ rounded: 'rounded-full' }"
            square
            @click="editEquipement(row)"
          />

          <UButton
            class="mx-2"
            icon="i-heroicons-trash"
            size="2xs"
            color="red"
            variant="outline"
            :ui="{ rounded: 'rounded-full' }"
            square
            @click="deleteEquipement(row)"
          />
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

          <UPagination
            v-model="page"
            :page-count="parsePageCount"
            :total="pageTotal"
            :ui="{
              wrapper: 'flex items-center gap-1',
              rounded: '!rounded-full min-w-[32px] justify-center',
              default: {
                activeButton: {
                  variant: 'outline',
                },
              },
            }"
          />
        </div>
      </template>
    </UCard>
  </div>
  <!-------------------------------------- modal add Equipement------------------------------------------------- -->
  <UModal v-model="isOpenAddEquipement">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <h2
          class="font-semibold text-xl text-gray-900 dark:text-white leading-tight"
        >
          Ajouter un équipement
        </h2>
      </template>
      <UForm
        :schema="schemaAddEquipement"
        :state="editedRow"
        @submit="AddEquipement"
        autocomplete="off"
      >
        <div>
          <UFormGroup label="Client" name="idClient" required>
            <UInputMenu
              v-model="editedRow.idClient"
              :options="clients"
              option-attribute="nom"
              :search-attributes="['nom']"
              value-attribute="_id"
            />
          </UFormGroup>
          <UFormGroup label="Désignation" name="désignation" required>
            <UInput v-model="editedRow.désignation" />
          </UFormGroup>

          <UFormGroup label="Marque" name="marque">
            <UInput v-model="editedRow.marque" />
          </UFormGroup>
          <UFormGroup label="Model" name="model">
            <UInput v-model="editedRow.modele" />
          </UFormGroup>
          <UFormGroup label="NumSerie" name="numSerie" required>
            <UInput v-model="editedRow.numSerie" />
          </UFormGroup>
        </div>
        <div class="h-8 flex justify-center mt-4">
          <UButton label="Add" type="submit" />
        </div>
      </UForm>
    </UCard>
  </UModal>
  <!-------------------------------------- modal update Equipement ------------------------------------------------- -->
  <UModal v-model="isOpenUpdateEquipement">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <h2
          class="font-semibold text-xl text-gray-900 dark:text-white leading-tight"
        >
          Modifier un équipement
        </h2>
      </template>
      <UForm
        :schema="schemaUpdateEquipement"
        :state="editedRow"
        @submit="UpdateEquipement"
        autocomplete="off"
      >
        <UFormGroup label="Client" name="idClient" required>
          <UInputMenu
            v-model="editedRow.idClient"
            :options="clients"
            option-attribute="nom"
            :search-attributes="['nom']"
            value-attribute="_id"
          />
        </UFormGroup>
        <UFormGroup label="Désignation" name="désignation" required>
          <UInput v-model="editedRow.désignation" />
        </UFormGroup>

        <UFormGroup label="Marque" name="marque">
          <UInput v-model="editedRow.marque" />
        </UFormGroup>
        <UFormGroup label="Model" name="model">
          <UInput v-model="editedRow.modele" />
        </UFormGroup>
        <UFormGroup label="NumSerie" name="numSerie" required>
          <UInput v-model="editedRow.numSerie" />
        </UFormGroup>

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
import type { Equipement, Client } from "../utils/types";
import type { FormSubmitEvent } from "#ui/types";
import { reactive } from "vue";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const search = ref("");

const choixClient = ref("");

//--------------------------------- table --------------------------------------------
const columns = [
  {
    key: "désignation",
    label: "Désignation",
    sortable: true,
  },
  {
    key: "marque",
    label: "Marque",
    sortable: true,
  },
  {
    key: "modele",
    label: "Modele",
    sortable: true,
  },
  {
    key: "numSerie",
    label: "NumSerie",
    sortable: true,
  },

  {
    key: "nomClient",
    label: "Client",
    sortable: true,
  },

  {
    key: "actions",
    label: "Actions",
    sortable: false,
  },
];

const totalEquipements = computed(() => {
  if (filteredRows.value) return filteredRows.value.length;
  else return 0;
});

const parsePageCount = computed(() => {
  return parseInt(pageCount.value.toString());
});
// Pagination
const page = ref(1);
const pageCount = ref(5);
const pageTotal = totalEquipements; // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);

//----------------------  modal add équipement----------------------

const defaultEquipement: Equipement = {
  // _id: "",
  idClient: "",
  nomClient: "",
  désignation: "",
  marque: "",
  modele: "",
  numSerie: "",
};

let editedRow: Equipement = reactive(Object.assign({}, defaultEquipement));

const isOpenAddEquipement = ref(false);

watch(isOpenAddEquipement, (value) => {
  if (!value) {
    editedRow.désignation = "";
    editedRow.marque = "";
    editedRow.modele = "";
    editedRow.numSerie = "";
    editedRow.idClient = "";
  }
});

const schemaAddEquipement = Joi.object({
  _id: Joi.string().allow(""),
  idClient: Joi.string().required(),
  nomClient: Joi.string().allow(""),
  désignation: Joi.string().required(),
  marque: Joi.string().allow(""),
  modele: Joi.string().allow(""),
  numSerie: Joi.string().required(),
});

//----------------------  modal update équipement----------------------
const isOpenUpdateEquipement = ref(false);

watch(isOpenUpdateEquipement, (value) => {
  if (!value) {
    editedRow.désignation = "";
    editedRow.marque = "";
    editedRow.modele = "";
    editedRow.numSerie = "";
    editedRow.idClient = "";
  }
});

const schemaUpdateEquipement = Joi.object({
  _id: Joi.string().allow(""),
  idClient: Joi.string().required(),
  nomClient: Joi.string().allow(""),
  désignation: Joi.string().required(),
  marque: Joi.string().allow(""),
  modele: Joi.string().allow(""),
  numSerie: Joi.string().required(),
  __v: Joi.number().allow(""),
});
//--------------------------   data-------------------------------------

let equipements: Equipement[] | null = reactive([]);

const refreshSearch = ref(false);

const selectedRows = computed(() => {
  if (filteredRows.value) {
    return filteredRows.value.filter((equipement, index) => {
      return (
        index < page.value * pageCount.value &&
        index >= (page.value - 1) * pageCount.value
      );
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

//------------------------------- raffraichissement list Equipement
const raffraichir = async () => {
  try {
    equipements = await $fetch<Equipement[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/equipements`
    );

    equipements.map((equipement) => {
      equipement.nomClient = clients.find(
        (client) => client._id == equipement.idClient
      )?.nom;
    });
    refreshSearch.value = !refreshSearch.value;
  } catch (error) {
    console.log(error);
  }
};

await raffraichir();

//----------------------------- fonction filtrage --------------------------
const filteredRows = computed(() => {
  refreshSearch.value; //pour rafraichir
  if (equipements) {
    if (!search.value) {
      if (choixClient.value == "") return equipements;
      else
        return equipements.filter(
          (equipement) => equipement.idClient === choixClient.value
        );
    }
    return equipements.filter((equipement) => {
      return Object.values(equipement).some((value) => {
        return (
          String(value).toLowerCase().includes(search.value.toLowerCase()) &&
          (choixClient.value == ""
            ? true
            : equipement.idClient === choixClient.value)
        );
      });
    });
  } else return [];
});

const showModalAddEquipement = () => {
  if (choixClient.value !== "") editedRow.idClient = choixClient.value;
  else editedRow.idClient = null;

  isOpenAddEquipement.value = true;
};

const AddEquipement = async () => {
  isOpenAddEquipement.value = false;

  const { _id, ...data } = editedRow;
  try {
    await $fetch<Equipement[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/equipements`,
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

const deleteEquipement = async (equipement: Equipement) => {
  toast.add({
    title: "Suppression équipement ",
    description: "Etes-vous sur de vouloir supprimer cet équipement ?",
    actions: [
      {
        label: "Delete",
        click: async () => {
          try {
            await $fetch(
              `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/equipements/${equipement._id}`,
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
            title: "Suppression équipement ",
            description: "L'équipement a bien été supprimer",
          });
          raffraichir();
        },
        variant: "solid",
        color: "primary",
      },
    ],
    color: "orange",
  });
};

const editEquipement = (equipement: Equipement) => {
  editedRow = Object.assign({}, equipement);

  isOpenUpdateEquipement.value = true;
};

const UpdateEquipement = async (event: FormSubmitEvent<Equipement>) => {
  isOpenUpdateEquipement.value = false;
  const { _id, ...data } = editedRow;
  try {
    await $fetch<Equipement[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/equipements/${event.data._id}`,
      {
        method: "PUT",
        body: data,
      }
    );

    toast.add({
      title: "Modification équipement ",
      description: "L'équipement a bien été modifié",
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

const getEquipementsByClient = async () => {
  refreshSearch.value = !refreshSearch.value;
};
</script>
<style>
table tbody tr:hover {
  background-color: #f5f5f5;
}
</style>