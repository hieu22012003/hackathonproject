from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    full_transcript = " ".join([i['text'] for i in transcript])
    return full_transcript


def main():
    video_id = 'Gc5eICzHkFU'  # insert YouTube video id here
    full_transcript = get_transcript(video_id)
    print(full_transcript)

if __name__ == '__main__':
    main()
