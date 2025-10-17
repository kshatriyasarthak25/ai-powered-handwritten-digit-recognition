# 🎨 AI-Powered Handwritten Digit Recognition

A full-stack deep learning application that recognizes handwritten digits (0-9) in real-time using a Convolutional Neural Network trained on the MNIST dataset.

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-orange)
![Flask](https://img.shields.io/badge/Flask-3.0-green)

## ✨ Features

- **Real-time Digit Recognition**: Draw digits on an interactive canvas and get instant predictions
- **High Accuracy**: CNN model trained on MNIST achieving ~99% accuracy
- **Interactive Visualization**: Bar chart displaying confidence scores for all digits
- **Responsive Design**: Modern glass-morphism UI with mobile support
- **RESTful API**: Flask backend with CORS-enabled endpoints
- **Touch Support**: Works on both desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization
- **HTML5 Canvas** - Drawing interface

### Backend
- **Flask** - Python web framework
- **TensorFlow/Keras** - Deep learning framework
- **OpenCV** - Image preprocessing
- **NumPy** - Numerical computing
- **Pillow** - Image processing

## 📁 Project Structure

digit-recognition/
├── backend/
│ ├── app.py # Flask API server
│ ├── model.py # CNN model training script
│ ├── requirements.txt # Python dependencies
│ └── models/
│ └── mnist_model.h5 # Trained model (generated)
├── frontend/
│ ├── app/
│ │ ├── page.tsx # Main page
│ │ ├── layout.tsx # Root layout
│ │ └── globals.css # Global styles
│ ├── components/
│ │ └── DrawingCanvas.tsx # Canvas component
│ ├── package.json
│ ├── next.config.js
│ ├── tsconfig.json
│ ├── tailwind.config.js
│ └── postcss.config.js
├── .gitignore
└── README.md


## 📋 Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.8 or higher
- **npm** or **yarn**
- **pip** (Python package manager)

## 🚀 Installation

### Backend Setup

1. **Navigate to backend directory**
cd backend

2. **Create virtual environment**
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

3. **Install dependencies**
pip install -r requirements.txt

4. **Train the model** (first time only)
python model.py
This will download the MNIST dataset, train the CNN model, and save it to `models/mnist_model.h5`. Training takes approximately 5-10 minutes.

5. **Start Flask server**
python app.py
Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
cd frontend

2. **Install dependencies**
npm install

3. **Start development server**
npm run dev
Frontend will run on `http://localhost:3000`

## 💻 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Draw a digit (0-9) on the white canvas using your mouse or touch
3. Click the **Predict** button to get AI prediction
4. View the predicted digit and confidence scores
5. Click **Clear** to draw another digit

## 🧠 Model Architecture

The CNN model consists of:
- **Input Layer**: 28x28x1 grayscale images
- **3 Convolutional Blocks**: Conv2D → MaxPooling → BatchNormalization
- **Dropout Layers**: 50% and 30% for regularization
- **Dense Layers**: 128 units with ReLU activation
- **Output Layer**: 10 units with Softmax activation

**Performance:**
- Training Accuracy: ~99.5%
- Test Accuracy: ~99.0%
- Total Parameters: ~500K

## 🐛 Troubleshooting

### Issue: Model predicts same digit for everything

**Solution:** Ensure preprocessing is correct. Check `debug_preprocessed.png` in the backend folder. The image should show a white digit on black background, centered in a 28x28 canvas.

### Issue: Module not found '@/components/DrawingCanvas'

**Solution:** Verify `tsconfig.json` exists with proper path aliases configuration.

### Issue: CORS errors

**Solution:** Ensure Flask-CORS is installed and the backend is running on port 8000.

### Issue: Low accuracy predictions

**Solution:** Retrain the model by running `python model.py` again. Delete the old model file first.

## 📊 Dataset

This project uses the **MNIST dataset**:
- 60,000 training images
- 10,000 test images
- 28x28 grayscale images
- 10 classes (digits 0-9)

The dataset is automatically downloaded during model training.

## 🎯 Future Enhancements

- [ ] Add confidence threshold filtering
- [ ] Support for multiple digit recognition
- [ ] Export predictions to CSV
- [ ] Model performance metrics dashboard
- [ ] Docker containerization
- [ ] Cloud deployment (Vercel + Railway)
- [ ] Add data augmentation during training
- [ ] Implement model versioning

## 🙏 Acknowledgments

- **MNIST Database**: Yann LeCun and Corinna Cortes
- **TensorFlow/Keras**: Google Brain Team
- **Next.js**: Vercel
- **Flask**: Pallets Projects


