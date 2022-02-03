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

var sessionDataHTML = ''

function backgroundFunction () {
    return "hello from the background!"
}

// chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
//   chrome.action.setBadgeText({ text: badgeText });

  // Listener is registered asynchronously
  // This is NOT guaranteed to work in Manifest V3/service workers! Don't do this!
//   chrome.action.onClicked.addListener(handleActionClick);
// });

chrome.extension.onMessage.addListener(function(myMessage, sender, sendResponse){
  //do something that only the extension has privileges here
  return true;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.saveState){
    chrome.storage.local.set({
      "body": request.state
    })

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

      if(tabs.length > 0){
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "setVideo", state: request.state})
      }
    })

    // chrome.runtime.Port.disconnect() => {
    //   
    //   document.getElementById('player').play();
    // };
    

    // chrome.runtime.sendMessage(
    //   {greeting: "setVideo", state: request.state}
    // )
  } else if(request.cloed){
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if(tabs.length > 0){
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "closedPupop"})
      }
    })
  }

//   chrome.tabs.sendMessage(tabs[0].id, { greeting: "setVideo" }, function(response) {  
//     console.log(response.farewell);  
// });  
});

// chrome.runtime.onConnect.addListener(function(port) {
  // port.onDisconnect.addListener(function () {
  //   
  //   document.getElementById('player').play();
  // })
// })

// chrome.runtime.onMessage.addListener(({ type, name }) => {
//   if (type === "set-name") {
//     chrome.storage.local.set({ name });
//   }
// });

// chrome.action.onClicked.addListener((tab) => {
//   console.log(tab)
//   chrome.storage.local.get(["name"], ({ name }) => {
//     chrome.tabs.sendMessage(tab.id, { name });
//   });
// });


// chrome.action.onClicked.addListener((tab) => {
  // chrome.action.setPopup({ tabId: tab.tabId, popup: "popup.html" })
  // chrome.storage.local.get('body', (obj) => {
  //   console.log(obj)
  //   if(obj.body != null && obj.body != undefined){
  //     chrome.runtime.sendMessage({
  //       msg:"bodyContent",
  //       data: {
  //         body: obj.body
  //       }
  //     })
  //   }
  // })
// });

// setInterval(function(){
//   chrome.storage.local.set({
//     "body": document.getElementsByTagName("body")[0].innerHTML
//   })
// },1000);

// function sessionDataHTML(){
//   return ''
// }

// chrome.storage.local.set({
//   "Name": "sessionDataHTML",
//   "Value": ''
// })

// chrome.storage.local.set({
//   "Name": "sessionDataHTML",
//   "Value": ""
// }, function () {
//   console.log("Storage Succesful");
// });


// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   console.log(message)
//   if(message.data == 'getBodyHtml'){

//   }
  // sessionDataHTML = document.body.innerHTML
  // if (message.data == "takeScreenshot") {
  //     var resp = sendResponse;
  //     chrome.tabs.captureVisibleTab(function(screenshotUrl) {
  //         resp({
  //             screenshot: screenshotUrl
  //         });
  //     });
  //     return true; // Return true to tell that the response is sent asynchronously
  // } else {
  //     return "TestReply";
  // }
// });

// chrome.action.onClicked.addListener((tab) => {
  // if(document.getElementsByTagName("body")[0].style.display != '') {
  //   document.getElementsByTagName("body")[0].style.display = 'none'
  // }else {
  //   document.getElementsByTagName("body")[0].style.display = ''
  // }
  // console.log('tes')
  // chrome.action.setPopup({ tabId: tab.tabId, popup: "popup.html" })

  // if(content != ''){
  //   document.getElementsByTagName("body")[0].innerHTML = content
  // }
// });

