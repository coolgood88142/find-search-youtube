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

      // chrome.scripting.insertCSS({
      //   target: {tabId: tab.id},
      //   file: 'css/content.css'
      // })
    }else{
      return
    }
})

var sessionDataHTML = ''

function backgroundFunction () {
    return "hello from the background!"
}

var player;

chrome.action.onClicked.addListener(async (tab) => {
  // chrome.action.setPopup({ tabId: tab.tabId, popup: "popup.html" })
  let results = await chrome.scripting.executeScript({ 
    target: {tabId: tab.id, allFrames: true}, 
    files: ['iframeApi.js'], 
  });

//   function onYouTubeIframeAPIReady() {
//     player = new YT.Player('player', {
//       height: '360',
//       width: '640',
//       videoId: 'yPkS7yiTHP4',
//       events: {
//         'onReady': onPlayerReady,
//         'onStateChange': onPlayerStateChange
//       }
//     });
//   }
})




// function onPlayerReady(event) {
//   event.target.playVideo();
// }

// var done = false;
// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PLAYING && !done) {
//     setTimeout(stopVideo, 6000);
//     done = true;
//   }
// }

// function stopVideo() {
//   player.stopVideo();
// }

// chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
//   chrome.action.setBadgeText({ text: badgeText });

  // Listener is registered asynchronously
  // This is NOT guaranteed to work in Manifest V3/service workers! Don't do this!
//   chrome.action.onClicked.addListener(handleActionClick);
// });

// chrome.extension.onMessage.addListener(function(myMessage, sender, sendResponse){
//   //do something that only the extension has privileges here
//   return true;
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.saveState){

    // if(request.video != undefined && request.count > 0){
      // for( var x=0; x < request.count; x++ ) {
        // let playVideo = request.video[x]
        // console.log(request.videoObj[x])
        // playVideo.addEventListener('click', function(e){
        //   onPlayerStateChange(request.videoPlayerImg, request.videoPlayer, request.videoData, x)
        // });
      // }
    //   function onYouTubeIframeAPIReady() {
    //     request.videoObj[0] = new YT.Player('playVideo0', {
    //       events: {
    //         'onReady': onPlayerReady,
    //         'onStateChange': onPlayerStateChange(this, 0)
    //       }
    //     });
  
    //     request.videoObj[1] = new YT.Player('playVideo1', {
    //       events: {
    //         'onReady': onPlayerReady,
    //         'onStateChange': onPlayerStateChange(this, 1)
    //       }
    //     });
  
    //     request.videoObj[2] = new YT.Player('playVideo2', {
    //       events: {
    //         'onReady': onPlayerReady,
    //         'onStateChange': onPlayerStateChange(this, 2)
    //       }
    //     });
  
    //     request.videoObj[3] = new YT.Player('playVideo3', {
    //       events: {
    //         'onReady': onPlayerReady,
    //         'onStateChange': onPlayerStateChange(this, 2)
    //       }
    //     });
  
    //     request.videoObj[4] = new YT.Player('playVideo4', {
    //       events: {
    //         'onReady': onPlayerReady,
    //         'onStateChange': onPlayerStateChange(this, 4)
    //       }
    //     });
    //   }
    // }

    // if(request.video != undefined && request.count > 0){
    
    //   for( var x=0; x < request.count; x++ ) {
    //     request.video[x].onclick = function(){
    //       function onYouTubeIframeAPIReady() {
    //         request.videoObj[x] = new YT.Player('playVideo' + x, {
    //           height: '180',
    //           width: '320',
    //           videoId: request.videoId[0],
    //           events: {
    //             // 'onReady': onPlayerReady(this, x),
    //             'onStateChange': onPlayerStateChange(this, x)
    //           }
    //         });
    //       }
    //     }
    //   }
    // }
  

    // chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

    //   if(tabs.length > 0){
    //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "setVideo", state: request.state.innerHTML})
    //   }
    // })

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

  // function onPlayerReady(e) {
  //   let play = document.getElementById("playImg");
  //   let pause = document.getElementById("pauseImg");
  
  //   play.addEventListener('click', () => {
  //     e.target.mute().playVideo();
  //   });
  //   pause.addEventListener('click', () => e.target.pauseVideo());
  // }
  
  // function onPlayerStateChange(event, index) {
  //   if (event.data == YT.PlayerState.PLAYING) {
  //     chrome.storage.local.get('videoImg', (obj) => {
  //       document.getElementById('videoPlayerImg').src = obj.videoImg[index]
  //     })
  
  //     if(document.getElementById("videoPlayer").style.display == 'none'){
  //       document.getElementById("videoPlayer").style.display = ''
  //       document.getElementById("videoData").style.display = 'none'
  //     }
  
  //   }
  // }

//   chrome.tabs.sendMessage(tabs[0].id, { greeting: "setVideo" }, function(response) {  
//     console.log(response.farewell);  
// });  
});

// function onPlayerReady(event, index) {
//   event.target.playVideo();

//   chrome.storage.local.get('videoImg', (obj) => {
//     document.getElementById('videoPlayerImg').src = obj.videoImg[index]
//   })

// }

function onPlayerStateChange(videoPlayerImg, videoPlayer, videoData, index) {
  chrome.storage.local.get('videoImg', (obj) => {
    videoPlayerImg.src = obj.videoImg[index]
  })

  chrome.storage.local.set({
    "videoPlayIndex": index
  })

  if(videoPlayer.style.display == 'none'){
    videoPlayer.style.display = ''
    videoData.style.display = 'none'
  }
}

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

