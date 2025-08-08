# System Design Overview

## Architecture
- **Express.js** REST API server
- **MongoDB** for persistent product/user/cart storage
- **Redis** for caching product queries
- **Swagger** for API documentation
- **Docker Compose** for orchestration of app, MongoDB, and Redis

## Data Flow
1. Client makes API request to Express server
2. For product endpoints, Redis cache is checked first
3. If cache miss, MongoDB is queried, and result is cached in Redis
4. For POST/PUT/DELETE, cache is invalidated as needed

## Components
- **API Layer**: Express routes/controllers
- **Service Layer**: Business logic, caching, validation
- **Data Layer**: Mongoose models for MongoDB
- **Cache Layer**: Redis client

## Scaling
- Stateless API containers (can scale horizontally)
- MongoDB and Redis can be clustered

## Security
- JWT for authentication (user endpoints)
- Environment variables for secrets and connection strings

## Diagram

```
[Client] ⇄ [Express API] ⇄ [MongoDB]
           ⬑ [Redis Cache]
```
