from flask import Flask, request, jsonify
import pandas as pd
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    console = data['console']
    genre = data['genre']
    critic_score = data['critic_score']

    df = pd.DataFrame({
        'console': [console],
        'genre': [genre],
        'critic_score': [critic_score]
    })
    
    scaler = StandardScaler()
    scaler_data = scaler.fit_transform(df)

    # df['critic_score'] = scaler.fit_transform(df[['critic_score']])
    return jsonify({'message': 'Data received successfully', 'scaler_data': scaler_data.tolist()})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
