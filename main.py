import os
import json
import uuid

from flask import Flask, request
from urllib.request import urlretrieve
from moviepy.video.fx.loop import loop
from moviepy.audio.io.AudioFileClip import AudioFileClip
from moviepy.video.io.VideoFileClip import VideoFileClip

app = Flask(__name__)
os.makedirs("result", exist_ok=True)


@app.route(rule="/<name>", methods=["GET", "POST"])
def coub(name: str):
    json_string = str(request.data)
    json_clean = json_string[2: len(json_string) - 1]
    json_obj = json.loads(json_clean)
    print("name - {0}\nvideo - {1}\naudio - {2}".format(name, json_obj["video"], json_obj["audio"]))
    coub_downloader(json_obj["video"], json_obj["audio"], name)
    return "OK"


def coub_downloader(coub_video_url: str, coub_audio_url: str, coub_name: str):
    unique_name = str(uuid.uuid4())
    print(f"unique name {unique_name}")
    coub_video_path = f"result/{unique_name}.mp4"
    coub_audio_path = f"result/{unique_name}.mp3"
    coub_result_path = f"result/{coub_name}.mp4"

    try:
        print("download files")
        download_coub_files(coub_video_url, coub_video_path, coub_audio_url, coub_audio_path)
        print("combine audio")
        combine_video_with_audio(video_path=coub_video_path, audio_path=coub_audio_path, result_path=coub_result_path)
    finally:
        print("remove coub files")
        remove_coub_files(video_path=coub_video_path, audio_path=coub_audio_path)


def download_coub_files(video_url: str, video_path: str, audio_url: str, audio_path: str):
    urlretrieve(url=video_url, filename=video_path)
    urlretrieve(url=audio_url, filename=audio_path)


def combine_video_with_audio(video_path: str, audio_path: str, result_path: str, fps: int = 60):
    short_clip = VideoFileClip(filename=video_path)
    audio_background = AudioFileClip(filename=audio_path)

    full_video = loop(short_clip, duration=audio_background.duration)
    final_clip = full_video.set_audio(audioclip=audio_background)

    final_clip.write_videofile(result_path, fps=fps)


def remove_coub_files(video_path: str, audio_path: str):
    os.remove(video_path)
    os.remove(audio_path)


if __name__ == "__main__":
    app.run()
