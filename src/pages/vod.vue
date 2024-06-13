<!--视频点播（B站），音乐点播（网易云），等等。。。-->

<script setup>
    import { ref,getCurrentInstance, reactive } from 'vue'
    const gCI = getCurrentInstance()

    const msgshow = ref(null)
    const vpt = ref(null)
    const c2 = ref(null)
    const ms_display = ref(0)
    const searchedmusiclist = reactive({
        0: {},
        1: {},
        2: {},
        3: {},
        4: {}
    })
    let ms_timer

    //const netease_search = "https://music.163.com/api/search/get/web"
    const netease_embed = "https://music.163.com/outchain/player"
    //const music_search_proxy = "https://api.wzq02.top/tools/music_search/?name="
    //网易云的搜索API不允许跨域调用，我本来打算用我的海外VPS做个代理，但是在海外调用这个API出来的结果是乱码，不知道怎么解析，因此只能用本地代理凑合下
    //没有在本机上开启这个代理的可以注释掉下面这句
    const music_search_proxy = "http://localhost:8095?name="

    import MusicList from '../components/vod/music_list.vue'

    const music_choose_mode = ref(0)

    gCI.proxy?.$bus.on('user_danmaku',(data) => {
        handlemsg(data)
        if (data.text.slice(0,1) == "/") {
            handlevodinst(data.text)
            c2.value.style = 'display:none'
        }
        if (music_choose_mode && !isNaN(Number(data.text))) {
            if (Number(data.text) <= 5 && Number(data.text) >= 1) {
                choosesong(Number(data.text.slice(0,1)))
            }
        }
    })

    function handlemsg(data) {
        clearTimeout(ms_timer)
        const disp_msg = `${data.uname}: ${data.text}`
        msgshow.value.innerText = disp_msg
        ms_display.value = 1
        ms_timer = setTimeout(()=>{ms_display.value = 0},10000)
    }
    function handlevodinst(text) {
        const inst = text.split(" ")[0]
        switch (inst) {
            case "/点播":
                const bvid = text.split(" ")[1]
                handlebilivideo(bvid)
                break
            case "/点歌":
                const songname = text.slice(4)
                handlesong(songname)
                break
            case "/取消":
                if (music_choose_mode.value) {
                    music_choose_mode.value = 0
                }
                break
        }
    }
    
    function handlesong(song) {
        if (isNaN(Number(song))) { //song值为字符串，从第三方API搜索歌曲
            if (typeof(music_search_proxy)=='undefined') { //music_search_proxy不存在时，不进行搜索
                return
            }
            const xhr1 = new XMLHttpRequest()
            const url = music_search_proxy+song
            xhr1.open('GET',url,true)
            xhr1.onreadystatechange = () => {
                if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
                    //这些代码用于QQ音乐的搜索结果，暂不需要
                    /*const data = JSON.parse(xhr1.responseText.slice(9,-1))["data"]
                    const song_list = data["song"]["list"]
                    for (let i=0;i<song_list.length;i++) {
                        searchedmusiclist[i] = {
                            title: song_list[i]["songname"],
                            author: song_list[i]["singer"][0]["name"],
                            album: song_list[i]["albumname"],
                            id: song_list[i]["songid"]
                        }
                    }
                    music_choose_mode.value = 1*/
                    const data = JSON.parse(xhr1.responseText)["result"]
                    const song_list = data["songs"]
                    for (let i=0;i<song_list.length;i++) {
                        searchedmusiclist[i] = {
                            title: song_list[i]["name"],
                            author: song_list[i]["artists"][0]["name"],
                            album: song_list[i]["album"]["name"],
                            id: song_list[i]["id"]
                        }
                    }
                    music_choose_mode.value = 1
                    //console.log(data)
                    //console.log(song_list)
                    //console.log(searchedmusiclist)
                }
            }
            xhr1.send()
        } else { //song值是数字，获取网易云歌曲
            //网易云搜索api
            //const xhr1 = new XMLHttpRequest()
            //获取第一条结果
            //const url = netease_search+"?csrf_token=hlpretag=&hlposttag=&s="+song+"&type=1&offset=0&total=true&limit=1"
            /*xhr1.open('GET',url,true)
            xhr1.onreadystatechange = () => {
                if (xhr1.readyState === XMLHttpRequest.DONE && xhr1.status === 200) {
                    const data = JSON.parse(xhr1.responseText)["result"]
                    const songid = data["songs"][0]["id"]
                    const embed_player_link = netease_embed+"?type=2&id="+songid+"&auto=1&height=66"
                    vpt.value.src = embed_player_link
                }
            }
            xhr1.send()*/
            //由于网易云api不允许跨域/在海外服务器调用的问题，暂且让用户直接发送歌曲id点歌好了
            const embed_player_link = netease_embed+"?type=2&id="+song+"&auto=1"
            vpt.value.src = embed_player_link
        }
        
    }
    function choosesong(number) {
        const id = searchedmusiclist[number-1]["id"]
        const embed_player_link = netease_embed+"?type=2&id="+id+"&auto=1"
        //vpt.value.src = "https://i.y.qq.com/n2/m/outchain/player/index.html?songid="+id+"&songtype=0"
        vpt.value.src = embed_player_link
        music_choose_mode.value = 0
    }
    function handlebilivideo(bvid) {
        vpt.value.src = "https://player.bilibili.com/player.html?bvid="+bvid
    }
</script>

<template>
    <Transition name="fade">
        <div id="msgshow" ref="msgshow" v-show="ms_display"></div>
    </Transition>
    <iframe id="viewport" ref="vpt" src="" frameborder="0" allowfullscreen="" sandbox="allow-same-origin allow-forms allow-scripts">
    </iframe>
    <div id="container2" ref="c2">
        <div id="ph_outer">
            <div id="placeholder_text">
                <h1 style="font-size:calc(var(--font-base)*.8)">弹幕互动点播页</h1>
                <p class="_15h" style="font-size:calc(var(--font-base)*.6)">用法：在弹幕中发送<br>
                /点播 B 站视频 BV 号 可点播 B 站视频<br>
                /点歌 歌曲名 或网易云音乐歌曲 ID 可点播歌曲<br>
                </p>
            </div>
        </div>
    </div>
    <Transition name="fade">
        <MusicList :content="searchedmusiclist" v-show="music_choose_mode"/>
    </Transition>
</template>

<style scoped>
#container2 {
    position: absolute;
    background-color: #111;
    color: #fff;
}
#viewport {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
}
#msgshow {
    position: absolute;
    width: calc(100% - 8px);
    height: 44px;
    top: 0px;
    left: 0px;
    color: #fff;
    background-color: #0007;
    line-height: 44px;
    font-size: 20px;
    padding-left: 8px;
    z-index: 114514;
}
#ph_outer {
    position: absolute;
    display: flex;
    top: 0px;
    bottom: 0px;
    margin: auto;
}
#placeholder_text {
    position: relative;
    left: calc(50vw - 50%);
    margin: auto;
    padding: 16px 32px;
    border-radius: 4px;
    animation: zoomin2 .3s cubic-bezier(0.3, 0, 0, 1) 1;
}
</style>