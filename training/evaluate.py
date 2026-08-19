import numpy as np
import tensorflow as tf

from sklearn.metrics import (
    classification_report,
    confusion_matrix
)

import matplotlib.pyplot as plt
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "backend", "models", "fashion_cnn.keras")

class_names = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot"
]

# Load model

model = tf.keras.models.load_model(MODEL_PATH)

# Load dataset

(_, _), (x_test, y_test) = (
    tf.keras.datasets.fashion_mnist.load_data()
)

# Normalize

x_test = x_test.astype("float32") / 255.0

# Add channel

x_test = np.expand_dims(x_test, axis=-1)

# Predictions

predictions = model.predict(x_test)

y_pred = np.argmax(predictions, axis=1)

# Classification report

print("\nClassification Report\n")

print(
    classification_report(
        y_test,
        y_pred,
        target_names=class_names
    )
)

# Confusion matrix

cm = confusion_matrix(
    y_test,
    y_pred
)

plt.figure(figsize=(10, 8))

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    xticklabels=class_names,
    yticklabels=class_names
)

plt.xlabel("Predicted")

plt.ylabel("Actual")

plt.title("Fashion-MNIST Confusion Matrix")

plt.tight_layout()

plt.show()