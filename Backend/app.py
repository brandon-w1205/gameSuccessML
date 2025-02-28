from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
from dataset import predicter 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/submit', methods=['POST'])
def submit():
    print("Received data:", request.json)
    title = request.json['title']

    data = request.json
    data.pop('title', None)

    prediction = predicter(data)

    return jsonify({'message': 'Prediction received successfully', 'prediction': prediction})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
