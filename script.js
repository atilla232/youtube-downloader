function showThumbnail() {
  var videoURL = document.getElementById("videoURL").value;
  var video_id = videoURL.split("v=")[1];
  var thumbnail = document.getElementById("thumbnail");
  thumbnail.innerHTML = `<img src="https://img.youtube.com/vi/${video_id}/mqdefault.jpg">`;
  document.getElementById("confirm1").style.display = "block";
}

function showConfirm2() {
  var videoURL = document.getElementById("videoURL").value;
  var yt = document.createElement("iframe");
  yt.src = "https://www.youtube.com/embed/" + videoURL.split("v=")[1];
  yt.style.width = "100%";
  yt.style.height = "400px";
  document.getElementById("thumbnail").innerHTML = "";
  document.getElementById("thumbnail").appendChild(yt);

  var confirm2 = document.getElementById("confirm2");
  confirm2.style.display = "block";

  var resolutions = document.getElementById("resolutions");
  while (resolutions.firstChild) {
    resolutions.removeChild(resolutions.firstChild);
  }

  fetch(
    "https://www.youtube.com/get_video_info?video_id=" + videoURL.split("v=")[1]
  )
    .then((response) => response.text())
    .then((data) => {
      var video_info = parseQueryString(data);
      var streams = video_info["url_encoded_fmt_stream_map"].split(",");
      streams.forEach((stream) => {
        var stream_info = parseQueryString(stream);
        var resolution = stream_info["quality"] || stream_info["quality_label"];
        var option = document.createElement("option");
        option.value = stream_info["url"];
        option.textContent = resolution;
        resolutions.appendChild(option);
      });
    });
}

function downloadVideo() {
  var url = document.getElementById("resolutions").value;
  var status = document.getElementById("status");
  var filename = prompt("Enter file name:");
  if (filename) {
    status.textContent = "Downloading...";
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        var a = document.createElement("a");
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename + ".mp4";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        status.textContent = "Download complete.";
      });
  }
}

function parseQueryString(queryString) {
  var params = {};
  var queries = queryString.split("&");
  for (var i = 0; i < queries.length; i++) {
    var pair = queries[i].split("=");
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
  }
  return params;
}
