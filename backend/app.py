import os
import io
import traceback
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

from services.predictor import predict_image, preload_model_in_background

app = Flask(__name__)

# Configure CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Asynchronously pre-warm the model on server startup
preload_model_in_background()


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Fashion Classification API",
        "status": "running"
    }), 200


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy"
    }), 200


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({
                "success": False,
                "error": "No image uploaded. Please select an image file."
            }), 400

        image_file = request.files["image"]

        if not image_file or image_file.filename == "":
            return jsonify({
                "success": False,
                "error": "No image selected. Please choose a valid image file."
            }), 400

        image_bytes = image_file.read()
        if not image_bytes:
            return jsonify({
                "success": False,
                "error": "Uploaded image file is empty."
            }), 400

        image = Image.open(io.BytesIO(image_bytes))
        image.load()

        result = predict_image(image)

        return jsonify({
            "success": True,
            "prediction": result
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )