window.onload = function () {
  let clickedViedo = null

  // generate a table for each format
  function generateTableRow(title, release, info, releaseDate, tags, link) {
    generateTable( `
      <tr>
        <td>${title}</td>
        <td>${release}</td>
        <td>${info}</td>
        <td>${releaseDate}</td>
        <td>${tags}</td>
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
      data.snippet.tags.forEach(function(value){
        tags += value + ',';
      });

      if(tags != ''){
        tags = tags.substring(0, tags.length-1)
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
                <th scope="col">標題</th>
                <th scope="col">發佈者</th>
                <th scope="col">影片資訊</th>
                <th scope="col">發佈日期</th>
                <th scope="col">標籤</th>
                <th scope="col">連結</th>
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

  function generateReport(request, sender, sendResponse) {
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


  // listen to message request from the extension: background.js
  chrome.runtime.onMessage.addListener(generateReport)

}