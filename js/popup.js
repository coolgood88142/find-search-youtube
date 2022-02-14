// import youtubeApi from './script.js';

const searchViedoForm = document.getElementById('search-viedo')
const searchString = document.getElementById('search-string')
// const key = 'AIzaSyAMfAMS2HiWv9jcN_HGCcn-eiC3aqBYdYg'
const key = 'AIzaSyBi-TgEC8NMoWACGvm-IhwXyFlBlxYP7fU'
let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=' + key
let index = 1;
var player0, player1, player2, player3, player4;
var youTubePlayer;

// chrome.tabs.executeScript({ code: 'document.body.innerHTML+="<div/>"' }) 

// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// document.querySelector('body').appendChild(tag);


/**
 * Main
 */
//  (function () {
//   'use strict';

//   function init() {
//       // Load YouTube library
//       var tag = document.createElement('script');

//       tag.src = 'http://www.youtube.com/iframe_api';

//       var first_script_tag = document.getElementsByTagName('script');
//       console.log(first_script_tag)

//       first_script_tag.parentNode.insertBefore(tag, first_script_tag);


//       // Set timer to display infos
//       // setInterval(youTubePlayerDisplayInfos, 1000);
//   }


//   if (window.addEventListener) {
//       window.addEventListener('load', init);
//   } else if (window.attachEvent) {
//       window.attachEvent('onload', init);
//   }
// }());


// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// window.addEventListener('click', function(e){
//   onPlayerStateChange(0)
// });

function imgClickVideo(img, index) {
  img.addEventListener('click', function() {
    let playVideoId = document.getElementById('playVideoId' + index)
    youTubePlayer.cueVideoById({suggestedQuality: 'tiny',
                                videoId: playVideoId.value
                               });
    youTubePlayer.pauseVideo();
    document.getElementById('videoPlayerImg').src = this.src
    document.getElementById('videoData').style.display = 'none'
    document.getElementById('videoPlayer').style.display = ''
    chrome.runtime.sendMessage({
      playVideo: playVideoId
    })
  })
}


function onYouTubeIframeAPIReady() {
  'use strict';

  var inputVideoId = document.getElementById('YouTube-video-id');
  var videoId = inputVideoId.value;
  var suggestedQuality = 'tiny';
  var height = 180;
  var width = 320;
  var youTubePlayerVolumeItemId = 'YouTube-player-volume';


  function onError(event) {
      youTubePlayer.personalPlayer.errors.push(event.data);
  }


  function onReady(event) {
      var player = event.target;

      player.loadVideoById({suggestedQuality: suggestedQuality,
                            videoId: videoId
                           });
      player.pauseVideo();
  }


  function onStateChange(event) {
      var volume = Math.round(event.target.getVolume());
      var volumeItem = document.getElementById(youTubePlayerVolumeItemId);

      if (volumeItem && (Math.round(volumeItem.value) != volume)) {
          volumeItem.value = volume;
      }
  }


  youTubePlayer = new YT.Player('YouTube-player',
                                {videoId: videoId,
                                 height: height,
                                 width: width,
                                 playerVars: {'autohide': 0,
                                              'cc_load_policy': 0,
                                              'controls': 2,
                                              'disablekb': 1,
                                              'iv_load_policy': 3,
                                              'modestbranding': 1,
                                              'rel': 0,
                                              'showinfo': 0,
                                              'start': 3
                                             },
                                 events: {'onError': onError,
                                          'onReady': onReady,
                                          'onStateChange': onStateChange
                                         }
                                });

  // Add private data to the YouTube object
  youTubePlayer.personalPlayer = {'currentTimeSliding': false,
                                  'errors': []};
}

function youTubePlayerActive() {
  'use strict';

  return youTubePlayer && youTubePlayer.hasOwnProperty('getPlayerState');
}

/**
 * Pause.
 */
 function youTubePlayerPause() {
  'use strict';

  if (youTubePlayerActive()) {
      youTubePlayer.pauseVideo();
  }
}

/**
 * Play.
 */
 function youTubePlayerPlay() {
  'use strict';

  if (youTubePlayerActive()) {
      youTubePlayer.playVideo();
  }
}

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
          '<img id="playVideoImg'+ index +'" width=\"320\" height=\"180\" src=\"' + el.snippet.thumbnails.medium.url  +'\" />' +
          // '<div id="playVideo'+ index +'" class="ytVideo" ></div>' + 
          // '<iframe id="playVideo'+ index +'" class="ytVideo"  width=\"320\" height=\"180\" src=\"https://www.youtube.com/embed/' + el.id.videoId  +'\"?enablejsapi=1 onClick="openVideo('+el.snippet.thumbnails.medium.url+')"  frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>' +
          '<input type="hidden" id="playVideoId'+ index +'" value="'+ el.id.videoId +'">' +
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
    imgClickVideo(document.getElementById('playVideoImg0'), 0)
    imgClickVideo(document.getElementById('playVideoImg1'), 1)
    imgClickVideo(document.getElementById('playVideoImg2'), 2)
    imgClickVideo(document.getElementById('playVideoImg3'), 3)
    imgClickVideo(document.getElementById('playVideoImg4'), 4)  
  }

  chrome.runtime.sendMessage({
    saveState: true, 
    state: document.getElementsByTagName("body")[0],
  })
}

const videoPlay = document.getElementById('play_pause')
videoPlay.addEventListener('click', () => {
  if(document.getElementById("playImg").style.display == 'none'){
    document.getElementById("playImg").style.display = ''
    document.getElementById("pauseImg").style.display = 'none'
    youTubePlayerPause()
  } else if(document.getElementById("pauseImg").style.display == 'none'){
    document.getElementById("playImg").style.display = 'none'
    document.getElementById("pauseImg").style.display = ''
    youTubePlayerPlay()
  }
});

const backVideoData = document.getElementById('backVideoData')
backVideoData.addEventListener('click', () => {
  document.getElementById('videoPlayerImg').src = ''
  document.getElementById('videoData').style.display = ''
  document.getElementById('videoPlayer').style.display = 'none'
})
