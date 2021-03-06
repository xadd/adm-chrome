var qs = document.querySelector.bind(document);
var qsa = document.querySelectorAll.bind(document);
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
   qs('#check').addEventListener('click', check);
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
  var rows = qsa("tbody tr");
  var len = rows.length;
  var i;
  closures = [];
  var makeClosure = function (data){
    return function(next){
      return function(){
        checkEach(data,next);
      };
    }
  }

  for( i = 0; i < len; i++){
    closures.push(makeClosure(rows[i]));
  }
  funArr = [];
  var linkNext = function (i){
    funArr[i] = closures[i]( ((i === (len-1)) ? "" : linkNext(i+1)) );
    return funArr[i];
  }

  linkNext(0);

  funArr[0].call();
}

var checkEach = function(tr,next){
  var url = tr.childNodes[2].innerText;
  var iframe = document.createElement('iframe');
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  var filter = function(info) {
    if (info.frameId !== 0){
      var td = tr.insertCell(-1);
      td.innerText = info.url;
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
    this.parentNode.removeChild(this);
    if(typeof next === "function")
      {next.call();}
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
