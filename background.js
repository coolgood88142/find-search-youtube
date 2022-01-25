chrome.contextMenus.create( {  
  "id": "showVideoInfo",
  "title": "ShowVideoInfo",
  "contexts": ["all"] 
})
  
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "showVideoInfo") { 
      console.log(info)
      // send a message from the extension to content script of current tab
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { getUrl: true })
      })

      chrome.scripting.insertCSS({
        file: 'css/content.css'
      })
    }else{
      return
    }
})

// chrome.action.setPopup('');