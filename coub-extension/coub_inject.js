(function () {
    const coubViewUrl = "coub.com/view"

    let getUrl = document.URL

    if (getUrl.includes(coubViewUrl)) {
        console.log("COUB_DOWNLOADER: open concrete coub. " + getUrl)

        let descriptionBody = document.querySelector('div.description__body');

        if (descriptionBody) {
            if (!descriptionBody) {
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
            button.onclick = function () {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", 'http://127.0.0.1:5000/' + coubName);
                // nice js <3
                // xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    video: videoUrl,
                    audio: audioUrl
                }));

                xhr.onload = () => window.alert(xhr.response);
            };

            descriptionControls.appendChild(button);
        }
    } else {
        function addObserverIfDesiredNodeAvailable() {
            let coubListListener = document.querySelector('div.coubs-list__inner');

            console.log("COUB_DOWNLOADER: coubListListener " + coubListListener)
            console.log(coubListListener)

            const callback = function (mutationsList) {
                console.log("COUB_DOWNLOADER: callback start =========================================================")
                console.log("COUB_DOWNLOADER: mutationsList leght " + mutationsList.length)
                console.log("COUB_DOWNLOADER: " + mutationsList)
                console.log(mutationsList)

                for (var i = 0; i < mutationsList.length; i++) {
                    let selectMutation = mutationsList[i].addedNodes
                    console.log("COUB_DOWNLOADER: mutationsList leght " + selectMutation.length)
                    console.log("COUB_DOWNLOADER: " + selectMutation)
                    console.log(selectMutation)

                    console.log("COUB_DOWNLOADER: im here")
                    for (var j = 0; j < selectMutation.length; j++) {
                        let selectMutationChildren = selectMutation[j].children
                        console.log("COUB_DOWNLOADER: mutationsList leght " + selectMutationChildren.length)
                        console.log("COUB_DOWNLOADER: " + selectMutationChildren)
                        console.log(selectMutationChildren)

                        for (let k = 0; k < selectMutationChildren.length; k++) {
                            const child = selectMutationChildren[k];
                            console.log("COUB_DOWNLOADER: new link")
                            console.log(child)
                            addDownloadLink(child);
                        }
                    }
                }
                console.log("COUB_DOWNLOADER: callback end ===========================================================")
            };

            let observer = new MutationObserver(callback);

            let targetList = coubListListener.querySelector('div.page');
            if (!targetList) {
                window.setTimeout(addObserverIfDesiredNodeAvailable, 1000);
                return;
            }

            console.log("COUB_DOWNLOADER: targetList " + targetList.length)

            let rows = targetList.children;

            for (var i = 0; i < rows.length; i++) {
                let r1 = rows[i].querySelector("div.nativeroll-timeline-banner")
                if (r1 != null) {
                    console.log("COUB_DOWNLOADER: " + i + ") is adb")
                    continue;
                }
                console.log("COUB_DOWNLOADER: " + i + ") add link to ")
                console.log(rows[i])
                addDownloadLink(rows[i]);
            }
            observer.observe(coubListListener, {childList: true});
        }

        addObserverIfDesiredNodeAvailable()

        function addDownloadLink(rows) {
            console.log("COUB_DOWNLOADER: starte download link =======================================================")

            let descriptionBody = rows.querySelector('div.description__body');

            if (descriptionBody) {
                if (!descriptionBody) {
                    return;
                }

                let jsonString = rows.querySelector('div.data').querySelector("script").innerHTML;
                let json = JSON.parse(jsonString)

                var videoUrl
                let videoUrlHalf = json.file_versions.html5.video

                if (videoUrlHalf.hasOwnProperty('higher')) {
                    videoUrl = json.file_versions.html5.video.higher.url
                } else {
                    videoUrl = json.file_versions.html5.video.high.url
                }
                let audioUrl = json.file_versions.html5.audio.high.url

                let coubName = descriptionBody.querySelector("h5.description__title").innerText
                console.log("COUB_DOWNLOADER: coubName " + coubName)

                let descriptionControls = rows.querySelector('div.description__controls');

                var button = document.createElement('button');
                button.innerHTML = 'Скачать full';
                button.className = 'downloadLink';
                button.onclick = function () {
                    let xhr = new XMLHttpRequest();
                    xhr.open("POST", 'http://127.0.0.1:5000/' + coubName);
                    // xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                        video: videoUrl,
                        audio: audioUrl
                    }));
                };
                descriptionControls.appendChild(button);
            }
            console.log("COUB_DOWNLOADER: end new download link ======================================================")
        }
    }
})();
