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


_model = None
_class_names = None


def get_model_and_classes():
    global _model, _class_names

    if _model is None:
        _model = tf.keras.models.load_model(MODEL_PATH)

    if _class_names is None:
        with open(CLASS_NAMES_PATH, "r") as file:
            _class_names = json.load(file)

    return _model, _class_names


def predict_image(image):

    model, class_names = get_model_and_classes()

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