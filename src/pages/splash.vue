<script setup>
    import { useRouter, useRoute } from 'vue-router'
    import { onActivated, ref } from 'vue';

    const router = useRouter()
    const route = useRoute()

    const show_btn = ref(0)

    onActivated(() => {
        setTimeout(()=>{show_btn.value=1},1000)
    })
</script>

<template>
<div id="title">
    Bilibili 直播弹幕互动网页<br>
    <Transition name="fade">
        <div v-show="show_btn">
            <button @click="router.push('/config')">配置向导</button>&nbsp;
            <button @click="router.push('/about')">关于</button>
        </div>
    </Transition>
</div>

</template>

<style scoped>
#title {
    color: #000;
    font-size: var(--font-base);
    font-weight: bold;
    width: 100%;
    text-align: center;
    overflow: hidden;
    position: relative;
    top: calc(50vh - 0.75em);
    animation: zoomin .7s cubic-bezier(0, .8, .2, 1) 1;
}
@media (prefers-color-scheme: dark) {
    #title {
        color: #fff;
    }
}
</style>