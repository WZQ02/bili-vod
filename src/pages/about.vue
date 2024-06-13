<script setup>
    import { useRouter, useRoute } from 'vue-router'
    import { reactive,ref,getCurrentInstance,onMounted } from 'vue'
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiArrowLeft } from '@mdi/js'
    const gCI = getCurrentInstance()
    
    const step1_input1 = ref(null)
    const gen_link = ref("")
    const router = useRouter()
    const route = useRoute()

    const configdata = reactive({
        roomid: '',
        scene: 1
    })
    function ts(url) {
        window.location.href = url
    }
</script>

<template>
    <div id="container2">
        <div id="about">
            <div class="cf_steps" id="cf_step_1">
                <h2>
                    <span class="back_btn"><svg-icon type="mdi" :path="mdiArrowLeft" @click="router.push('/')"></svg-icon></span>
                    关于
                </h2>
                <p class="_15h">试着写了个可以与 B 站直播间弹幕互动的网页。<br>
                    部分代码实现参考自 B 站专栏<br>
                    <a href="https://www.bilibili.com/read/cv14101053/">使用JavaScript中的WebSocket获取b站直播间弹幕 by 鱼肉烧。</a>
                </p>
                <button @click="ts('https://wzq02.top')">返回 WZQ'02 的小站</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
#about {
    position: absolute;
    display: flex;
    top: 0px;
    bottom: 0px;
    margin: auto;
}
#about .cf_steps {
    background: #fff;
    position: relative;
    left: calc(50vw - 50%);
    margin: auto;
    padding: 16px 32px;
    box-shadow: 0px 0px 32px rgba(0,0,0,0.4);
    border-radius: 4px;
    animation: zoomin2 .3s cubic-bezier(0.3, 0, 0, 1) 1;
}
@media (prefers-color-scheme: dark) {
    #about .cf_steps {
        background: #222;
    }
}
</style>