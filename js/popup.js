const searchViedoForm = document.getElementById('search-viedo')
const searchString = document.getElementById('search-string')
// const key = 'AIzaSyAMfAMS2HiWv9jcN_HGCcn-eiC3aqBYdYg'
const key = 'AIzaSyBi-TgEC8NMoWACGvm-IhwXyFlBlxYP7fU'
let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=' + key
let index = 1;

// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// window.addEventListener('click', function(e){
//   onPlayerStateChange(0)
// });

const li = document.getElementsByTagName("li");
for( var x=0; x < li.length; x++ ) {
  li[x].onclick = function(){
    url = url + '&q=' + searchString.value
    if(this.id == 'Next' && $('#nextPageToken').val() != ''){
      setVideoInfo(url, $('#nextPageToken').val(), function(items){
        setVideoHtml(items)
      })
    }else if(this.id == 'Previous' && $('#prevPageToken').val() != ''){
      setVideoInfo(url, $('#prevPageToken').val(), function(items){
        setVideoHtml(items)
      })
    }
  }
}

function openImg(obj){
  obj.addEventListener("click", function(){
    console.log('123354')
  });
}

// const img0 = document.getElementById('playViedo0');
// img0.addEventListener("click", function(){
//   console.log('123354')
// });

// document.getElementById("viedo").click(function(){
//   chrome.extension.sendMessage({action: "play"})
// });


// document.addEventListener('DOMContentLoaded', function(){
//   var view = chrome.extension.getBackgroundPage();
//   chrome.action.setPopup(view);

// });

let searchQuery = ''

searchViedoForm.addEventListener('submit', event => {
  event.preventDefault()
  // let href = 'https://youtube.com/results?search_query=' +  searchString.value
  // createTab(href)

  //https://www.googleapis.com/youtube/v3/search?part=snippet&q=car&key=&type=video&maxResults=1
  let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=' + key + '&q=' + searchString.value
  setVideoInfo(url, null, function(items){
    setVideoHtml(items)
    document.getElementsByClassName('isPagination')[0].style['display'] = 'inline'
  })
})

function setVideoInfo(url, pageToken, callBackFunction){
  if(pageToken != null){
    url += '&pageToken=' + pageToken
  }

  axios.get(url).then((response) => {
    let items = response.data.items

    //更換按鈕的token的資料
    $('#nextPageToken').val(response.data.nextPageToken)
    $('#prevPageToken').val(response.data.prevPageToken)
      
    if(callBackFunction != null){
      callBackFunction(items)
    }
  
  }).catch((error) => {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else {
      console.log("Error", error.message)
    }
  })
}

let body = document.getElementsByTagName("body")[0].innerHTML

function setVideoHtml(items) {
  let context = ''
  let videoId = []
  let videoObj = []
  let videoImg = []
  items.forEach((el, index) => {
    //發佈日期用的格式轉換
    let date = new Date(el.snippet.publishTime);

    //這裡要改用createElement的方式建立，之後要定義圖片元件要使用點擊事件
    // const div = document.createElement('div');
    // div.setAttribute('class', 'style-scope ytd-item-section-renderer');
    context += 
      '<div class="style-scope ytd-item-section-renderer" prominent-thumb-style="DEFAULT" lockup="true" use-prominent-thumbs="" inline-title-icon="" style="position: relative;">'+
        '<div id="dismissible" class="style-scope ytd-video-renderer">'+
          // '<img id="playVideoImg'+ index +'" width=\"320\" height=\"180\" src=\"' + el.snippet.thumbnails.medium.url  +'\" onClick="openImg()" />' +
          // '<div id="playVideo'+ index +'" class="ytVideo" ></div>' + 
          '<iframe id="playVideo'+ index +'" class="ytVideo"  width=\"320\" height=\"180\" src=\"https://www.youtube.com/embed/' + el.id.videoId  +'\"?enablejsapi=1 onClick="openVideo('+el.snippet.thumbnails.medium.url+')"  frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>' +
          '<input type="hidden" id="playVideoId'+ index +' value="'+ el.id.videoId +'"">' +
          '<div class="text-wrapper style-scope ytd-video-renderer">'+
              '<div id="meta" class="style-scope ytd-video-renderer">'+
                '<div id="title-wrapper" class="style-scope ytd-video-renderer">'+
                  '<a href="https://www.youtube.com/watch?v='+ el.id.videoId +'">' +
                    '<h5 class="title-and-badge style-scope ytd-video-renderer">標題：' + el.snippet.title + '</h5>' +
                  '</a>' +
                '</div>' +
              '</div>' +  
              '<div id="channel-info" class="style-scope ytd-video-renderer">' +
                '<h6>發佈者：' + el.snippet.channelTitle +'</h6>' +
              '</div>' + 
              '<div class="metadata-snippet-container style-scope ytd-video-renderer">' +
                '<small>影片資訊：'+ el.snippet.description +'<small/>' +
                '<p>發佈日期：'+ date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +'<p/>' +
              '</div>' +
            '</div>' +  
        '</div>' +  
      '</div>';   

      videoId.push(el.id.videoId)
      videoObj.push(new Object())
      videoImg.push(el.snippet.thumbnails.medium.url)
  });
  document.getElementById("viedo").innerHTML = context    
  chrome.storage.local.clear()
  chrome.storage.local.set({
    "body": context,
    "videoImg": videoImg
  })

  
  searchQuery = searchString.value

  const video = document.getElementsByTagName('iframe')
  const count = video.length

  if(video != undefined && count > 0){
    function onYouTubeIframeAPIReady() {
      videoObj[0] = new YT.Player('playVideo0', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange(this, 0)
        }
      });

      videoObj[1] = new YT.Player('playVideo1', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange(this, 1)
        }
      });

      videoObj[2] = new YT.Player('playVideo2', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange(this, 2)
        }
      });

      videoObj[3] = new YT.Player('playVideo3', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange(this, 2)
        }
      });

      videoObj[4] = new YT.Player('playVideo4', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange(this, 4)
        }
      });
    }

    
    // for( var x=0; x < count; x++ ) {
      // video[x].addEventListener('click', function(e){
      //   // onPlayerStateChange(x)
      // });
    // }
  }
  


  chrome.runtime.sendMessage({
    saveState: true, 
    state: document.getElementsByTagName("body")[0],
    video: video,
    count: count,
    videoPlayerImg: document.getElementById('videoPlayerImg'),
    videoPlayer: document.getElementById("videoPlayer"),
    videoData: document.getElementById("videoData"),
    videoObj: videoObj,
    // li : document.getElementsByTagName("li")
  })

  // body = document.getElementsByTagName("body")[0].innerHTML
  // body = document.getElementsByTagName("body")[0].innerHTML
  // var bg = chrome.extension.getBackgroundPage()
  // alert('我是background！')
  // alert(bg.document.body.innerHTML); 
  // console.log(bg)
  // bg.savebodyContent();
  // download(context, './background.txt', 'text')
}

function onPlayerReady(e) {
  let play = document.getElementById("playImg");
  let pause = document.getElementById("pauseImg");

  play.addEventListener('click', () => {
    e.target.mute().playVideo();
  });
  pause.addEventListener('click', () => e.target.pauseVideo());
}

function onPlayerStateChange(index) {
  chrome.storage.local.get('videoImg', (obj) => {
    document.getElementById('videoPlayerImg').src = obj.videoImg[index]
  })

  if(document.getElementById("videoPlayer").style.display == 'none'){
    document.getElementById("videoPlayer").style.display = ''
    document.getElementById("videoData").style.display = 'none'
  }
}

const videoPlay = document.getElementById('play_pause')
videoPlay.addEventListener('click', () => {
  if(document.getElementById("playImg").style.display == 'none'){
    document.getElementById("playImg").style.display = ''
    document.getElementById("pauseImg").style.display = 'none'
  } else if(document.getElementById("pauseImg").style.display == 'none'){
    document.getElementById("playImg").style.display = 'none'
    document.getElementById("pauseImg").style.display = ''
  }
});

// const ytButton = document.getElementsByClassName('video')
// console.log(ytButton)
// ytButton.addEventListener('click', function() {
//     console.log('xxx');
// });


document.addEventListener('DOMContentLoaded', () => {
  // const img = document.querySelectorAll("[id^='playVideoImg']")

  // var img = document.getElementById('playVideoImg0')
  // img.addEventListener('click', function() {
  //   console.log('xxx');
  // });

  // for (var i = 0; i < img.length; i++) {
  //   img[i].onclick = function(){
  //     window.close();
  //     // let id = this.id.substring(this.id.indexOf('playVideoImg'), this.id.length);
  //     // document.getElementById('' +)
  //     // ytp-large-play-button ytp-button
  //     // console.log(id)
  //   }
  // }
});


function openVideo(){
  console.log('twesdfwer')
}

// (function () {
//   let img = document.getElementsByTagName('img');
//   for (let i = 0; i < img.length; i++) {
//     img[i].addEventListener("click", function() {
//       let id = img[i].id.substring(img[i].id.indexOf('playVideoImg'), img[i].id.length);
//       console.log(id)
//     });
//   }
// })


// window.close().addEventListener(function(){
//   chrome.runtime.sendMessage({closed : true})
// })

function test(){
  console.log('test')
}

// chrome.runtime.sendMessage(
//   {saveState: true, state: document.getElementsByTagName("body")[0].innerHTML}
// )

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action == "show") {
//       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//           console.log(tabs[0].id)
//       });
//   }
// })
  // if(request.show){
  //   document.getElementsByTagName("body")[0].innerHTML = request.bodyElements
  // }
// })
// chrome.tabs.sendMessage(integer tabId, any message, function responseCallback)



// chrome.extension.getBackgroundPage().window.location.reload();

// setInterval(function(){
//   chrome.storage.local.set({
//     "body": document.getElementsByTagName("body")[0].innerHTML
//   })
// },1000);

// bgPage = chrome.extension.getBackgroundPage();


function parseCookie() {
  var cookieObj = {};
  var cookieAry = document.cookie.split(';');
  var cookie;
  
  for (var i=0, l=cookieAry.length; i<l; ++i) {
      cookie = cookieAry[i].trim();
      cookie = cookie.split('=');
      cookieObj[cookie[0]] = cookie[1];
  }
  
  return cookieObj;
}

function getCookieByName(name) {
  var value = parseCookie()[name];
  if (value) {
      value = decodeURIComponent(value);
  }

  return value;
}

// (function() {

//   chrome.runtime.onMessage.addListener(
//       function(request, sender, sendResponse) {
//           if (request.msg === "bodyContent") {
//               //  To do something
//               console.log(request.data.subject)
//               console.log(request.data.content)
//               document.getElementsByTagName("body")[0].innerHTML = request.data.body
//           }
//       }
//   );

// }());

// chrome.tabs.query({currentWindow: true,active: true}, function(tabs) {
//   console.log(tabs)
// })

// let sessionDataHTML = chrome.storage.local.get('sessionDataHTML', function() {
//   return document.getElementsByTagName("body")[0].innerHTML
// })

// chrome.runtime.getBackgroundPage(function(bg){
//   console.log(bg)
//   chrome.storage.local.get('body', (obj) => {
//     // document.getElementsByTagName("body")[0].innerHTML = obj.body
//   })  
// })

// function getStorageLocal(){
//   chrome.storage.local.get('body', (obj) => {
//     if(obj.body != null && obj.body != undefined){
//       document.getElementsByTagName("body")[0].innerHTML = obj.body
//     }
//   }) 
// }
 
// window.onload = function(){
//   console.log('重新仔入')
//   chrome.storage.local.get('body', (obj) => {
//     if(obj.body != undefined){
//       document.getElementsByTagName("body")[0].innerHTML = obj.body
//     }
//   })  
// }

// document.addEventListener('DOMContentLoaded', function(){ 
//   var view = chrome.extension.getBackgroundPage(); 
//   console.log(view)
  // chrome.browserAction.setPopup(view); 

//  }); 



// chrome.storage.local.get('body', (obj) => {
//   if(obj.body != undefined){
//     document.getElementsByTagName("body")[0].innerHTML = obj.body
//     if(searchQuery == searchString.value){
//       chrome.storage.local.clear()
//     }
//   }
// }) 

// chrome.storage.local.get('state', function(result){
//   if(result.state){
//       //This is a function you will write
//       document.getElementsByTagName("body")[0].innerHTML = result.state
//   }
//   else{
//       //do nothing
//   }
// })

// chrome.runtime.onMessage.addListener(
  // chrome.storage.local.get('body', (obj) => {
  //   console.log(obj)
  //   if(obj == undefined){
  //     document.getElementsByTagName("body")[0].innerHTML = obj.body
  //   }
  // })
// );

// let play = document.getElementsByClassName('ytp-large-play-button')
// console.log(play)
// play.forEach(el => {
//   el.addEventListener('click', function () {
//     setTimeout(function(){
//       chrome.runtime.sendMessage({saveState: true, state: document.getElementsByTagName("body")[0].innerHTML})
//     },5000);
//   }, true);
// })

// $('#playVideo0').on('click', function () {

//   player.playVideo();

// });



