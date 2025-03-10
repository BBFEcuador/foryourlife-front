<script setup lang="ts">


const props = defineProps<{
    title: string;
    description: string;
    image: string;
}>();

const emit = defineEmits(['level-selected']);

const onLevelSelected = (params: string) => {
    emit('level-selected', params.toUpperCase());
};
</script>

<template>
    <v-card elevation="1" variant="outlined" rounded="md" class="card-hover-border card-hover"
        @click="onLevelSelected(title)">
        <div>
            <v-img :src="image" height="250px" alt="post" cover class="tw:rounded-t-md align-end text-right">
                <v-card-item>
                    <v-chip class="bg-surface tw:text-body-2 tw:font-weight-medium" size="small" rounded="sm">
                        {{ description }}
                    </v-chip>
                </v-card-item>
            </v-img>
            <v-card-item class="px-6 pt-4">
                <h5 class="text-h3 my-6 custom-text-primary">
                    <p class="text-decoration-none text-center color-inherits custom-title">
                        {{ title }}
                    </p>
                </h5>
            </v-card-item>
        </div>
    </v-card>
</template>
