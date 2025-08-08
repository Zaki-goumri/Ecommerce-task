# Technical Documentation

## Product API
- **GET /products**: Returns all products, can filter by `category` query param. Uses Redis cache.
- **GET /products/:id**: Returns a product by ID. Uses Redis cache.
- **POST /products**: Creates a new product. Validates required fields. Invalidates product list cache.

## Redis Caching
- Product lists and single product queries are cached for 60 seconds.
- Cache keys: `products:all`, `products:category:<category>`, `product:<id>`.
- On product creation, `products:all` cache is invalidated.

## StatusCode Enum
- Located in `src/types/StatusCode.ts`.
- Maps HTTP status codes to descriptive names for clarity and maintainability.

## Data Model
- Product: `{ title, image, price, stock, category? }`

## Swagger Docs
- JSDoc comments in routes auto-generate OpenAPI docs (see `/api-docs` route if Swagger UI is enabled).

## How to Extend
- Add more fields to the product model as needed.
- Add more endpoints (PUT, DELETE) and update cache invalidation logic accordingly.
- Use the StatusCode enum for all API responses.

## Error Handling
- All errors return appropriate HTTP status and message.
- 400 for validation, 404 for not found, 500 for server errors.

## Security
- Use environment variables for DB/Redis connection strings and secrets.
- Use JWT auth for protected endpoints (see user routes).
