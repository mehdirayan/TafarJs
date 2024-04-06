<template>
    <div class="flex justify-center items-center w-full">

        <UCard class="  mt-4 w-10/12 " :ui="{
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
                <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                    Clients
                </h2>
            </template>
            <!-- Header and Action buttons -->
            <div class="flex justify-between items-center w-full px-4 py-3">
                <div class="flex items-center gap-1.5">
                    <span class="text-sm leading-5">Rows per page:</span>

                    <USelect v-model="pageCount" :options="[3, 5, 10, 20, 30, 40]" class="me-2 w-20" size="xs" />
                </div>
                <div>
                    <UButton @click="isOpenAddClient = true" label="Add Client" class="mx-10" />
                </div>
                <!-- Filters -->
                <div class="flex items-center justify-end gap-3 px-4 py-3">
                    <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
                </div>
            </div>
            <UTable :columns="columns" :rows="selectedRows" :row-class-name="'hover:bg-gray-200'">
                <template #contacts-data="{ row }">
                    <UPopover mode="hover" v-if="row.contacts.length > 0">
                        <p>Contacts</p>

                        <template #panel>

                            <div class="p-4">
                                <UTable :rows="row.contacts" :row-class-name="'hover:bg-gray-200'">
                                </UTable>
                            </div>
                        </template>
                    </UPopover>
                    <p v-else>No Contacts</p>
                </template>
                <template #actions-data="{ row }">
                    <UButton class="mx-2" icon="i-heroicons-pencil-square" size="2xs" color="orange" variant="outline"
                        :ui="{ rounded: 'rounded-full' }" square @click="editClient(row)" />

                    <UButton class="mx-2" icon="i-heroicons-trash" size="2xs" color="red" variant="outline"
                        :ui="{ rounded: 'rounded-full' }" square @click="deleteClient(row)" />
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
    <!--- ----------------------------------- modal add client------------------------------------------------- -->
    <UModal v-model="isOpenAddClient" :ui="{ width: 'sm:max-w-3xl' }" prevent-close>
        <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',

        }">

            <template #header>
                <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                    Ajouter un Client
                </h2>
            </template>



            <UForm :schema="schemaAddClient" :state="dataAddClient" class="space-y-4" @submit="onAddClient"
                autocomplete="off" @error="onError">
                <div class="grid md:grid-cols-2 gap-4">
                    <UFormGroup label="Nom" name="nom" required>
                        <UInput v-model="dataAddClient.nom" />
                    </UFormGroup>
                    <UFormGroup label="Activité" name="activité">
                        <UInputMenu v-model="dataAddClient.activité" :options="activitéList" />
                    </UFormGroup>

                    <UFormGroup label="Adresse" name="adresse">
                        <UInput v-model="dataAddClient.adresse" />
                    </UFormGroup>
                    <UFormGroup label="RC" name="rc">
                        <UInput v-model="dataAddClient.rc" />
                    </UFormGroup>
                    <UFormGroup label="AI" name="ai">
                        <UInput v-model="dataAddClient.ai" />
                    </UFormGroup>
                    <UFormGroup label="NIF" name="nif">
                        <UInput v-model="dataAddClient.nif" />
                    </UFormGroup>
                    <UFormGroup label="NIS" name="nis">
                        <UInput v-model="dataAddClient.nis" />
                    </UFormGroup>
                </div>

                <div>
                    <div class="flex justify-between">
                        <div class="py-3 font-semibold">
                            <h2>Contacts</h2>
                        </div>
                        <UButton icon="i-heroicons-user-plus" size="md" color="primary" variant="solid" class="px-4 m-2"
                            @click="isOpenAddContact = true" />
                    </div>
                    <div class="border rounded-xl">
                        <UTable :rows="dataAddClient.contacts" :columns="contactColumns">

                            <template #actions-data="{ row }">

                                <UButton class="mx-2" icon="i-heroicons-trash" size="2xs" color="red" variant="outline"
                                    :ui="{ rounded: 'rounded-full' }" square @click="deleteContact(row)" />
                            </template>

                        </UTable>
                    </div>
                </div>


                <UButton label="Add Client" variant="solid" type="submit" class="mt-4" />



            </UForm>

        </UCard>
        <!---------------------------------------modal add Contact ------------------------------------------------------------>

        <UModal v-model="isOpenAddContact">
            <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',

        }">

                <template #header>
                    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                        Ajouter un Contact
                    </h2>
                </template>

                <div>
                    <UForm :schema="schemaAddContact" :state="contactData" @submit="onAddContact" autocomplete="off">
                        <div>
                            <UFormGroup label="Nom Prénom" name="nom" required>
                                <UInput v-model="contactData.nom" />
                            </UFormGroup>
                            <UFormGroup label="Téléphone" name="téléphone" required>
                                <UInput v-model="contactData.téléphone" />
                            </UFormGroup>
                            <UFormGroup label="Email" name="email">
                                <UInput v-model="contactData.email" />
                            </UFormGroup>
                        </div>

                        <UButton label="Add Contact" variant="solid" type="submit" class="mt-4" />

                    </UForm>
                </div>

            </UCard>
        </UModal>
    </UModal>
    <!-------------------------------------- modal update client------------------------------------------------- -->

    <UModal v-model="isOpenUpdateClient" :ui="{ width: 'sm:max-w-3xl' }" prevent-close>
        <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',

        }">

            <template #header>
                <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                    Modifier un Client
                </h2>
            </template>



            <UForm :schema="schemaAddClient" :state="editedRow" class="space-y-4" @submit="onAddUpdateClient"
                autocomplete="off" @error="onError">
                <div class="grid md:grid-cols-2 gap-4">
                    <UFormGroup label="Nom" name="nom" required>
                        <UInput v-model="editedRow.nom" />
                    </UFormGroup>
                    <UFormGroup label="Activité" name="activité">
                        <UInputMenu v-model="editedRow.activité" :options="activitéList" />
                    </UFormGroup>

                    <UFormGroup label="Adresse" name="adresse">
                        <UInput v-model="editedRow.adresse" />
                    </UFormGroup>
                    <UFormGroup label="RC" name="rc">
                        <UInput v-model="editedRow.rc" />
                    </UFormGroup>
                    <UFormGroup label="AI" name="ai">
                        <UInput v-model="editedRow.ai" />
                    </UFormGroup>
                    <UFormGroup label="NIF" name="nif">
                        <UInput v-model="editedRow.nif" />
                    </UFormGroup>
                    <UFormGroup label="NIS" name="nis">
                        <UInput v-model="editedRow.nis" />
                    </UFormGroup>
                </div>

                <div>
                    <div class="flex justify-between">
                        <div class="py-3 font-semibold">
                            <h2>Contacts</h2>
                        </div>
                        <UButton icon="i-heroicons-user-plus" size="md" color="primary" variant="solid" class="px-4 m-2"
                            @click="isOpenAddUpdateContact = true" />
                    </div>
                    <div class="border rounded-xl">
                        <UTable :rows="editedRow.contacts" :columns="contactColumns">

                            <template #actions-data="{ row }">

                                <UButton class="mx-2" icon="i-heroicons-trash" size="2xs" color="red" variant="outline"
                                    :ui="{ rounded: 'rounded-full' }" square @click="deleteUpdateContact(row)" />
                            </template>

                        </UTable>
                    </div>
                </div>


                <UButton label="Update Client" variant="solid" type="submit" class="mt-4" />



            </UForm>

        </UCard>
        <!---------------------------------------modal add update Contact ------------------------------------------------------------>

        <UModal v-model="isOpenAddUpdateContact">
            <UCard :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',

        }">

                <template #header>
                    <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                        Ajouter un Contact
                    </h2>
                </template>

                <div>
                    <UForm :schema="schemaAddContact" :state="contactUpdateData" @submit="onAddUpdateContact"
                        autocomplete="off">
                        <div>
                            <UFormGroup label="Nom Prénom" name="nom" required>
                                <UInput v-model="contactUpdateData.nom" />
                            </UFormGroup>
                            <UFormGroup label="Téléphone" name="téléphone" required>
                                <UInput v-model="contactUpdateData.téléphone" />
                            </UFormGroup>
                            <UFormGroup label="Email" name="email">
                                <UInput v-model="contactUpdateData.email" />
                            </UFormGroup>
                        </div>

                        <UButton label="Add Contact" variant="solid" type="submit" class="mt-4" />

                    </UForm>
                </div>

            </UCard>
        </UModal>
    </UModal>

    <UNotifications />

</template>

<script setup lang="ts">
import Joi from 'joi'

import type { Contact, Client, Activité } from "../utils/types";
import type { FormSubmitEvent } from '#ui/types'



const runtimeConfig = useRuntimeConfig();
const toast = useToast()

const search = ref("");

const columns = [
    {
        key: "nom",
        label: "Nom",
        sortable: true,
    },
    {
        key: "activité",
        label: "Activité",
        sortable: false,
    },
    {
        key: "adresse",
        label: "Adresse",
        sortable: false,
    },

    {
        key: "contacts",
        label: "Contacts",
        sortable: false,
    },
    {
        key: "actions",
        label: 'Actions',
        sortable: false,
        class: "w-9 text-center",
    },
];


const totalClients = computed(() => {
    if (filteredRows.value) return filteredRows.value.length;
    else return 0;
});

const parsePageCount = computed(() => {
    return parseInt(pageCount.value.toString());
});
// Pagination
const page = ref(1);
const pageCount = ref(5);
const pageTotal = totalClients; // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
    Math.min(page.value * pageCount.value, pageTotal.value)
);



//----------------------  modal add Client ----------------------

const activitéList: Ref<string[]> = ref([])

const isOpenAddClient = ref(false);

//----------------------- pour fermer la modal --------------------

defineShortcuts({
    escape: {
        usingInput: true,
        handler: () => {
            isOpenAddClient.value = false
            isOpenUpdateClient.value = false
        }
    }
})

watch(isOpenAddClient, (value) => {
    if (!value) {
        dataAddClient = Object.assign({}, defaultDataAddClient)
        dataAddClient.contacts = []
    }
});


const schemaAddContact = Joi.object({
    "nom": Joi.string().required(),
    "téléphone": Joi.string().pattern(new RegExp('^(([0-9 ]?)*)+$')).required(),
    "email": Joi.string().email({ tlds: false }).allow("")


})

const schemaAddClient = Joi.object({
    "_id": Joi.string().allow(""),
    "nom": Joi.string().required(),
    "activité": Joi.string().required(),
    "adresse": Joi.string().allow(""),
    "rc": Joi.string().allow(""),
    "ai": Joi.string().allow(""),
    "nif": Joi.string().allow(""),
    "nis": Joi.string().allow(""),
    "contacts": Joi.array().allow(""),

})



const defaultDataAddClient: Client = {
    _id: "",
    nom: "",
    activité: "",
    adresse: "",
    rc: "",
    ai: "",
    nif: "",
    nis: "",
    contacts: [] as Contact[]

}
let dataAddClient: Client = reactive(Object.assign({}, defaultDataAddClient))

const onError = (event: any) => {
    console.log(event)
}
const onAddClient = async (event: FormSubmitEvent<Client>) => {

    isOpenAddClient.value = false;

    const { _id, ...data } = event.data
    try {

        await $fetch<Client[]>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients`,
            {
                method: "POST",
                body: data,

            }
        );

        toast.add({
            title: 'Ajout Client ',
            description: 'Le client a bien été ajouté',

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


const contactColumns = [
    {
        key: "nom",
        label: "Nom",
        sortable: true,
    },
    {
        key: "téléphone",
        label: "Téléphone",
        sortable: false,
    },
    {
        key: "email",
        label: "Email",
        sortable: false,
    },
    {
        key: "actions",
        label: 'Actions',
        sortable: false,
        class: "w-9 text-center",
    },
]



//----------------------  modal update client----------------------
const isOpenUpdateClient = ref(false);



const defaultRaw: Client = {
    _id: "",
    nom: "",
    activité: "",
    adresse: "",
    rc: "",
    ai: "",
    nif: "",
    nis: "",
    contacts: [],


};

const editedRow: Ref<Client> = ref(defaultRaw);


const editClient = (row: Client) => {
    const { __v, ...data } = row

    editedRow.value = Object.assign({}, data)

    isOpenUpdateClient.value = true
}

const onAddUpdateClient = async (event: FormSubmitEvent<Client>) => {
    isOpenUpdateClient.value = false;

    const { _id, ...data } = event.data
    try {

        await $fetch<Client[]>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients/${_id}`,
            {
                method: "PUT",
                body: data

            }
        );

        toast.add({
            title: 'Modifier un Client ',
            description: 'Le client a bien été modifié',

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
//----------------------  modal update contact----------------------
const isOpenAddUpdateContact = ref(false);

const contactDefault: Contact = {
    nom: "",
    téléphone: "",
    email: "",


}

watch(isOpenAddUpdateContact, (value) => {
    if (!value) {
        contactUpdateData = Object.assign({}, contactDefault)

    }
});


let contactUpdateData: Contact = reactive(Object.assign({}, contactDefault))

const onAddUpdateContact = () => {
    isOpenAddUpdateContact.value = false

    editedRow.value.contacts.push(contactUpdateData)

    isOpenAddContact.value = false;
    toast.add({
        title: 'Ajout contact ',
        description: 'Le contact a bien été ajouté',

    })
}

const deleteUpdateContact = (index: number) => {

    toast.add({
        title: 'Suppression contact ', description: "Etes-vous sur de vouloir supprimer ce contact ?",
        actions: [{
            label: 'Delete',
            click: async () => {

                editedRow.value.contacts.splice(index, 1)

            },
            variant: 'solid',
            color: 'primary',
        }],
        color: 'orange'
    })

}

//--------------------------   modal contact -------------------------------------

const isOpenAddContact = ref(false);

watch(isOpenAddContact, (value) => {
    if (!value) {
        contactData = Object.assign({}, contactDefault)

    }
});


let contactData: Contact = reactive(Object.assign({}, contactDefault))

const onAddContact = () => {

    dataAddClient.contacts.push(contactData)

    isOpenAddContact.value = false;
    toast.add({
        title: 'Ajout contact ',
        description: 'Le contact a bien été ajouté',

    })
}

const deleteContact = (index: number) => {
    toast.add({
        title: 'Suppression contact ', description: "Etes-vous sur de vouloir supprimer ce contact ?",
        actions: [{
            label: 'Delete',
            click: async () => {

                dataAddClient.contacts.splice(index, 1)

            },
            variant: 'solid',
            color: 'primary',
        }],
        color: 'orange'
    })

}

//--------------------------   data-------------------------------------

const clients: Ref<Client[] | null> = ref([]);



const filteredRows = computed(() => {
    if (clients.value) {
        if (!search.value) {
            return clients.value;
        }
        return clients.value.filter((client) => {
            return Object.values(client).some((value) => {
                return String(value).toLowerCase().includes(search.value.toLowerCase());
            });
        });
    }
    else return []

});

const selectedRows = computed(() => {
    if (filteredRows.value) {
        return filteredRows.value.filter((client, index) => {
            return (
                index < page.value * pageCount.value &&
                index >= (page.value - 1) * pageCount.value
            );
        });
    } else return [];
});

const raffraichir = async () => {
    try {

        clients.value = await $fetch<Client[]>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients`
        );


    } catch (error) {

        console.log(error);
    }


};


const deleteClient = async (row: Client) => {
    toast.add({
        title: 'Suppression Client ', description: "Etes-vous sur de vouloir supprimer ce client ?",
        actions: [{
            label: 'Delete',
            click: async () => {
                try {
                    await $fetch<Client[]>(
                        `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/clients/${row._id}`,
                        {
                            method: "DELETE",

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
                    title: 'Suppression client ',
                    description: 'le client a bien été supprimer',

                })
                raffraichir()
            }
        }]
    })
}


//----------------------- mise à jour liste activités-------------------------

const getListActivités = async () => {
    try {

        return await $fetch<Activité[]>(
            `${runtimeConfig.public.SERVER_URL}:${runtimeConfig.public.SERVER_PORT}/activites`
        );


    } catch (error) {

        console.log(error);
    }


}

const list = await getListActivités()

if (list)
    activitéList.value = list.map((activité) => activité.désignation)









raffraichir()




</script>