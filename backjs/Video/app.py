from flask import Flask, request, jsonify, render_template
from youtube_transcript_api import YouTubeTranscriptApi
import logging

app = Flask(__name__)

def get_transcript(video_id):
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        full_transcript = " ".join([i['text'] for i in transcript])
        return full_transcript

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/transcript', methods=['GET'])
def get_video_transcript():
    video_id = request.args.get('video_id')

    transcript = get_transcript(video_id)
    if transcript is None:
        return jsonify({'error': 'Could not retrieve transcript'}), 500

    return jsonify({'transcript': transcript})

if __name__ == '__main__':
    app.run(debug=True, port =5500) 
