chrome.contextMenus.create( {  
  "id": "showVideoInfo",
  "title": "ShowVideoInfo",
  "contexts": ["video"] 
})

chrome.contextMenus.create({  
  "id": "showIframeVideoInfo",
  "title": "ShowIframeVideoInfo",
  "contexts": ["frame"] 
})
  
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "showVideoInfo" || info.menuItemId === "showIframeVideoInfo") { 
      // send a message from the extension to content script of current tab
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { getUrl: true })
        chrome.tabs.insertCSS({
          file: 'css/content.css'
        })
      })
    }else{
      return
    }
})