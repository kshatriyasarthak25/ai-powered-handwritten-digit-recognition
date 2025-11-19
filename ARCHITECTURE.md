# Architecture & Infrastructure

## Diagram (ASCII / Mermaid)
```
[Browser / Client]
       |
       | HTTP POST (image payload/base64)
       v
[Frontend (Next.js + Canvas)] -> Sends image -> [Flask API]
                                     |
                                     v
                               Preprocessing
                                     |
                                     v
                                 CNN Model
                                     |
                                     v
                              Prediction (digit + confidences)
                                     |
                                     v
                              Response JSON -> Frontend UI
```

(Mermaid-style)
```mermaid
graph LR
  A[User Browser / Canvas] -->|POST image| B[Next.js Frontend]
  B -->|HTTP| C[Flask API]
  C --> D[Preprocessing]
  D --> E[CNN Model (TensorFlow/Keras)]
  E --> F[Prediction: label + confidences]
  F --> B
```

## Components
- **Frontend (Next.js + TypeScript + Tailwind CSS)**:
  - Renders the drawing canvas
  - Handles touch/mouse input
  - Sends base64 image or pixel array to backend
  - Visualises prediction + confidence using Chart.js

- **Backend (Flask)**:
  - Stateless REST API
  - Loads model into memory on startup
  - Preprocesses incoming images: resize -> grayscale -> invert/normalize -> center -> 28x28 array
  - Runs inference and returns JSON

- **Model (TensorFlow/Keras)**:
  - Lightweight CNN trained on MNIST
  - Architecture: Conv blocks + Dropout + Dense + Softmax
  - Saved as `*.h5` or SavedModel format

- **Infrastructure (Deployment options)**:
  - Static hosting for frontend (Vercel, Netlify) + CDN
  - Backend container on Docker -> host on AWS ECS/Fargate, Heroku, or a small VM (DigitalOcean)
  - Use autoscaling and load balancer if needed
  - Optional: serverless inference (AWS Lambda with a small model or Lambda + EFS for model file)

## Data Flow Summary
1. User draws -> frontend captures canvas image
2. Frontend sends image via POST to Flask API
3. Flask preprocesses -> converts image to model input
4. Model performs inference -> returns predicted label + confidence vector
5. Frontend displays results and chart to user

