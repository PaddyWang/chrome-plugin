chrome.browserAction.onClicked.addListener(function(activeTab){
    console.log(activeTab);
    var newURL = "www.baidu.com";
    chrome.tabs.create({ url: newURL });
});
