from flask import Blueprint, jsonify
from db import execute_query

attrition_bp = Blueprint('attrition', __name__)

@attrition_bp.route('/attrition', methods=['GET'])
def get_attrition():
    """Fetch all attrition data from existing table."""
    results = execute_query("SELECT * FROM Attrition_Prediction")
    if results is None:
        return jsonify({"error": "Failed to fetch attrition data"}), 500
    return jsonify(results), 200

@attrition_bp.route('/attrition/high-risk', methods=['GET'])
def get_high_risk():
    """Fetch only high-risk records using specific filter."""
    query = "SELECT * FROM Attrition_Prediction WHERE risk_level = 'High'"
    results = execute_query(query)
    if results is None:
        return jsonify({"error": "Failed to fetch high-risk data"}), 500
    return jsonify(results), 200
