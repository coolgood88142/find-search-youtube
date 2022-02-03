window.onload = function () {
  let clickedViedo = null

  // generate a table for each format
  function generateTableRow(title, release, info, releaseDate, tags, link) {
    generateTable( `
      <tr>
        <td>標題</td>
        <td>${title}</td>
      </tr>
      <tr>
        <td>發佈者</td>
        <td>${release}</td>
      </tr>
      <tr>
        <td>影片資訊</td>
        <td>${info}</td>
      </tr>
      <tr>
        <td>發佈日期</td>
        <td>${releaseDate}</td>
      </tr>
      <tr>
        <td>標籤</td>
        <td>${tags}</td>
      </tr>
      <tr>
        <td>連結</td>
        <td class="url">
          <span class="link">${link}</span>
          <span class="tooltip-text">Click to copy</span>
        </td>
      </tr>
    `)
  }

  // access image from Pixabay , Pexels, Unsplash 
  function generateSrcsetImages() {
    console.log(clickedViedo)
    const images = clickedViedo.srcset.split(', ')
    return images.map(image => {
      const url = image.split(' ')[0]
      const size = image.split(' ')[1]
      return generateTableRow(null, null, null, null, null, null)
    }).join(' ')
  }

  // access image from Picjumbo or others
  function generateSrcImage() {
    
    
  }

  function generateTbody(href) {
    let key = 'AIzaSyAMfAMS2HiWv9jcN_HGCcn-eiC3aqBYdYg'
    let vidioID = location.href.substring(href+1, location.href.length)
    axios.get('https://www.googleapis.com/youtube/v3/videos?id='+ vidioID +'&type=video&key=' + key + '&part=snippet').then((response) => {
      let data = response.data.items[0]

      const title = data.snippet.title
      const release = data.snippet.channelTitle
      const info = data.snippet.description

      let date = new Date(data.snippet.publishedAt);
      const releaseDate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
      let tags = '';

      if(data.snippet.tags !== null && data.snippet.tags !== undefined){
        data.snippet.tags.forEach(function(value){
          tags += value + ',';
        });
  
        if(tags != ''){
          tags = tags.substring(0, tags.length-1)
        }
      }else {
        tags = '無標籤'
      }

      const link = 'https://www.youtube.com/watch?v=' + data.id
      generateTableRow(title, release, info, releaseDate, tags, link)
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

  function generateTable(tbodyInnerHTML) {
    // replace the page with a created table containing links
    document.querySelector('body').innerHTML = `
      <section>
        <div class="table-container mt-4 p-0 rounded-lg">
          <table class="table mb-0">
            <thead class="thead-dark">
              <tr>
                <th scope="col" style="width:10%">資訊名稱</th>
                <th scope="col">資料</th>
              </tr>
            </thead>
            <tbody class="text-secondary">
              ${tbodyInnerHTML}
            </tbody>
          </table>
        </div>
        <!--Reload Button-->
        <div class="button-panel">
          <input type="button" id="reload" value="回上一頁" onClick="window.location.reload()"/>
        </div>
      </section>
    `

    document.querySelector('style').innerHTML = `
      html, body {
        font-size: 14px;
      }
      
      section {
        width: 100%;
        height: 100%;
        padding: 3rem;
        background: #4CA1AF;
        background: -webkit-linear-gradient(to right, #C4E0E5, #4CA1AF);  /* Chrome 10-25 */
        background: linear-gradient(to right, #C4E0E5, #4CA1AF); /* Chrome 26+ */
      }
      
      section .table-container {
        max-width: 1200px;
        margin: 0 auto;
        max-height: 460px;
        border-radius: .4rem;
        overflow-y: scroll;
        overflow-x: hidden;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
      }
      
      table thead th {
        padding: .75rem;
        border-bottom: 2px solid #dee2e6;
        color: white;
        background: #343a40;
      }
      
      table tbody tr:hover {
        background: #dddcdc;
      }
      
      table tr {
        min-height: 38px;
        text-align: left;
        background-color: rgb(233, 233, 233);
      }
      
      table tr:nth-child(2n+1){
        background-color: #f2f2f2;
      }
      
      table tr td {
        padding: .85rem;
        color: #6c757d;
      }
      
      table td.url {
        position: relative;
        max-width: 400px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
      }
      
      table td.url .link {
        text-decoration: none;
      }
      
      .url .tooltip-text {
        position: absolute;
        padding: .3rem .5rem;
        top: 13%;
        left: 50%;
        z-index: 1;
        color: white;
        font-weight: 600;
        background: grey;
        border-radius: .2rem;
        visibility: hidden;
        opacity: 0;
        transform: translateX(-50%);
        box-shadow: 1px 1px 1px 0px rgba(173,173,173,1);
      }
      
      .url:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
        transition: all .2s linear;
      }
      
      /*Button*/
      div.button-panel {
        margin-top: 1rem;
        text-align: center;
      }
      
      .button-panel #reload {
        padding: .5rem;
        font-size: 1rem;
        color: white;
        border-style: none;
        border-radius: .1rem;
        border-color: #3CB371;
        background-color: #3CB371;
        cursor: pointer;
        box-shadow: 1px 1px 1px 0px rgb(52, 160, 101);
      }
      
      .button-panel #reload:hover {
        background-color: rgb(52, 160, 101);
        border-color: rgb(52, 160, 101);
        transition: all .2s linear;
      }
      
      .button-panel #reload:focus,
      .button-panel #reload:active {
        padding: .5rem;
        outline: unset;
        border-style: none;
      }
      
      /*Alert Message*/
      .alert-message {
        padding: .5rem;
        color: rgb(255, 255, 255);
        font-weight: 700;
        font-size: 1.2rem;
        background: #f44336;
      }
      
      .alert-message .closebtn {
        font-size: 1.4rem;
        cursor: pointer;
      }
    `
  }

  function copyUrl() {
    const link = event.target.closest('.url').firstElementChild
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(link);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
  }

  function showErrorMessage() {
    const errorMessage = `
      <div class="alert-message">
        <span class="closebtn">&times;</span> 
        Something went wrong. Please try again on the image!
      </div>
    `
    // insert alert message to the top of the page
    document.querySelector('body').insertAdjacentHTML('afterbegin', errorMessage)
    // close the message when clicking the close button
    document.querySelector('.closebtn').addEventListener('click', event => event.target.parentElement.remove())
  }

  function generateReport(request) {
    // show error message if getUrl is false or clickImg is null
    if (!request.getUrl || !clickedViedo) { return showErrorMessage() }
    // generate tbody
    //根據目前的網址來確認是否為YT，不是YT就顯示訊息，如果是YT的嵌入式影片要另外抓資料
    if(clickedViedo.baseURI.indexOf('https://www.youtube.com/watch') != -1){
      generateTbody(location.href.indexOf('='))
    }else if(clickedViedo.localName == 'iframe'){
      generateTbody(clickedViedo.src.indexOf('='))
    }else{
      alert('請選擇Youtube網站影片')
    }
    // generate the report with tbody
    // generateTable(tbodyInnerHTML)
    // listen to url click to copy url
    document.querySelectorAll('.url').forEach(link => link.addEventListener('click', copyUrl))
  }

  // listen to contextmenu being opened and save the target image
  document.addEventListener('contextmenu', event => clickedViedo = event.target)
  chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.greeting == 'setVideo') {
      if(request.state){
        let bgVideo = document.getElementById('bgVideo')
  
        if(bgVideo == null){
          let div = document.createElement('div')
          div.id = 'bgVideo'
          div.style.display = 'none'
          div.innerHTML = request.state
          document.getElementsByTagName("body")[0].appendChild(div)
        }else{
          bgVideo.innerHTML = request.state
          document.getElementsByTagName("body")[0].appendChild(bgVideo)
        }

        // let src = document.getElementsByTagName("iframe")[0].src
        // document.getElementsByTagName("iframe")[0].src = src + '?autoplay=1'
      }
    }

    generateReport(request)

    // if(request.greeting == 'closedPupop'){
    //   console.log('套件頁面關閉')
    // }

  })

  var evt = document.createEvent('MouseEvents');
  evt.initEvent('play', true, true);
  var some_element = document;
  some_element.dispatchEvent(evt);

  document.addEventListener('play', function(e){
    // chrome.extension.sendMessage({play : true}, function(response) {
    //   const img = document.querySelectorAll("[id^='playVideoImg']")
    //   for (var i = 0; i < img.length; i++) {
    //     img[i].onclick = function(){
          console.log('test')
          // let id = this.id.substring(this.id.indexOf('playVideoImg'), this.id.length);
          // document.getElementById('' +)
          // ytp-large-play-button ytp-button
          // console.log(id)
        // }
    //   }

    // });
  })

//   document.addEventListener('play', function(e){
//     //send message to ext
//     var someInformation = {/*your msg here*/}
//     chrome.extension.sendMessage(someInformation, function(response) {
//        //callback
//     });
//  }, false);

  // listen to message request from the extension: background.js
  // chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    

  //   generateReport
  // });

  // console.log(chrome.action.getUrl('./background.html'))

  // let videoData = document.getElementById('videoData')

  // chrome.action.onClicked.addListener((tab) => {
  //   chrome.action.setPopup({ tabId: tab.tabId, popup: "popup.html" })
  //   videoData.appendChild(chrome.action.getUrl('background.html'))
  // })
  
}

const content = '';

function savebodyContent() {
  content = document.getElementsByTagName("body")[0].innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  const img = document.querySelectorAll("[id^='playVideoImg']")
  
  // var img = document.getElementById('playVideoImg0')
  // img.addEventListener('click', function() {
  //   console.log('xxx');
  // });
  
  for (var i = 0; i < img.length; i++) {
    img[i].onclick = function(){
      console.log('test123')
      // let id = this.id.substring(this.id.indexOf('playVideoImg'), this.id.length);
      // document.getElementById('' +)
      // ytp-large-play-button ytp-button
      // console.log(id)
    }
  }
  })
  

//收到訊息之後，在目前網頁內容丟隱藏的影片標籤


// chrome.runtime.onConnect.addListener(function(port){
//   port.onDisconnect.addListener(function(event) {
//     alert(document.getElementsByTagName("body")[0].innerHTML)
//     // content = document.getElementsByTagName("body")[0].innerHTML;
//   })
// })

// chrome.runtime.onConnect.addListener(function (externalPort) {
//   externalPort.onDisconnect.addListener(function () {
//     console.log("onDisconnect")
//     // Do stuff that should happen when popup window closes here
//   })

//   console.log("onConnect")
// })


