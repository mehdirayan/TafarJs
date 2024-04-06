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
          Users
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
          <UButton @click="isOpenAddUser = true" label="Add" class="mx-10" />
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
            @click="editUser(row)"
          />

          <UButton
            class="mx-2"
            icon="i-heroicons-trash"
            size="2xs"
            color="red"
            variant="outline"
            :ui="{ rounded: 'rounded-full' }"
            square
            @click="deleteUser(row)"
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
  <!-------------------------------------- modal add user------------------------------------------------- -->
  <UModal v-model="isOpenAddUser">
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
          Ajouter un utilisateur
        </h2>
      </template>
      <UForm :schema="schemaAddUser" :state="editedRow" @submit="AddUser" autocomplete="off">
        <UFormGroup label="Nom" name="nom" required>
          <UInput color="primary" variant="outline" v-model="editedRow.nom" />
        </UFormGroup>

        <div class="h-8 flex justify-center mt-4">
          <UButton type="submit" label="Save" />
        </div>
      </UForm>
    </UCard>
  </UModal>
  <!-------------------------------------- modal update user------------------------------------------------- -->
  <UModal v-model="isOpenUpdateUser">
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
          Modifier un utilisateur
        </h2>
      </template>
      <UForm :schema="schemaUpdateUser" :state="editedRow" @submit="UpdateUser" autocomplete="off">
        <UFormGroup label="Nom" name="nom" required>
          <UInput color="primary" variant="outline" v-model="editedRow.nom" />
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
import type { User } from "../utils/types";
const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const search = ref("");

//------------------------------------ table ----------------------------
const columns = [
  {
    key: "nom",
    label: "Nom",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    class: "w-9 text-center",
  },
];

const totalUsers = computed(() => {
  if (filteredRows.value) return filteredRows.value.length;
  else return 0;
});

const parsePageCount = computed(() => {
  return parseInt(pageCount.value.toString());
});
// Pagination
const page = ref(1);
const pageCount = ref(5);
const pageTotal = totalUsers; // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);

//----------------------  modal add user----------------------

const isOpenAddUser = ref(false);

const defaultRaw: User = { _id: "", nom: "" };

let editedRow: User = reactive({ ...defaultRaw });

watch(isOpenAddUser, (value) => {
  if (!value) {
    editedRow.nom = "";
  }
});

const schemaAddUser = Joi.object({
  nom: Joi.string().required(),
  _id: Joi.string().allow(""),
});
//----------------------  modal update user----------------------
const isOpenUpdateUser = ref(false);



watch(isOpenUpdateUser, (value) => {
  if (!value) {
    editedRow.nom = "";
  }
});
const schemaUpdateUser = Joi.object({
  nom: Joi.string().required(),
  _id: Joi.string().allow(""),
  __v: Joi.number().allow(""),
});

//--------------------------   data-------------------------------------

const users: Ref<User[] | null> = ref([]);

const filteredRows = computed(() => {
  if (users.value) {
    if (!search.value) {
      return users.value;
    }
    return users.value.filter((user) => {
      return Object.values(user).some((value) => {
        return String(value).toLowerCase().includes(search.value.toLowerCase());
      });
    });
  } else return [];
});

const selectedRows = computed(() => {
  if (filteredRows.value) {
    return filteredRows.value.filter((user, index) => {
      return (
        index < page.value * pageCount.value &&
        index >= (page.value - 1) * pageCount.value
      );
    });
  } else return [];
});

/**
 * Asynchronous function to refresh the users data.
 *
 * @return {Promise<void>} Promise that resolves when the users data is refreshed
 */
const raffraichir = async (): Promise<void> => {
  try {
    users.value = await $fetch<User[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/users`
    );
  } catch (error) {
    console.log(error);
  }
};

const AddUser = async () => {
  isOpenAddUser.value = false;

  try {
    await $fetch<User[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/users`,
      {
        method: "POST",
        body: { nom: editedRow.nom },
      }
    );

    toast.add({
      title: "Ajout utilisateur ",
      description: "L'utilisateur a bien été ajouté",
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

const deleteUser = async (row: User) => {
  toast.add({
    title: "Suppression utilisateur ",
    description: "Etes-vous sur de vouloir supprimer cet utilisateur ?",
    actions: [
      {
        label: "Delete",
        click: async () => {
          try {
            await $fetch<User[]>(
              `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/users/${row._id}`,
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
            title: "Suppression utilisateur ",
            description: "L'utilisateur a bien été supprimer",
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

const editUser = (row: User) => {
  editedRow = Object.assign({}, row); // create a copy of row
  isOpenUpdateUser.value = true;
};

const UpdateUser = async () => {
  isOpenUpdateUser.value = false;

  try {
    await $fetch<User[]>(
      `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/users/${editedRow._id}`,
      {
        method: "PUT",
        body: { nom: editedRow.nom },
      }
    );

    toast.add({
      title: "Modification utilisateur ",
      description: "L'utilisateur a bien été modifié",
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

</script>

<style scoped>
table tbody tr:hover {
  background-color: #f5f5f5;
}
</style>
