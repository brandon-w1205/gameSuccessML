from flask import Flask, request, jsonify
import pandas as pd
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit():
    