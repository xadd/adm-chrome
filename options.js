var qs = document.querySelector.bind(document);
document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    init();
  }
}
var init = function(){
   qs('#cdn-urls>input').value = localStorage["cdn-urls"];
   qs('#cdn-urls').addEventListener('submit', save);
   qs('#rfile').addEventListener('change', restoreLocal);
   qs('#RestoreFileButton').addEventListener('click', function (){
     qs('#rfile').click();
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
  var url = qs('.url').value;
  localStorage["url"] = url;
  var iframe = document.createElement('iframe');
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  var filter = function(info) {
    if (info.frameId !== 0){
      qs("#results").innerHTML += "<li>"+info.url+"</li>";
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
    var rfile = qs("#rfile");
    if (rfile.files.length > 0 && rfile.files[0].name.length > 0) {
        var r = new FileReader();
        r.onload = function (e) {
          var obj = xlsx(window.btoa(e.target.result));

          var rows = obj.worksheets[0].data;
          tbody = qs("tbody");
          tbody.innerHTML = "";
          rows.forEach(function(row){
             var tr = tbody.insertRow(-1);
             row.forEach(function(data){
               var td = tr.insertCell(-1);
               td.innerText = data.value;
             });
          });
        };
        r.onerror = function () {
            //InfoTip.alertI18n("message_cannotReadOptionsBackup");
        };
        r.readAsBinaryString(rfile.files[0]);
        rfile.value = "";
    }
}
