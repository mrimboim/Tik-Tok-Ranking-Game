let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i = 0; i < 2; i++) {
  let reload = reloadButtons[i];
  reload.addEventListener("click", function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop
for (let i = 0; i < 2; i++) {
  let heart = heartButtons[i];
  heart.addEventListener("click", function() { heartbreaker(i) });
} 
async function getComps() {
  let videos = await sendGetRequest('/getTwoVideos')
  console.log("Line 15:", videos[0].url)

  const urls = [videos[0].url,
    videos[1].url];

  for (let i = 0; i < 2; i++) {
    addVideo(urls[i], videoElmts[i]);
  }
  // load the videos after the names are pasted in! 
  document.getElementById("nickname1").textContent =(videos[0].nickname);
  document.getElementById("nickname2").textContent =(videos[1].nickname);
  
  loadTheVideos();
}

getComps();

function heartbreaker(index){
  let heart1 = document.getElementById("heart1");
  let heart2 = document.getElementById("heart2");
  if(index == 0){
    heart1.classList.remove("far");
    heart2.classList.add("far");
    heart2.classList.add("unloved");
    heart2.classList.remove("loved");
    heart1.classList.add("fas");
    heart1.classList.remove("unloved");
    heart1.classList.add("loved");
  }else{
    
    heart2.classList.remove("far");
    heart1.classList.add("far");
    heart1.classList.add("unloved");
    heart1.classList.remove("loved");
    heart2.classList.add("fas");
    heart2.classList.remove("unloved");
    heart2.classList.add("loved");
  
  }
}
// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.



