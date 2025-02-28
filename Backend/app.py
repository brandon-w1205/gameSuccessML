from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
from dataset import predicter 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/submit', methods=['POST'])
def submit():
    print("Received data:", request.json)
    data = request.json

    required_fields = ['console', 'genre', 'critic_score']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    prediction = predicter(data)

    return jsonify({'message': 'Prediction received successfully', 'prediction': prediction})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
