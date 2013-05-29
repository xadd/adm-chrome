function openMain(){
  var extension = chrome.extension.getBackgroundPage();
  extension.openOptions();
}
document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    document.querySelector('#option').addEventListener('click', openOptions());
  }
}
