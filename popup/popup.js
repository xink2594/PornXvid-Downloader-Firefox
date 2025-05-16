function sendMessageToContentScript(message, callback) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, message).then((response) => {
            if (callback) callback(response);
        }).catch(error => {
            console.error("发送消息错误:", error);
            document.getElementById('no-video').style.display = 'block';
            document.getElementById('videoList').style.display = 'none';
        });
    });
}

sendMessageToContentScript({ cmd: 'test' }, function (videoType) {
    if(videoType == null || videoType.length === 0) {
        document.getElementById('no-video').style.display = 'block';
        document.getElementById('videoList').style.display = 'none';
        return;
    }
    
    var boxEl = document.getElementById('videoList');
    var videoStr = '';
    videoType.forEach((item) => {
        videoStr += `<li> <label>清晰度：<span> ${item.key} </span> </label> <button class="button down">下载</button> <button class="button copy">复制</button></li>`;
    });
    boxEl.innerHTML = videoStr;
    
    var dialog = document.getElementById('copyDialog');
    var dialog1 = document.getElementById('downloadDialog');
    
    var downList = document.querySelectorAll(".down");
    downList.forEach((item, index) => {
        item.onclick = () => {
            let reg = /[\~\.\:\/\*\?\"\|\\\<\>]/g;
            browser.runtime.sendMessage({
                action: "download",
                url: videoType[index].val,
                filename: videoType[index].video_title.replace(reg, '')
            });
            
            dialog1.showModal();
            setTimeout(() => {
                dialog1.close();
            }, 2000);
        }
    });

    var copyList = document.querySelectorAll(".copy");
    copyList.forEach((item, index) => {
        item.onclick = () => {
            var url = videoType[index].val;
            navigator.clipboard.writeText(url).then(() => {
                dialog.showModal();
                setTimeout(() => {
                    dialog.close();
                }, 1500);
            }).catch(err => {
                console.error('无法复制到剪贴板:', err);
                
                // 备用方法
                var oInput = document.createElement('input');
                oInput.value = url;
                document.body.appendChild(oInput);
                oInput.select();
                document.execCommand("Copy");
                oInput.className = 'oInput';
                oInput.style.display = 'none';
                document.body.removeChild(oInput);
                
                dialog.showModal();
                setTimeout(() => {
                    dialog.close();
                }, 1500);
            });
        }
    });
});