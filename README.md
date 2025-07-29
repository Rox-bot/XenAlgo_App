# XenAlgo Trading Psychology AI API

A FastAPI-based AI service for analyzing trading psychology and behavioral patterns.

## Features

- **Behavioral Analysis**: Analyze trading patterns and emotional trends
- **Risk Assessment**: Calculate risk scores and behavioral patterns
- **Predictive Modeling**: Predict future trading behavior
- **Performance Correlation**: Correlate emotions with trading performance

## API Endpoints

- `GET /health` - Health check
- `POST /analyze-behavior` - Analyze trading behavior
- `POST /predict-behavior` - Predict future behavior
- `GET /model-info` - Get model information

## Deployment

This service is designed to be deployed on Railway.

### Local Development

```bash
pip install -r requirements.txt
python main.py
```

### Railway Deployment

1. Connect this repository to Railway
2. Railway will automatically detect Python and install dependencies
3. Service will be available at the provided Railway URL

## Environment Variables

- `PORT`: Server port (default: 8000)
- `HOST`: Server host (default: 0.0.0.0)

## Health Check

The service includes a health check endpoint at `/health` that returns:

```json
{
  "status": "healthy",
  "service": "trading-psychology-ai",
  "timestamp": "2024-01-01T00:00:00",
  "models_loaded": true
}
```
