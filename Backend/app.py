from flask import Flask, request, jsonify
import pandas as pd
from dataset import predicter 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

df = pd.read_csv('vgchartz-2024.csv', encoding='latin-1')
specific_columns = ['title', 'console', 'genre', 'critic_score', 'total_sales']
dftable = df[specific_columns].dropna()

@app.route('/submit', methods=['POST'])
def submit():
    print("Received data:", request.json)
    title = request.json['title']

    data = request.json
    data.pop('title', None)

    prediction = predicter(data)

    return jsonify({'message': 'Prediction received successfully', 'prediction': prediction})


@app.route('/consoles', methods=['GET'])
def get_consoles():
    unique_consoles = dftable['console'].unique().tolist()
    return jsonify(unique_consoles)

@app.route('/genres', methods=['GET'])
def get_genres():
    unique_genres = dftable['genre'].unique().tolist()
    return jsonify(unique_genres)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
