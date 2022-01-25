const searchViedoForm = document.getElementById('search-viedo')
const searchString = document.getElementById('search-string')
const key = 'AIzaSyAMfAMS2HiWv9jcN_HGCcn-eiC3aqBYdYg'
let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=' + key
let index = 1;

const li = document.getElementsByTagName("li");
for( var x=0; x < li.length; x++ ) {
  li[x].onclick = function(){
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

document.getElementById("viedo").click(function(){
  chrome.extension.sendMessage({action: "play"})
});


// document.addEventListener('DOMContentLoaded', function(){
//   var view = chrome.extension.getBackgroundPage();
//   chrome.action.setPopup(view);

// });

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

function setVideoHtml(items) {
  let context = ''
  items.forEach(el => {
    let date = new Date(el.snippet.publishTime);
    context += 
      '<div class="style-scope ytd-item-section-renderer" prominent-thumb-style="DEFAULT" lockup="true" use-prominent-thumbs="" inline-title-icon="" style="position: relative;">'+
        '<div id="dismissible" class="style-scope ytd-video-renderer">'+
          '<iframe width=\"320\" height=\"180\" src=\"https://www.youtube.com/embed/' + el.id.videoId  +'\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>' +
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
  });

  document.getElementById("viedo").innerHTML = context
}

chrome.runtime.onConnect.addListener(function(port){
  port.onDisconnect.addListener(function(event) {
    if(document.querySelector('video').playing){
      console.log('影片正在播放中')
    }
  })
})