# Core Features & Trade-offs

## Core features implemented
1. **Interactive drawing canvas** (mouse + touch) — natural input for users.
2. **Real-time prediction API** — low-latency inference via Flask + TensorFlow.
3. **Confidence visualization** — bar chart showing probability distribution across 0–9.
4. **Preprocessing pipeline** — robust image preprocessing to improve accuracy.
5. **Clear and Predict controls** — simple UX for iterative tries.
6. **Modular codebase** — separated model training, API serving, and frontend.

## Why these matter for users
- Canvas + real-time feedback make the system intuitive for non-technical users.
- Confidence visualization helps users understand model uncertainty and improves trust.
- Robust preprocessing avoids garbage-in garbage-out problems for diverse handwriting.
- Modularity eases maintenance and supports future improvements.

## Important trade-offs
- **Lightweight model vs. absolute best accuracy**: Chose a compact CNN for low latency and easy deployment; larger models could improve accuracy on very noisy inputs but would increase inference time and resource cost.
- **Single-digit focus**: The app focuses on single-digit recognition which simplifies preprocessing and model design; multi-digit recognition or cursive handwriting would require sequence models or segmentation.
- **Flask (simple) vs. more scalable frameworks**: Flask is lightweight and easy to prototype; for high traffic, moving to FastAPI or containerized microservices with autoscaling is recommended.
