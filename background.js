// 视频下载器后台脚本
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "download") {
        let reg = /[\~\.\:\/\*\?\"\|\\\<\>]/g;
        const videoUrl = message.url;
        const filename = message.filename.replace(reg, '') + ".mp4";

        browser.downloads.download({
            url: videoUrl,
            filename: filename,
            saveAs: true
        }).then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            console.error("下载失败:", error);
            sendResponse({ success: false, error: error.message });
        });
        
        return true; // 保持消息通道开放以进行异步响应
    }
});

// 显示通知
function showNotification(message) {
    browser.notifications.create({
        type: "basic",
        title: "视频下载器",
        message: message
    });
}