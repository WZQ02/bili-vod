<script setup lang="ts">
    import Noti from './components/app_noti.vue'
    import ChatBackend from './components/chat_backend.vue';
</script>

<template>
    <router-view v-slot="slotProps">
        <keep-alive>
            <component :is="slotProps.Component"></component>
        </keep-alive>
    </router-view>
    <Noti />
    <ChatBackend />
</template>