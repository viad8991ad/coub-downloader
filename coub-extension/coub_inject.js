(function (){
	let descriptionBody = document.querySelector('div.description__body');

	if (descriptionBody)
	{
		if (!descriptionBody){
			return;
		}

		let jsonString = document.querySelector('div.data').querySelector("script").innerHTML;
		let json = JSON.parse(jsonString)
		let videoUrl = json.file_versions.html5.video.higher.url
		let audioUrl = json.file_versions.html5.audio.high.url

		let coubName = descriptionBody.querySelector("h5.description__title").innerText
		let descriptionControls = document.querySelector('div.description__controls');

		var button = document.createElement('button');
		button.innerHTML = 'Скачать full';
		button.className = 'downloadLink';
		button.onclick = function(){
			let xhr = new XMLHttpRequest();
			xhr.open("POST", 'http://127.0.0.1:5000/' + coubName);
			// xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify({
				video: videoUrl,
				audio: audioUrl
			}));

			xhr.onload = () => window.alert(xhr.response);
		};

		descriptionControls.appendChild(button);
	}
})();
