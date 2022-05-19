// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});



// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

showWinningVideo()

async function showWinningVideo() {
  let winningVid = await sendGetRequest("/getWinner")
  // console.log(winningVid)
  let winningUrl = winningVid.url;
    document.getElementById("nickname1").textContent = (winningVid.nickname);
  addVideo(winningUrl, divElmt);
  loadTheVideos();
}
