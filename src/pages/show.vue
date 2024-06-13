<script setup>
    import { ref,getCurrentInstance } from 'vue'
    const gCI = getCurrentInstance()
    gCI.proxy?.$bus.on('user_danmaku',(data) => {
        mi_show.value = 1
        msg_info.value.name = data.uname+"："
        msg_info.value.text = data.text
    })
    gCI.proxy?.$bus.on('user_activity',(data) => {
        clearTimeout(mi2show_timer)
        mi2_show.value = 1
        msg_info.value.u_i_1 = data.uname
        if (data.type) {
            msg_info.value.u_i_2 = "关注了直播间"
        }
        msg_info.value.u_i_2 = "进入直播间"
        mi2show_timer = setTimeout(()=>{mi2_show.value = 0},10000)
    })
    
    const mi_show = ref(0)
    const mi2_show = ref(0)
    const msg_info = ref({
        name: '',
        text: '',
        u_i_1: '',
        u_i_2: ''
    })

    let mi2show_timer
</script>

<template>
    <div id="container2">
        <Transition name="fade">
            <div id="mc_outer">
                <div id="msg_container" v-show="mi_show">
                    <div id="username">{{ msg_info.name }}</div>
                    <div id="message">{{ msg_info.text }}</div>
                </div>
            </div>
        </Transition>
        <Transition name="fade">
            <div id="userinfo" v-show="mi2_show">
                <div id="u_i_1">{{ msg_info.u_i_1 }}</div>
                <div id="u_i_2">{{ msg_info.u_i_2 }}</div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
    #container2 {
        background-color: #111;
    }
    #mc_outer {
        display: flex;
        height: 100vh;
        align-items: center;
        justify-content: center;
    }
    #msg_container {
        color: #fff;
        font-weight: bold;
        text-align: center;
        align-items: center;
        position: relative;
        max-width: 90vw;
        margin: auto;
        animation: zoomin .7s cubic-bezier(0.3, 0, 0, 1) 1;
    }
    #userinfo {
        color: #888;
        font-weight: bold;
        position: absolute;
        left: 32px;
        bottom: 28px;
    }
    #u_i_1 {
        font-size: calc(var(--font-base)*.6);
    }
    #u_i_2 {
        font-size: calc(var(--font-base)*.4);
    }
    #username {
        font-size: var(--font-base);
    }
    #message {
        font-size: calc(var(--font-base)*2);
    }
</style>