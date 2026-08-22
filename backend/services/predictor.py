import os
import json
import threading
import numpy as np
import tensorflow as tf

from utils.image_processor import preprocess_image


MODEL_PATH = os.path.abspath(os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "fashion_cnn.keras"
))

CLASS_NAMES_PATH = os.path.abspath(os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "class_names.json"
))


_model = None
_class_names = None
_model_lock = threading.Lock()


# Custom BatchNormalization subclass to pop legacy renorm kwargs in Keras 3
class CustomBatchNormalization(tf.keras.layers.BatchNormalization):
    def __init__(self, **kwargs):
        kwargs.pop("renorm", None)
        kwargs.pop("renorm_clipping", None)
        kwargs.pop("renorm_momentum", None)
        super().__init__(**kwargs)


def build_architecture():
    """Rebuilds exact CNN architecture natively to avoid Keras deserialization errors."""
    return tf.keras.models.Sequential([
        tf.keras.layers.Input(shape=(28, 28, 1)),

        tf.keras.layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),

        tf.keras.layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),

        tf.keras.layers.Conv2D(128, (3, 3), activation="relu", padding="same"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),

        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(10, activation="softmax")
    ])


def get_model_and_classes():
    global _model, _class_names

    if _model is None or _class_names is None:
        with _model_lock:
            if _model is None:
                try:
                    # Primary method: Rebuild architecture and load weights directly
                    _model = build_architecture()
                    _model.load_weights(MODEL_PATH)
                    print(f"Loaded trained model weights from {MODEL_PATH} into native CNN architecture.")
                except Exception as weight_err:
                    print(f"Warning: load_weights failed ({weight_err}), falling back to tf.keras.models.load_model...")
                    try:
                        _model = tf.keras.models.load_model(
                            MODEL_PATH,
                            custom_objects={"BatchNormalization": CustomBatchNormalization}
                        )
                    except Exception as err:
                        _model = tf.keras.models.load_model(
                            MODEL_PATH,
                            compile=False,
                            custom_objects={"BatchNormalization": CustomBatchNormalization}
                        )

            if _class_names is None:
                with open(CLASS_NAMES_PATH, "r") as file:
                    _class_names = json.load(file)

    return _model, _class_names


def preload_model_in_background():
    def _loader():
        try:
            get_model_and_classes()
            print("AI Model pre-warmed and ready in memory.")
        except Exception as e:
            print(f"Error pre-warming model: {e}")

    thread = threading.Thread(target=_loader, daemon=True)
    thread.start()


def predict_image(image):
    model, class_names = get_model_and_classes()

    processed_image = preprocess_image(image)

    predictions = model(processed_image, training=False).numpy()[0]

    predicted_index = int(np.argmax(predictions))
    predicted_class = class_names[predicted_index]
    confidence = float(predictions[predicted_index])

    probabilities = {
        class_names[i]: float(predictions[i])
        for i in range(len(class_names))
    }

    return {
        "class": predicted_class,
        "confidence": confidence,
        "probabilities": probabilities
    }