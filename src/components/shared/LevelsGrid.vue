<script setup lang="ts">
const props = defineProps<{
    title: string
    image: string
}>()

const emit = defineEmits(['level-selected'])

const onSelectLevel = () => {
    emit('level-selected',props.title.toUpperCase())
}
</script>
<template>
    <VCard @click="onSelectLevel">
        <v-img color="surface-variant" height="200" :src="props.image" cover>
        </v-img>
        <v-card-text>
          <div class="font-weight-bold ms-1 mb-2">{{ props.title }}</div>
        </v-card-text>
    </VCard>
</template>

<style scoped></style>