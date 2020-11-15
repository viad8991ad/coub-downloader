(function (){
    window.alert("my log 1")

    let observer = new MutationObserver(listModified);

    window.alert("my log 2")

    let initialList = document.querySelector('div.div.coubs-list__inner');
    
    window.alert("initialList")
    window.alert("initialList " + initialList)

	if (initialList)
	{
		let rows = initialList.children;
		for (var i = 0; i < rows.length; i++)
		{
			addDownloadLink(rows[i]);
		}

		observer.observe(initialList, {childList: true});	// следим за изменениями в изначальном списке тоже
    }

    function listModified(mutations)
	{
		for (var i = 0; i < mutations.length; i++)
		{

            window.alert("my log 3")

			var mut = mutations[i];
			if (mut.type != 'childList')
			{
				return;
			}
			// пройдемся по добавленным песням
			for (var j = 0; j < mut.addedNodes.length; j++)
			{
				addDownloadLink(mut.addedNodes[j]);
			}
			// удаленные записи - mut.removedNodes игнорируем
		}
    }
    
    function addDownloadLink(rows){
        let descriptionBody = rows.querySelector('div.description__body');
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
            button.innerHTML = 'Скачать';
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
    }
});
