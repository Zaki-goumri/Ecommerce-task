# E-commerce Product API

## Tech Stack
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Redis (for caching)
- Swagger (API documentation)
- TypeScript

## How to Run
```bash
npm install
npm run build
npm start
```

Or with Docker Compose:
```bash
docker compose up --build
```

## API Endpoints


### Get All Products
```
GET /products
```
- Optional filter: `?category=Apparel`

### Get Product by ID
```
GET /products/:id
```

### Create Product
```
POST /products
Content-Type: application/json
{
  "title": "Hat",
  "image": "https://...",
  "price": 29.99,
  "stock": 15,
  "category": "Apparel"
}
```

## Sample cURL Requests

Get all products:
```
curl http://localhost:5000/products
```

Get products by category:
```
curl "http://localhost:5000/products?category=Apparel"
```

Get product by ID:
```
curl http://localhost:5000/products/<id>
```

Create a product:
```
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Hat","image":"https://...","price":29.99,"stock":15,"category":"Apparel"}'
```

there is other api endpoints not required you can check them 

## API Documentation
Swagger UI available at `/api-docs` (after dependency install).

## Notes
- Redis is used for caching product queries and single product lookups.
- MongoDB is used for persistent product storage.
- See `src/services/productService.ts` for caching logic.
- check `src/docs` for more details
