const searchViedoForm = document.getElementById('search-viedo')
const searchString = document.getElementById('search-string')
let key = 'AIzaSyAMfAMS2HiWv9jcN_HGCcn-eiC3aqBYdYg'

function createTab(websiteUrl) {
  // open a new tab and navigate it to the specified url
  chrome.tabs.create({ url: websiteUrl })
}

searchViedoForm.addEventListener('submit', event => {
  event.preventDefault()
  // let href = 'https://youtube.com/results?search_query=' +  searchString.value
  // createTab(href)

  //https://www.googleapis.com/youtube/v3/search?part=snippet&q=car&key=&type=video&maxResults=1
  axios.get('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=' + key + '&q=' + searchString.value).then((response) => {
    console.log(response.data.items[0])
    let items = response.data.items
    let context = '';
    items.forEach(el => {
      let date = new Date(el.snippet.publishTime);
      context += 
        '<div class="style-scope ytd-item-section-renderer" prominent-thumb-style="DEFAULT" lockup="true" use-prominent-thumbs="" inline-title-icon="" style="position: relative;">'+
          '<div id="dismissible" class="style-scope ytd-video-renderer">'+
            '<a href="https://www.youtube.com/watch?v='+ el.id.videoId +'">' +
              '<img id="img" class="style-scope yt-img-shadow" alt="" width="320" src="'+el.snippet.thumbnails.medium.url+'">'+
            '</a>' +
            '<div class="text-wrapper style-scope ytd-video-renderer">'+
                '<div id="meta" class="style-scope ytd-video-renderer">'+
                  '<div id="title-wrapper" class="style-scope ytd-video-renderer">'+
                    '<a href="https://www.youtube.com/watch?v='+ el.id.videoId +'">' +
                      '<h5 class="title-and-badge style-scope ytd-video-renderer">' + el.snippet.title + '</h5>' +
                    '</a>' +
                  '</div>' +
                '</div>' +  
                '<div id="channel-info" class="style-scope ytd-video-renderer">' +
                  '<h6>' + el.snippet.channelTitle +'</h6>' +
                '</div>' + 
                '<div class="metadata-snippet-container style-scope ytd-video-renderer">' +
                  '<small>'+ el.snippet.description +'<small/>' +
                  '<p>'+ date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +'<p/>' +
                '</div>' +
              '</div>' +  
          '</div>' +  
        '</div>';   
    });

    document.getElementById("viedo").innerHTML = context

    // let data = response.data.items[0]
    // document.getElementById("viedo").innerHTML = 
    //   "<div class='form-group'>" +
    //     "<h5 class='text-white'>影片標題："+data.snippet.title+"</h5>"+
    //     "<h6 class='text-white'>發佈者："+data.snippet.channelTitle+"</h6>"+
    //     "<h6 class='text-white'>影片資訊："+data.snippet.description+"</h6>"+
    //   "<div id='player'></div>" +
    //   // "<iframe width='320' height='180' src='https://www.youtube.com/embed/'"+ data.id.videoId + " title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
    //   "</div>";

      // onYouTubeIframeAPIReady(data.id.videoId);
    
  }).catch((error) => {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else {
      console.log("Error", error.message)
    }
  })
})


      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady(videoId) {
        player = new YT.Player('player', {
          height: '320',
          width: '180',
          videoId: videoId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }






