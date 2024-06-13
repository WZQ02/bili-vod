<script setup>
    import { onActivated,reactive,ref,getCurrentInstance,onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiArrowLeft } from '@mdi/js'
    const gCI = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    
    const step1_input1 = ref(null)
    const step_show = ref(0)
    const gen_link = ref("")

    const configdata = reactive({
        roomid: '',
        scene: 1
    })

    class stepactions {
        _1() {
            checkvalue._1_livenum()
            if (configdata.roomid == '') { //roomid未更改，不切换到下一步
                return
            }
            //否则，跳到第2步
            step_show.value = 2
        }
        _2() {
            //跳到第5步
            this.generate_link()
            step_show.value = 5
        }
        _back1() {
            //返回到第1步
            step_show.value = 1
        }
        _back2() {
            //返回到第2步
            step_show.value = 2
        }
        generate_link() {
            const hostname = window.location.hostname
            const port = window.location.port
            //指定路由
            let route = ""
            switch (configdata.scene) {
                case 1:
                    route = "show"
                    break
                case 2:
                    route = "vod"
                    break
            }
            let link = window.location.protocol +"//"
            if (port != '') {
                link += hostname+":"+port+"/"
            } else {
                link += hostname+"/"
            }
            link += route+"?roomid="+configdata.roomid
            gen_link.value = link
            //存储设置
            localStorage.setItem('last_config',JSON.stringify(configdata))
        }
        copy_link() {
            copytext(gen_link.value)
        }
        open_link() {
            window.open(gen_link.value)
        }
    }
    class valueactions {
        _1_livenum() {
            const input = step1_input1.value.value
            const si_index = input.indexOf('live.bilibili.com/')
            let num_value
            if (si_index != -1) {
                num_value = input.slice(si_index+18).split('?')[0]
            } else {
                num_value = input
            }
            if (num_value == "" || isNaN(Number(num_value))) {
                sendnoti("请输入正确的房间 ID 或直播间地址！")
                return
            }
            configdata.roomid = Number(num_value)
        }
    }

    function sendnoti(text) {
        console.log(text)
        gCI.proxy?.$bus.emit('trigger_popup',text)
    }
    async function copytext(text) {
        try {
            await navigator.clipboard.writeText(text)
            const msg = "已复制链接到剪贴板。"
            sendnoti(msg)
        } catch(err) {
            const msg = "复制链接到剪贴板失败！"
            sendnoti(msg)
        }
    }

    const finishstep = new stepactions()
    const checkvalue = new valueactions()

    onMounted(() => {
        step_show.value = 1
        let last_config
        if (localStorage.getItem('last_config')) {
            sendnoti("已载入上次使用的设置。")
            last_config = JSON.parse(localStorage.getItem('last_config'))
            step1_input1.value.value = last_config["roomid"]
            if (last_config["scene"]) {
                document.getElementById("scene_sel_"+last_config["scene"]).checked = 1
                configdata.scene = last_config["scene"]
            }
        }
    })
</script>

<template>
    <div id="container2">
        <div id="config_guide">
            <div class="cf_steps" id="cf_step_1" v-show="step_show==1">
                <h2>
                    <span class="back_btn"><svg-icon type="mdi" :path="mdiArrowLeft" @click="router.push('/')"></svg-icon></span>
                    Step 1: 填入直播间信息
                </h2>
                <h4>目前暂时不支持身份码验证，请见谅。</h4>
                <p class="_15h">请输入你的 B 站直播间房间号：</p>
                <input type="text" id="step1_input1" ref="step1_input1" placeholder="房间 ID 或直播间地址，如 https://live.bilibili.com/31245650">
                <br><button class="nextstep" @click="finishstep._1()" style="margin-top:24px">下一步</button>
            </div>
            <div class="cf_steps" id="cf_step_2" v-show="step_show==2">
                <h2>
                    <span class="back_btn"><svg-icon type="mdi" :path="mdiArrowLeft" @click="finishstep._back1()"></svg-icon></span>
                    Step 2: 选择场景
                </h2>
                <p>从以下交互场景中选择一个：</p>
                <input type="radio" class="scene_sel_radio" name="scene" value="1" id="scene_sel_1" @click="configdata.scene=1" checked>
                <label for="scene_sel_1">
                    <div class="scene_sel_cont">
                        <div class="ssc_pic" style="background-image: url(./images/screenshots/show.png)"></div>
                        <div class="ssc_title">弹幕展示</div>
                    </div>
                </label>
                <input type="radio" class="scene_sel_radio" name="scene" value="2" id="scene_sel_2" @click="configdata.scene=2">
                    <label for="scene_sel_2"><div class="scene_sel_cont">
                        <div class="ssc_pic" style="background-image: url(./images/screenshots/16.jpg)"></div>
                        <div class="ssc_title">弹幕互动点播</div>
                    </div>
                </label>
                <input type="radio" class="scene_sel_radio" name="scene" id="scene_sel_3" disabled>
                    <label for="scene_sel_3"><div class="scene_sel_cont">
                        <div class="ssc_pic">?</div>
                        <div class="ssc_title" title="也可能不会开发出来（">更多场景开发中...</div>
                    </div>
                </label>
                <br><button class="nextstep" @click="finishstep._2()" style="margin-top:0px">下一步</button>
            </div>
            <div class="cf_steps" id="cf_step_5" v-show="step_show==5">
                <span class="back_btn"></span>
                <h2>
                    <span class="back_btn"><svg-icon type="mdi" :path="mdiArrowLeft" @click="finishstep._back2()"></svg-icon></span>
                    Step 3: 生成链接
                </h2>
                <p>将以下 URL 复制到你的 OBS 浏览器源，或在浏览器中打开：</p>
                <p>{{ gen_link }}</p>
                <div id="link_operations">
                    <button @click="finishstep.copy_link()">复制链接</button>&nbsp;&nbsp;
                    <button @click="finishstep.open_link()">直接打开</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#config_guide {
    position: absolute;
    display: flex;
    top: 0px;
    bottom: 0px;
    margin: auto;
}
#config_guide .cf_steps {
    background: #fff;
    position: relative;
    left: calc(50vw - 50%);
    margin: auto;
    padding: 16px 32px;
    box-shadow: 0px 0px 32px rgba(0,0,0,0.4);
    border-radius: 4px;
    animation: zoomin2 .3s cubic-bezier(0.3, 0, 0, 1) 1;
}

#step1_input1 {
    width: 520px;
    transition: background-color .25s;
}
.scene_sel_cont {
    width: 172px;
    height: 128px;
    background-color: #111;
    border-radius: 4px;
    margin: 8px;
    box-shadow: 0px 0px 8px rgba(0,0,0,0.4);
    transition: background-color .15s;
}
.ssc_pic {
    position: relative;
    left: 6px;
    top: 6px;
    width: calc(100% - 12px);
    height: 90px;
    border-radius: 4px;
    background-size: cover;
}
.ssc_title {
    color: #fff;
    position: relative;
    text-align: center;
    top: 10px;
}
.scene_sel_radio {
    display: none;
}
.scene_sel_radio:checked + label .scene_sel_cont {
    background-color: #47a;
}
.scene_sel_radio:disabled + label .scene_sel_cont {
    background-color: #333;
}
.scene_sel_radio:disabled + label .ssc_pic {
    color: #999;
    background-color: #555;
    font-size: 64px;
    text-align: center;
    font-weight: bold;
}
.scene_sel_radio:disabled + label .ssc_title {
    opacity: .5;
}
.nextstep {
    position: relative;
    margin-left: calc(50% - 32px);
}
#link_operations {
    width: 100%;
    text-align: center;
}
@media screen and (max-width: 640px) {
    #step1_input1 {
        width: calc(100vw - 120px);
    }
}
@media (prefers-color-scheme: dark) {
    #config_guide .cf_steps {
        background: #222;
    }
    .scene_sel_radio:checked + label .scene_sel_cont {
        background-color: #246;
    }
}
@media (any-hover: hover) {
    .back_btn:hover {
        opacity: 1;
    }
}
</style>