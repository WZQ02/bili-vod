import { reactive } from "vue";

const stp_store = reactive({
    settings: {
        stp_lang: {
            value: 0,
            toggle(value) {
                this.value = value;
                localStorage.setItem('stp_lang',value);
            }
        },
        stp_live_lin: {
            value: 0,
            toggle(value) {
                this.value = value;
                localStorage.setItem('stp_live_lin',value)
            }
        },
        stp_allow_pip: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('stp_allow_pip',new_value)
            }
        },
        browser_fullscreen: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('browser_fullscreen',new_value)
            }
        },
        danmaku_disabled: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('danmaku_disabled',new_value)
            }
        },
        danmaku_showname: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('danmaku_showname',new_value)
            }
        },
        adv_set_enabled: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('adv_set_enabled',new_value)
            }
        },
        show_vid_as_bg: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('show_vid_as_bg',new_value)
            }
        }
    },
    adv_settings: {
        disallow_auto_reload_video: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('disallow_auto_reload_video',new_value)
            }
        },
        enable_mpegts_player: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('enable_mpegts_player',new_value)
            }
        },
        player_native_controls: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('player_native_controls',new_value)
            }
        },
        allow_html_in_chat_content: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('allow_html_in_chat_content',new_value)
            }
        },
        custom_hls_url: {
            value: "",
            change(url) {
                this.value = url;
                localStorage.setItem('custom_hls_url',url)
            }
        },
        custom_ws_url: {
            value: "",
            change(url) {
                this.value = url;
                localStorage.setItem('custom_ws_url',url)
            }
        },
        vid_bg_framerate: {
            value: null
        }
    },
    chatroom: {
        username: {
            value: "",
            change(name) {
                this.value = name;
                localStorage.setItem('chatUserName',name)
            }
        },
        dont_show_userinout: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('isshowuserinout',new_value)
            }
        },
        markdown_disabled: {
            value: 0,
            toggle() {
                let new_value;
                if (this.value) {new_value = 0} else {new_value = 1};
                this.value = new_value;
                localStorage.setItem('ismarkdown',new_value)
            }
        },
        allow_pic_upload: {
            value: 0
        }
    },
    session: {
        player_fullscreen: {
            value: 0,
            toggle() {
                if (this.value) {this.value = 0} else {this.value = 1};
            }
        },
        player_controls_invisable: {
            value: 0,
            change(value) {
                this.value = value;
            }
        }
    },
    others: {
        stp_dots_demo_mode: {
            value: 0
        }
    }
})

function load_data() {
    stp_store.settings.stp_lang.value = Number(localStorage.getItem('stp_lang'));
    stp_store.settings.stp_live_lin.value = Number(localStorage.getItem('stp_live_lin'));
    stp_store.settings.stp_allow_pip.value = Number(localStorage.getItem('stp_allow_pip'));
    stp_store.settings.danmaku_disabled.value = Number(localStorage.getItem('danmaku_disabled'));
    stp_store.settings.adv_set_enabled.value = Number(localStorage.getItem('adv_set_enabled'));
    stp_store.settings.danmaku_showname.value = Number(localStorage.getItem('danmaku_showname'));
    stp_store.settings.show_vid_as_bg.value = Number(localStorage.getItem('show_vid_as_bg'));
    stp_store.adv_settings.disallow_auto_reload_video.value = Number(localStorage.getItem('disallow_auto_reload_video'));
    stp_store.adv_settings.enable_mpegts_player.value = Number(localStorage.getItem('enable_mpegts_player'));
    stp_store.adv_settings.player_native_controls.value = Number(localStorage.getItem('player_native_controls'));
    stp_store.adv_settings.allow_html_in_chat_content.value = Number(localStorage.getItem('allow_html_in_chat_content'));
    stp_store.settings.browser_fullscreen.value = Number(localStorage.getItem('browser_fullscreen'));
    stp_store.adv_settings.custom_hls_url.value = localStorage.getItem('custom_hls_url');
    stp_store.adv_settings.custom_ws_url.value = localStorage.getItem('custom_ws_url');
    stp_store.adv_settings.vid_bg_framerate.value = localStorage.getItem('vid_bg_framerate');
    stp_store.chatroom.username.value = localStorage.getItem('chatUserName');
    stp_store.chatroom.dont_show_userinout.value = Number(localStorage.getItem('isshowuserinout'));
    stp_store.chatroom.markdown_disabled.value = Number(localStorage.getItem('ismarkdown'));
    stp_store.chatroom.allow_pic_upload.value = Number(localStorage.getItem('allow_pic_upload'));
    stp_store.others.stp_dots_demo_mode.value = localStorage.getItem('dots_demo_mode');
}

export { stp_store,load_data }