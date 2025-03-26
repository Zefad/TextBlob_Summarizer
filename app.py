from flask import Flask, render_template, request, jsonify
from textblob import TextBlob

app = Flask(__name__)

def summarize_text_blob(text, num_sentences=3):
    blob = TextBlob(text)
    sentences = blob.sentences

    word_frequencies = {}
    for word in blob.words:
        word_lower = word.lower()
        word_frequencies[word_lower] = word_frequencies.get(word_lower, 0) + 1

    max_frequency = max(word_frequencies.values()) if word_frequencies else 1
    for word in word_frequencies:
        word_frequencies[word] /= max_frequency

    sentence_scores = {}
    for sentence in sentences:
        sentence_scores[sentence] = sum(word_frequencies.get(word.lower(), 0) for word in sentence.words)

    sorted_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)
    summary_sentences = sorted_sentences[:num_sentences]

    summary = " ".join([str(sent) for sent in summary_sentences])
    return summary

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    text = data['text']
    num_sentences = int(data.get('num_sentences', 3))
    summary = summarize_text_blob(text, num_sentences)
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True)
