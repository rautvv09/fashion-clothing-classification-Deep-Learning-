import os
import json
import numpy as np
import tensorflow as tf

from utils.image_processor import preprocess_image


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "fashion_cnn.keras"
)

CLASS_NAMES_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "class_names.json"
)


# Load model once when server starts

model = tf.keras.models.load_model(
    MODEL_PATH
)


# Load class names

with open(CLASS_NAMES_PATH, "r") as file:
    class_names = json.load(file)


def predict_image(image):

    processed_image = preprocess_image(
        image
    )

    predictions = model(
        processed_image,
        training=False
    ).numpy()[0]

    predicted_index = int(
        np.argmax(predictions)
    )

    predicted_class = class_names[
        predicted_index
    ]

    confidence = float(
        predictions[predicted_index]
    )

    probabilities = {
        class_names[i]: float(predictions[i])
        for i in range(len(class_names))
    }

    return {
        "class": predicted_class,
        "confidence": confidence,
        "probabilities": probabilities
    }