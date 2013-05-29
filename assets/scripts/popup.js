function openOptions(){
  chrome.tabs.create({url: "options.html"});
}
document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    document.querySelector('#option').addEventListener('click', openOptions());
  }
}
