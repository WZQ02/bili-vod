<script setup>
    import { ref,getCurrentInstance } from 'vue'

    const stp_noti_main = ref(null)
    const stp_noti_timer = ref(null)
    const stp_noti_content = ref("")//提示内容
    const s_n_show = ref(0)

    const gCI = getCurrentInstance()
    let s_n_show_timeout

    let stp_noti_popup = (content) => {
        if (s_n_show.value == 1) {//如果之前已经触发过提示，重置计时和动画
            clearTimeout(s_n_show_timeout)
            if (stp_noti_timer.value) {
                stp_noti_timer.value.style.animation = "none"
                setTimeout(()=>{stp_noti_timer.value.style.animation = null},5)
            }
        }
        s_n_show.value = 1;
        stp_noti_content.value = content;
        s_n_show_timeout = setTimeout(()=>{s_n_show.value = 0;},7000)
    }
    let hide_s_n = () => {
        clearTimeout(s_n_show_timeout)
        s_n_show.value = 0
    }

    gCI.proxy?.$bus.on('trigger_popup',(content)=>{//触发提示
        stp_noti_popup(content)
    })
</script>

<template>
    <Transition name="fade">
        <div id="stp_noti_main" ref="stp_noti_main" v-if="s_n_show" @click="hide_s_n()">
            <div id="stp_noti_timer" ref="stp_noti_timer"></div>
            <div id="stp_noti_content">{{stp_noti_content}}</div>
        </div>
    </Transition>
</template>

<style scoped>
#stp_noti_main {
    position: fixed;
    left: 50%;
    bottom: 48px;
    max-width: 320px;
    transform: translate(-50%);
    background-color: #fff;
    box-shadow: 0 0 8px rgba(0,0,0,0.4);
    border-radius: 4px;
    animation: s_n_entry 0.25s cubic-bezier(0, 0.6, 0, 1);
    z-index: 11;
}
#stp_noti_timer {
    position: relative;
    height: 4px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: #48d;
    animation: s_n_t_prog 7s linear;
}
#stp_noti_content {
    padding: 8px 12px;
}
@keyframes s_n_entry {
    from {
        opacity: 0;
        bottom: -96px;
    }
    to {
        opacity: 1;
        bottom: 48px;
    }
}
@keyframes s_n_t_prog {
    from {
        width: 0%;
        border-top-right-radius: 0px;
    }
    to {
        width: 100%;
        border-top-right-radius: 0px;
    }
}
@media (prefers-color-scheme: dark) {
    #stp_noti_main {
        background-color: #111;
    }
}
</style>