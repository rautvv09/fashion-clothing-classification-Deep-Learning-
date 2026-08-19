import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from services.predictor import predict_image

app = Flask(__name__)

CORS(app)


@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Fashion Classification API",
        "status": "running"
    })


@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "healthy"
    })


import io
import traceback
from PIL import Image

@app.route("/api/predict", methods=["POST"])
def predict():

    try:

        if "image" not in request.files:

            return jsonify({
                "error": "No image uploaded"
            }), 400

        image_file = request.files["image"]

        if image_file.filename == "":

            return jsonify({
                "error": "No image selected"
            }), 400

        image_bytes = image_file.read()
        image = Image.open(io.BytesIO(image_bytes))
        image.load()

        result = predict_image(image)

        return jsonify({
            "success": True,
            "prediction": result
        })

    except Exception as e:

        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )