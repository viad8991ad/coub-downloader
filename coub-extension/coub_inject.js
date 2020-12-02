(function () {
    const coubViewUrl = "coub.com/view"

    let getUrl = document.URL

    if (getUrl.includes(coubViewUrl)) {
        console.log("PEGAS_COUB_DOWNLOADER: open single coub " + getUrl)
        addDownloadLink(document)
    } else {
        console.log("PEGAS_COUB_DOWNLOADER: open list coub-s " + getUrl)

        function addObserverIfDesiredNodeAvailable() {
            let coubListListener = document.querySelector("div.coubs-list__inner");

            const callback = function (mutationsChangingDiv) {
                console.log("PEGAS_COUB_DOWNLOADER: callback start ===================================================")

                for (let i = 0; i < mutationsChangingDiv.length; i++) {
                    let selectMutation = mutationsChangingDiv[i].addedNodes

                    for (let j = 0; j < selectMutation.length; j++) {
                        let selectMutationChildren = selectMutation[j].children

                        for (let k = 0; k < selectMutationChildren.length; k++) {
                            const child = selectMutationChildren[k];
                            addDownloadLink(child);
                        }
                    }
                }
                console.log("PEGAS_COUB_DOWNLOADER: callback end =====================================================")
            };

            let observer = new MutationObserver(callback);

            let targetChangingDiv = coubListListener.querySelector("div.page");
            if (!targetChangingDiv) {
                window.setTimeout(addObserverIfDesiredNodeAvailable, 1000);
                return;
            }

            let childrenDiv = targetChangingDiv.children;

            for (let i = 0; i < childrenDiv.length; i++) {
                let isAdvertisingBanner = childrenDiv[i].querySelector("div.nativeroll-timeline-banner")
                if (isAdvertisingBanner != null) {
                    continue;
                }
                addDownloadLink(childrenDiv[i]);
            }
            observer.observe(coubListListener, {childList: true});
        }

        addObserverIfDesiredNodeAvailable()
    }

    function addDownloadLink(rows) {
        console.log("PEGAS_COUB_DOWNLOADER: start create download button ---------------------------------------------")

        let descriptionBody = rows.querySelector("div.description__body");

        if (descriptionBody) {
            let jsonString = rows.querySelector("div.data").querySelector("script").innerHTML;
            let json = JSON.parse(jsonString)

            let audioUrl = json.file_versions.html5.audio.high.url

            let videoUrl;
            let videoUrlHalf = json.file_versions.html5.video
            if (videoUrlHalf.hasOwnProperty("higher")) {
                videoUrl = json.file_versions.html5.video.higher.url
            } else {
                videoUrl = json.file_versions.html5.video.high.url
            }

            let coubName = descriptionBody.querySelector("h5.description__title").innerText.replaceAll("/", "|")
            console.log("PEGAS_COUB_DOWNLOADER: create download button for coub name " + coubName)

            let descriptionControls = rows.querySelector("div.description__controls");
            let button = document.createElement("button");
            button.innerText = "full / hd";
            button.className = "pegas_download_link";
            button.onclick = function () {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", "http://127.0.0.1:5000/" + coubName);
                // nice js <3
                // xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify({
                    video: videoUrl,
                    audio: audioUrl
                }));

                let divPopupBackground = document.createElement("div");
                divPopupBackground.className = "pegas_popup";
                divPopupBackground.innerText = "Скачивание началось";

                xhr.onerror = function () {
                    divPopupBackground.innerText = "Ошибка скачивания";
                };
                document.querySelector("header.header").appendChild(divPopupBackground);
                setTimeout(function () {
                    divPopupBackground.remove();
                }, 2000);
            };
            descriptionControls.appendChild(button);
        }
        console.log("PEGAS_COUB_DOWNLOADER: end create download button -----------------------------------------------")
    }
})();
