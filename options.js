document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    initApplication();
  }
}
var initApplication = function(){
   document.querySelector('#cdn-urls>input').value = localStorage["cdn-urls"];
   document.querySelector('#cdn-urls').addEventListener('submit', save);
   document.querySelector('#rfile').addEventListener('change', restoreLocal);
   document.querySelector('#RestoreFileButton').addEventListener('click', function (){
     document.querySelector('#rfile').click();
   } );

}
var save = function(ev){
  var arr = ev.target.querySelectorAll('input');
  var length = arr.length;
  var urls = [];
  for (var i = 0; i < length; i++) {
    urls.push(arr[i].value);
  }
  localStorage["cdn-urls"] = urls;
  ev.preventDefault();

}
var check = function(ev){
  ev.preventDefault();
  ev.stopPropagation();
  localStorage["url"] = url;
  var url = document.querySelector('.url').value;
  localStorage["url"] = url;
  var iframe = document.createElement('iframe');
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  var filter = function(info) {
    if (info.frameId !== 0){
      document.querySelector("#results").innerHTML += "<li>"+info.url+"</li>";
    }
  }

  chrome.webRequest.onCompleted.addListener(
    filter,
    {
      urls: [localStorage["cdn-urls"]]
    },
    ["responseHeaders"]);

  iframe.onload = function() {
    chrome.webRequest.onCompleted.removeListener(filter);
   // this.parentNode.removeChild(this);
  };
  iframe.src = url;
}

function restoreLocal() {
    var rfile = document.querySelector("#rfile");
    if (rfile.files.length > 0 && rfile.files[0].name.length > 0) {
        var r = new FileReader();
        r.onload = function (e) {
          var obj = xlsx(window.btoa(e.target.result));

          var rows = obj.worksheets[0].data;
        };
        r.onerror = function () {
            //InfoTip.alertI18n("message_cannotReadOptionsBackup");
        };
        r.readAsBinaryString(rfile.files[0]);
        rfile.value = "";
    }
}
