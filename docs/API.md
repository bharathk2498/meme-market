# API Documentation

Base URL: `http://localhost:8000/api/v1` (development)

## Authentication

Currently, API endpoints are open. In production, add API key authentication.

## Rate Limiting

- 60 requests per minute per IP address
- Exceeding limits returns 429 status code

## Endpoints

### Health Check

#### GET /health

Check API and database health status.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Predictions

#### GET /api/v1/predictions/top

Get top predicted viral posts.

**Parameters:**
- `limit` (optional): Number of predictions (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "predictions": [
    {
      "reddit_id": "abc123",
      "subreddit": "technology",
      "title": "Amazing new AI breakthrough",
      "url": "https://example.com",
      "author": "user123",
      "score": 5420,
      "upvote_ratio": 0.95,
      "num_comments": 234,
      "created_utc": "2025-10-18T10:30:00",
      "virality_score": 87.5,
      "permalink": "/r/technology/comments/abc123/"
    }
  ]
}
```

#### GET /api/v1/predictions/trending

Get currently trending posts.

**Parameters:**
- `hours` (optional): Time window in hours (default: 24)

**Response:**
```json
{
  "success": true,
  "count": 15,
  "trending": [...]
}
```

#### GET /api/v1/predictions/subreddit/{subreddit}

Get predictions for specific subreddit.

**Parameters:**
- `subreddit` (path): Subreddit name (without r/)
- `limit` (optional): Number of predictions (default: 10)

**Example:**
```bash
GET /api/v1/predictions/subreddit/technology?limit=5
```

### Reddit Collection

#### POST /api/v1/reddit/collect

Trigger Reddit data collection (runs in background).

**Response:**
```json
{
  "success": true,
  "message": "Collection started in background"
}
```

#### GET /api/v1/reddit/status

Get collection status and statistics.

**Response:**
```json
{
  "success": true,
  "status": {
    "total_posts": 5420,
    "last_collection": "2025-10-18T14:30:00",
    "status": "active"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid parameter value"
}
```

### 429 Too Many Requests
```json
{
  "detail": "Rate limit exceeded. Try again in 60 seconds"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Failed to fetch predictions"
}
```

## Webhooks (Coming Soon)

Subscribe to real-time alerts when high virality scores detected.

## SDK Support (Coming Soon)

- Python SDK
- JavaScript/TypeScript SDK
- REST API clients
