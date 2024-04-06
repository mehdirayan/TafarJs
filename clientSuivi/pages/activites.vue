<template>
  <div class="flex justify-center items-center w-full">
    <UCard
      class="mt-4"
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
          Activités
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
          <UButton
            @click="isOpenAddActivité = true"
            label="Add"
            class="mx-10"
          />
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
            @click="editActivité(row)"
          />

          <UButton
            class="mx-2"
            icon="i-heroicons-trash"
            size="2xs"
            color="red"
            variant="outline"
            :ui="{ rounded: 'rounded-full' }"
            square
            @click="deleteActivité(row)"
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
  <!-------------------------------------- modal add activité------------------------------------------------- -->
  <UModal v-model="isOpenAddActivité">
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
          Ajouter une activité
        </h2>
      </template>
      <UForm
        :schema="schemaAddActivité"
        :state="editedRow"
        class="space-y-4"
        @submit="onAddActivité"
      >
        <UFormGroup label="Désignation" name="désignation">
          <UInput
            color="primary"
            variant="outline"
            v-model="editedRow.désignation"
            autocomplete="off"
          />
        </UFormGroup>

        <div class="h-8 flex justify-center">
          <UButton type="submit" label="Save" />
        </div>
      </UForm>
    </UCard>
  </UModal>
  <!-------------------------------------- modal update activité------------------------------------------------- -->
  <UModal v-model="isOpenUpdateActivité">
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
          Modifier une activité
        </h2>
      </template>
      <UForm
        :schema="schemaUpdateActivité"
        :state="editedRow"
        @submit="onUpdateActivité"
        autocomplete="off"
      >
        <UFormGroup label="Désignation" name="désignation">
          <UInput
            color="primary"
            variant="outline"
            v-model="editedRow.désignation"
            autocomplete="off"
          />
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
import type { Activité } from "../utils/types";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const search = ref("");
//------------------------------- table ----------------------------
const columns = [
  {
    key: "désignation",
    label: "Désignation",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    class: "w-9 text-center",
  },
];

const totalActivités = computed(() => {
  if (filteredRows.value) return filteredRows.value.length;
  else return 0;
});

const parsePageCount = computed(() => {
  return parseInt(pageCount.value.toString());
});
// Pagination
const page = ref(1);
const pageCount = ref(5);
const pageTotal = totalActivités; // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);

//----------------------  modal add Activité----------------------

const isOpenAddActivité = ref(false);

const defaultRaw: Activité = { _id: "", désignation: "" };

let editedRow: Activité = reactive({ ...defaultRaw });

watch(isOpenAddActivité, (value) => {
  if (!value) {
    editedRow.désignation = "";
  }
});

const schemaAddActivité = Joi.object({
  désignation: Joi.string().required(),
  _id: Joi.string().allow(""),
});

//----------------------  modal update activité----------------------
const isOpenUpdateActivité = ref(false);

watch(isOpenUpdateActivité, (value) => {
  if (!value) {
    editedRow.désignation = "";
  }
});

const schemaUpdateActivité = Joi.object({
  désignation: Joi.string().required(),
  _id: Joi.string().allow(""),
  __v: Joi.number().allow(""),
});

const editActivité = (row: Activité) => {
  editedRow = Object.assign({}, row); // create a copy of row
  isOpenUpdateActivité.value = true;
};
//--------------------------   data-------------------------------------

const activités: Ref<Activité[] | null> = ref([]);

const filteredRows = computed(() => {
  if (activités.value) {
    if (!search.value) {
      return activités.value;
    }
    return activités.value.filter((activité) => {
      return Object.values(activité).some((value) => {
        return String(value).toLowerCase().includes(search.value.toLowerCase());
      });
    });
  } else return [];
});

const selectedRows = computed(() => {
  if (filteredRows.value) {
    return filteredRows.value.filter((activité, index) => {
      return (
        index < page.value * pageCount.value &&
        index >= (page.value - 1) * pageCount.value
      );
    });
  } else return [];
});

/**
 * Refreshes the activities by fetching them from the server.
 *
 * @return {Promise<void>} 
 */
const raffraichir = async (): Promise<void> => {
  try {
    activités.value = await $fetch<Activité[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/activites`
    );
  } catch (error) {
    console.log(error);
  }
};

/**
 * Function to handle adding an activité.
 */
const onAddActivité = async () => {
  isOpenAddActivité.value = false;

  try {
    await $fetch<Activité>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/activites`,
      {
        method: "POST",
        body: { désignation: editedRow.désignation },
      }
    );

    toast.add({
      title: "Ajout activité ",
      description: "L'activité a bien été ajouté",
    });
  } catch (error) {
    toast.add({
      title: "Erreur ",
      description: (error as Error).message,
      timeout: 10000,
      color: "red",
    });
  }

  raffraichir();
};

/**
 * Delete a given activity.
 *
 * @param {Activité} row - The activity to be deleted
 * @return {void} 
 */
const deleteActivité = async (row: Activité) => {
  toast.add({
    title: "Suppression activité ",
    description: "Etes-vous sur de vouloir supprimer cet activité ?",
    actions: [
      {
        label: "Delete",
        click: async () => {
          try {
            await $fetch<Activité[]>(
              `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/activites/${row._id}`,
              {
                method: "DELETE",
              }
            );
          } catch (error) {
            toast.add({
              title: "Erreur ",
              description: (error as Error).message,
              timeout: 10000,
              color: "red",
            });
          }

          toast.add({
            title: "Suppression activité ",
            description: "L'activité a bien été supprimer",
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



/**
 * Function to handle updating Activité data.
 *
 * @return {Promise<void>} This function does not return anything.
 */
const onUpdateActivité = async () => {
  isOpenUpdateActivité.value = false;

  try {
    await $fetch<Activité[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/activites/${editedRow._id}`,
      {
        method: "PUT",
        body: { désignation: editedRow.désignation },
      }
    );

    toast.add({
      title: "Modification activité ",
      description: "L'activité a bien été modifié",
    });
  } catch (error) {
    toast.add({
      title: "Erreur ",
      description: (error as Error).message,
      timeout: 10000,
      color: "red",
    });
  }

  raffraichir();
};

//------------------- raffraichissement initiale ----------------------
await raffraichir();

//------------------- definition de type------------------------------
</script>

<style scoped>
table tbody tr:hover {
  background-color: #f5f5f5;
}
</style>
