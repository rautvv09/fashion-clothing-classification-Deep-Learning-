import numpy as np
from PIL import Image


def preprocess_image(image):

    # Convert to grayscale
    image = image.convert("L")

    # Resize to Fashion-MNIST size
    image = image.resize((28, 28))

    # Convert to numpy
    image_array = np.array(image)

    # Normalize
    image_array = image_array.astype("float32") / 255.0

    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # Add channel dimension
    image_array = np.expand_dims(
        image_array,
        axis=-1
    )

    return image_array