import os
import json
import numpy as np
import tensorflow as tf

from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# --------------------------------------------------
# Configuration
# --------------------------------------------------

IMG_SIZE = 28
NUM_CLASSES = 10
BATCH_SIZE = 128
EPOCHS = 20

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "backend", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "fashion_cnn.keras")

os.makedirs(MODEL_DIR, exist_ok=True)

# --------------------------------------------------
# Class Names
# --------------------------------------------------

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

# --------------------------------------------------
# Load Fashion-MNIST
# --------------------------------------------------

print("Loading Fashion-MNIST dataset...")

(x_train, y_train), (x_test, y_test) = (
    tf.keras.datasets.fashion_mnist.load_data()
)

print("Training images:", x_train.shape)
print("Testing images:", x_test.shape)

# --------------------------------------------------
# Normalize images
# --------------------------------------------------

x_train = x_train.astype("float32") / 255.0
x_test = x_test.astype("float32") / 255.0

# CNN expects:

# (samples, height, width, channels)

x_train = np.expand_dims(x_train, axis=-1)
x_test = np.expand_dims(x_test, axis=-1)

print("Processed training shape:", x_train.shape)

# --------------------------------------------------
# CNN Model
# --------------------------------------------------

model = models.Sequential([
    
    layers.Input(shape=(28, 28, 1)),

    # Convolution Block 1
    layers.Conv2D(
        32,
        (3, 3),
        activation="relu",
        padding="same"
    ),

    layers.BatchNormalization(),

    layers.Conv2D(
        32,
        (3, 3),
        activation="relu",
        padding="same"
    ),

    layers.MaxPooling2D((2, 2)),

    layers.Dropout(0.25),

    # Convolution Block 2
    layers.Conv2D(
        64,
        (3, 3),
        activation="relu",
        padding="same"
    ),

    layers.BatchNormalization(),

    layers.Conv2D(
        64,
        (3, 3),
        activation="relu",
        padding="same"
    ),

    layers.MaxPooling2D((2, 2)),

    layers.Dropout(0.25),

    # Convolution Block 3
    layers.Conv2D(
        128,
        (3, 3),
        activation="relu",
        padding="same"
    ),

    layers.BatchNormalization(),

    layers.MaxPooling2D((2, 2)),

    layers.Dropout(0.25),

    # Classification
    layers.Flatten(),

    layers.Dense(128, activation="relu"),

    layers.BatchNormalization(),

    layers.Dropout(0.5),

    layers.Dense(
        NUM_CLASSES,
        activation="softmax"
    )
])

# --------------------------------------------------
# Model Summary
# --------------------------------------------------

model.summary()

# --------------------------------------------------
# Compile
# --------------------------------------------------

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

# --------------------------------------------------
# Callbacks
# --------------------------------------------------

callbacks = [

    EarlyStopping(
        monitor="val_loss",
        patience=4,
        restore_best_weights=True
    ),

    ModelCheckpoint(
        MODEL_PATH,
        monitor="val_accuracy",
        save_best_only=True
    )
]

# --------------------------------------------------
# Training
# --------------------------------------------------

print("\nStarting training...\n")

history = model.fit(
    x_train,
    y_train,
    validation_split=0.1,
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    callbacks=callbacks,
    verbose=1
)

# --------------------------------------------------
# Evaluation
# --------------------------------------------------

test_loss, test_accuracy = model.evaluate(
    x_test,
    y_test,
    verbose=1
)

print("\n==============================")
print("Training completed")
print("==============================")

print(f"Test Loss: {test_loss:.4f}")
print(f"Test Accuracy: {test_accuracy * 100:.2f}%")

# --------------------------------------------------
# Save class names
# --------------------------------------------------

class_names_path = os.path.join(
    MODEL_DIR,
    "class_names.json"
)

with open(class_names_path, "w") as f:
    json.dump(class_names, f, indent=4)

print("\nModel saved at:")
print(MODEL_PATH)

print("\nClass names saved at:")
print(class_names_path)