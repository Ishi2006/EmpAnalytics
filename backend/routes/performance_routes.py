from flask import Blueprint, jsonify
from db import execute_query

performance_bp = Blueprint('performance', __name__)

@performance_bp.route('/performance', methods=['GET'])
def get_performance():
    """Fetch all performance data from existing table."""
    results = execute_query("SELECT * FROM Performance")
    if results is None:
        return jsonify({"error": "Failed to fetch performance data"}), 500
    return jsonify(results), 200
