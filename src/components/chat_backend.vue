<!--部分代码参考自 https://www.bilibili.com/read/cv14101053/-->

<script setup>
    import { onMounted, reactive, getCurrentInstance } from 'vue'
    import { BrotliDecode } from '../scripts/brotli/decode.js'
    const gCI = getCurrentInstance()
    //const gbw_api_url = 'http://localhost:8094'
    const gbw_api_url = 'https://api.wzq02.top/tools/get_bili_ws' //获取直播间ws服务器地址的代理url（直接获取B站的会报CORS错误，所以搞了个代理）
    const params = reactive({
        roomid: null, //房间号
        id_code: null, //主播身份码（暂时不实现）
        screen: null, //展示类型（展示评论、视频点播、音乐点播...）（应该会使用路由实现，所以估计用不上）
        uid: 0,
        buvid: "",
        token: "",
        debug: 0, //debug模式（同时在console和页面上显示直播间信息变动）
        verbose: 0 //是否显示进入、关注直播间、人气值变动等数据
    })
    const params2 = reactive({
        roomid: null, //真实房间号
        ws_server: '', //选用的websocket服务器地址
        ws_s_port: null, //服务器端口号
        token: '', //弹幕服务器连接token
    })

    let ws,ws_hb_timer

    class actions {
        getparam(name) {
            return new URLSearchParams(new URL(window.location.href).search).get(name)
        }
        getparams() {
            params.roomid = this.getparam('roomid')
            params.id_code = this.getparam('code')
            params.screen = this.getparam('screen')
            params.uid = Number(this.getparam('uid')) || params.uid
            params.buvid = this.getparam('buvid') || params.buvid
            //params.buvid = this.getparam('token') || params.token
            params.debug = this.getparam('debug')
            params.verbose = this.getparam('verbose')
        }
        initialize() {
            if (params.roomid == null) {
                this.log("当前未指定房间ID。")
                return //没有提供roomid时，中止初始化
            }
            bili.getactualroomid(params.roomid)
        }
        log(text,always) {
            console.log(text)
            if (params.debug || always) {
                gCI.proxy?.$bus.emit('trigger_popup',text)
            }
        }
    }
    const bknd = new actions()

    class ws_actions {
        //人气值刷新
        _3(num) {
            if (params.verbose) {
                bknd.log("当前直播间人气值："+num.toString())
            }
        }
        //认证成功
        _8(json) {
            if (json.code == 0) {
                bknd.log("弹幕服务器认证成功。真实房间号："+params2.roomid+"，服务器地址："+params2.ws_server+":"+params2.ws_s_port)
            }
        }
        //其他
        _5(json) {
            //有人进入或关注了直播间
            if (json.cmd == 'INTERACT_WORD') {
                const uname = json.data.uname
                const timedata = new Date(json.data.timestamp * 1000);
                const time = timedata.toLocaleDateString() + " " + timedata.toTimeString().split(" ")[0];
                    if (json.data.msg_type == 2) {
                        if (params.verbose) {
                            bknd.log(`[${time}] ${uname} 关注了直播间`);
                        }
                        gCI.proxy?.$bus.emit('user_activity',{uname: uname,time: time,type: 1})
                    } else {
                        if (params.verbose) {
                            bknd.log(`[${time}] ${uname} 进入直播间`);
                        }
                        gCI.proxy?.$bus.emit('user_activity',{uname: uname,time: time,type: 0})
                    }
            }
            //高能榜人员进入直播间
            if (json.cmd == 'ENTRY_EFFECT') {
                const uname = json.data.copy_writing.split("<" + "%")[1].split("%>")[0]
                const timedata = new Date(json.data.trigger_time / 1000000);
                const time = timedata.toLocaleDateString() + " " + timedata.toTimeString().split(" ")[0];
                if (params.verbose) {
                    bknd.log(`[${time}] ${uname} 进入直播间`);
                }
                gCI.proxy?.$bus.emit('user_activity',{uname: uname,time: time,type: 0})
            }
            //有人发送弹幕
            if (json.cmd == 'DANMU_MSG') {
                const uname = json.info[2][1]
                const timedata = new Date(json.info[9].ts * 1000)
                const time = timedata.toLocaleDateString() + " " + timedata.toTimeString().split(" ")[0]
                const text = json.info[1]
                bknd.log(`[${time}] ${uname}: ${text}`)
                gCI.proxy?.$bus.emit('user_danmaku',{uname: uname,text: text,time: time})
            }
            //有人赠送礼物
            if (json.cmd == 'SEND_GIFT') {
            }
        }
    }
    const wsa = new ws_actions()

    class bili_actions {
        //获取真实房间id
        getactualroomid(id) {
            const xhr = new XMLHttpRequest()
            //const url = 'https://api.live.bilibili.com/room/v1/Room/room_init?id='+id
            const url = gbw_api_url+"?id="+id
            xhr.open('GET',url,true)
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    this.processres(xhr.responseText)
                }
            }
            xhr.send()
        }
        //处理从第三方（api.wzq02.top）api接收到的数据
        processres(res) {
            try {
                JSON.parse(res)
            } catch(err) {
                bknd.log("从第三方 API 获取直播间数据出错！"+res,1)
                return
            }
            const data = JSON.parse(res)
            if (!data['roomid']) {
                bknd.log("未获取到真实房间 ID，请检查您是否指定了有效的房间号！",1)
                return
            }
            params2.roomid = data['roomid']
            params2.token = data['token']
            const s_lst = data['serverlist']
            for (let i=0;i<s_lst.length;i++) {
                //优先选择最后一个服务器（api部署在海外，前几个地址优先获取到海外的，在国内用速度可能不是很快）
                const j = s_lst.length - i - 1
                if (s_lst[j]['host'] && s_lst[j]['wss_port']) {
                    params2.ws_server = s_lst[j]['host']
                    params2.ws_s_port = s_lst[j]['wss_port']
                    break
                }
            }
            this.connect()
        }
        //生成房间认证数据
        getcert(json) {
            const encoder = new TextEncoder()
            const jsonView = encoder.encode(json)
            let buff = new ArrayBuffer(jsonView.byteLength + 16)
            let view = new DataView(buff)
            view.setUint32(0, jsonView.byteLength + 16) //整个数据包长度
            view.setUint16(4, 16) //头部长度
            view.setUint16(6, 1) //协议版本
            view.setUint32(8, 7) //类型,7为加入房间认证
            view.setUint32(12, 1) //填1
            for (let r = 0; r < jsonView.byteLength; r++){
                view.setUint8(16 + r, jsonView[r]) //填入数据
            }
            return buff
        }
        //处理接收到的数据（这段直接抄的了，出处见本文件第一行注释文本）
        handleMessage(blob,call) {
            const reader = new FileReader();
            reader.onload = function(e){
                let buff = e.target.result;    //ArrayBuffer对象
                let decoder = new TextDecoder();    //解码器
                let view = new DataView(buff);    //视图
                let offset = 0;
                let packet = {};
                let result = [];
                while (offset < buff.byteLength){    //数据提取
                    let packetLen = view.getUint32(offset + 0);
                    let headLen = view.getUint16(offset + 4);
                    let packetVer = view.getUint16(offset + 6);
                    let packetType = view.getUint32(offset + 8);
                    let num = view.getUint32(12);
                    if (packetVer == 3){    //解压数据
                        let brArray = new Uint8Array(buff, offset + headLen, packetLen - headLen);
                        //let BrotliDecode = makeBrotliDecode();    //生成Brotli格式解压工具的实例
                        let buffFromBr = BrotliDecode(brArray);    //返回Int8Array视图
                        let view = new DataView(buffFromBr.buffer);
                        let offset_Ver3 = 0;
                        while (offset_Ver3 < buffFromBr.byteLength){    //解压后数据提取
                            let packetLen = view.getUint32(offset_Ver3 + 0);
                            let headLen = view.getUint16(offset_Ver3 + 4);
                            let packetVer = view.getUint16(offset_Ver3 + 6);
                            let packetType = view.getUint32(offset_Ver3 + 8);
                            let num = view.getUint32(12);
                            packet.Len = packetLen;
                            packet.HeadLen = headLen;
                            packet.Ver = packetVer;
                            packet.Type = packetType;
                            packet.Num = num;
                            let dataArray = new Uint8Array(buffFromBr.buffer, offset_Ver3 + headLen, packetLen - headLen);
                            packet.body = decoder.decode(dataArray);    //utf-8格式数据解码，获得字符串
                            result.push(JSON.stringify(packet));    //数据打包后传入数组
                            offset_Ver3 += packetLen;
                        }
                    } else {
                        packet.Len = packetLen;
                        packet.HeadLen = headLen;
                        packet.Ver = packetVer;
                        packet.Type = packetType;
                        packet.Num = num;
                        let dataArray = new Uint8Array(buff, offset + headLen, packetLen - headLen);
                        if (packetType == 3){    //获取人气值
                            packet.body = (new DataView(buff, offset + headLen, packetLen - headLen)).getUint32(0);    //若入参为dataArray.buffer，会返回整段buff的视图，而不是截取后的视图
                        } else {
                            packet.body = decoder.decode(dataArray);    //utf-8格式数据解码，获得字符串
                        }
                        result.push(JSON.stringify(packet));    //数据打包后传入数组
                    }
                    offset += packetLen;
                }
                call(result);    //数据后续处理
            }
            reader.readAsArrayBuffer(blob)
        }
        //连接B站服务器
        connect() {
            //建立websocket连接，并设置回调函数
            ws = new WebSocket(`wss://${params2.ws_server}:${params2.ws_s_port}/sub`)
            //启动连接
            ws.onopen = (e) => {
                bknd.log("已连接到聊天服务器。")
                const cert_data = {
                    "uid": params.uid,
                    "roomid": params2.roomid,
                    "protover": 3,
                    "buvid": params.buvid,
                    "platform": "web",
                    "type": 2,
                    "key": params.token || params2.token
                }
                ws.send(this.getcert(JSON.stringify(cert_data)))
                //每30s发送心跳包（ws_hb_timer在最外层已定义）
                ws_hb_timer = setInterval(() => {
                    const buff = new ArrayBuffer(16);
                    const i = new DataView(buff);
                    i.setUint32(0, 0) //整个封包
                    i.setUint16(4, 16) //头部
                    i.setUint16(6, 1) //协议版本
                    i.setUint32(8, 2) //操作码,2为心跳包
                    i.setUint32(12, 1) //填1
                    ws.send(buff)
                },30000)
            }
            //接收到消息
            ws.onmessage = (e) => {
                const blob = e.data
                this.handleMessage(blob,(result) => {
                    for (let i=0;i<result.length;i++) {
                        const json = JSON.parse(result[i])
                        if (json.Type == 3) {
                            wsa._3(json.body)
                        }
                        if (json.Type == 5) {
                            wsa._5(JSON.parse(json.body))
                        }
                        if (json.Type == 8) {
                            wsa._8(JSON.parse(json.body))
                        }
                    }
                })
            }
            //关闭连接
            ws.onclose = (e) => {
                //停止心跳包发送
                if (ws_hb_timer != null) {
                    clearInterval(ws_hb_timer)
                }
                const close_msg = "已断开与弹幕服务器之间的连接，请重新载入页面。"
                bknd.log(close_msg,1)
            }
            //连接出错
            ws.onerror = (e) => {
                bknd.log("与弹幕服务器连接出错！"+e,1)
            }
        }
    }
    const bili = new bili_actions()
    
    bknd.getparams()

    onMounted(() => {
        //初始化
        bknd.initialize()
    })
</script>

<template>
</template>