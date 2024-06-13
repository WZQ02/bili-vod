<script setup>
    const content = defineProps({
        content: Object
    })
    

</script>

<template>
    <div id="song_list_container">
        <table id="sl_table">
            <tr class="sl_row" id="row_1">
                <td class="sl_r_img">1</td>
                <td class="sl_r_text">
                    <div class="srt_name">{{ content["content"][0]["title"] }}</div>
                    <div class="srt_author">{{ content["content"][0]["author"]+" - "+content["content"][0]["album"] }}</div>
                </td>
            </tr>
            <tr class="sl_row" id="row_2">
                <td class="sl_r_img">2</td>
                <td class="sl_r_text">
                    <div class="srt_name">{{ content["content"][1]["title"] }}</div>
                    <div class="srt_author">{{ content["content"][1]["author"]+" - "+content["content"][1]["album"] }}</div>
                </td>
            </tr>
            <tr class="sl_row" id="row_3">
                <td class="sl_r_img">3</td>
                <td class="sl_r_text">
                    <div class="srt_name">{{ content["content"][2]["title"] }}</div>
                    <div class="srt_author">{{ content["content"][2]["author"]+" - "+content["content"][2]["album"] }}</div>
                </td>
            </tr>
            <tr class="sl_row" id="row_4">
                <td class="sl_r_img">4</td>
                <td class="sl_r_text">
                    <div class="srt_name">{{ content["content"][3]["title"] }}</div>
                    <div class="srt_author">{{ content["content"][3]["author"]+" - "+content["content"][3]["album"] }}</div>
                </td>
            </tr>
            <tr class="sl_row" id="row_5">
                <td class="sl_r_img">5</td>
                <td class="sl_r_text">
                    <div class="srt_name">{{ content["content"][4]["title"] }}</div>
                    <div class="srt_author">{{ content["content"][4]["author"]+" - "+content["content"][4]["album"] }}</div>
                </td>
            </tr>
        </table>
        <div id="sl_title">发送对应数字点播歌曲，或者发送 /取消 以取消</div>
    </div>
</template>

<style scoped>
#song_list_container {
    width: calc(var(--font-base)*10);
    height: 100vh;
    position: absolute;
    display: flex;
    left: 0px;
    right: 0px;
    top: 0px;
    margin-inline: auto;
    align-items: center;
}
#sl_title {
    position: absolute;
    top: 32px;
    left: 0px;
    right: 0px;
    margin-inline: auto;
    text-align: center;
    font-size: calc(var(--font-base)*.4);
    padding: 4px;
    background-color: #000a;
}
.sl_r_img {
    position: relative;
    width: calc(var(--font-base)*1.6);
    height: calc(var(--font-base)*1.6);
    padding: 0px;
    font-size: calc(var(--font-base)*1);
    text-align: center;
}
.sl_r_text {
    position: relative;
    width: calc(var(--font-base)*8.4);
    height: calc(var(--font-base)*1.6);
    padding: 0px;
}
.srt_name {
    font-size: calc(var(--font-base)*.55);
    padding-left: calc(var(--font-base)*.2);
}
.srt_author {
    font-size: calc(var(--font-base)*.4);
    padding-left: calc(var(--font-base)*.2);
}
</style>