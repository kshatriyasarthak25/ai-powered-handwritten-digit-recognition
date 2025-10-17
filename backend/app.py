from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = 'models/mnist_model.h5'
model = None

def load_model():
    """Load the pre-trained MNIST model"""
    global model
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully!")
    else:
        print("Model file not found. Please train the model first by running model.py")

def preprocess_image(image_data):
    """
    Preprocess canvas image to match MNIST format exactly
    MNIST format: white digit (255) on black background (0)
    """
    try:
        import cv2
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes)).convert('L')
        img_array = np.array(image)
        
        print(f"Original image shape: {img_array.shape}")
        print(f"Original mean pixel value: {np.mean(img_array):.2f}")
        
        # Canvas has white strokes on black background - invert it
        # MNIST needs white digit on black background
        img_array = 255 - img_array
        
        print(f"After inversion mean: {np.mean(img_array):.2f}")
        
        # Apply Gaussian blur to smooth edges
        img_array = cv2.GaussianBlur(img_array, (5, 5), 0)
        
        # Apply thresholding
        _, img_array = cv2.threshold(img_array, 30, 255, cv2.THRESH_BINARY)
        
        # Find contours to get bounding box
        contours, _ = cv2.findContours(img_array, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # Get the largest contour (the digit)
            largest_contour = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest_contour)
            
            # Add padding
            padding = 20
            x = max(0, x - padding)
            y = max(0, y - padding)
            w = min(img_array.shape[1] - x, w + 2 * padding)
            h = min(img_array.shape[0] - y, h + 2 * padding)
            
            # Crop to bounding box
            digit = img_array[y:y+h, x:x+w]
            
            # Calculate aspect ratio and resize
            rows, cols = digit.shape
            if rows > cols:
                factor = 20.0 / rows
                new_rows = 20
                new_cols = int(round(cols * factor))
            else:
                factor = 20.0 / cols
                new_cols = 20
                new_rows = int(round(rows * factor))
            
            # Resize the digit
            digit_resized = cv2.resize(digit, (new_cols, new_rows), interpolation=cv2.INTER_AREA)
            
            # Create 28x28 black canvas
            canvas = np.zeros((28, 28), dtype=np.uint8)
            
            # Center the digit
            col_padding = (28 - new_cols) // 2
            row_padding = (28 - new_rows) // 2
            canvas[row_padding:row_padding+new_rows, col_padding:col_padding+new_cols] = digit_resized
            
            img_array = canvas
        else:
            # No contours found, just resize
            img_array = cv2.resize(img_array, (28, 28), interpolation=cv2.INTER_AREA)
        
        # OPTIONAL: Save preprocessed image for debugging
        cv2.imwrite('debug_preprocessed.png', img_array)
        print("Saved preprocessed image to debug_preprocessed.png")
        
        # Normalize to [0, 1]
        img_array = img_array.astype('float32') / 255.0
        
        print(f"Final normalized mean: {np.mean(img_array):.4f}")
        print(f"Final shape before model: {img_array.shape}")
        
        # Reshape for model: (1, 28, 28, 1)
        img_array = np.expand_dims(img_array, axis=-1)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict digit from canvas image"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please train the model first.'
            }), 500
        
        # Get image data from request
        data = request.get_json()
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Preprocess image
        img_array = preprocess_image(data['image'])
        if img_array is None:
            return jsonify({'error': 'Failed to process image'}), 400
        
        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        predicted_class = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_class])
        
        # Get all probabilities
        probabilities = {
            str(i): float(predictions[0][i]) 
            for i in range(10)
        }
        
        return jsonify({
            'prediction': predicted_class,
            'confidence': confidence,
            'probabilities': probabilities
        })
    
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'input_shape': str(model.input_shape),
        'output_shape': str(model.output_shape),
        'total_params': int(model.count_params())
    })

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=8000, debug=True)
