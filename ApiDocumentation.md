# API Documentation:
## Overview:
**The application provides CRUD (Create, Read, Update, Delete) operations for managing overlays using IndexedDB.**

## Endpoints:

### Retrieve All Overlays:

**Endpoint**: /api/overlays

**Method**: GET

**Description**: Retrieve all overlays stored in the IndexedDB.

Response:
```javascript
[
  {
    "id": 1,
    "position": { "x": 10, "y": 20 },
    "size": { "width": 100, "height": 100 },
    "content": "Your Text Here"
  },
  // ... other overlays
]
```
### Retrieve Single Overlay:

**Endpoint**: /api/overlays/:id

**Method**: GET

**Description**: Retrieve a single overlay by ID.

Response:
```javascript 
{
  "id": 1,
  "position": { "x": 10, "y": 20 },
  "size": { "width": 100, "height": 100 },
  "content": "Your Text Here"
}
```
### Create Overlay:

**Endpoint**: /api/overlays

**Method**: POST

**Description**: Create a new overlay in the IndexedDB.

Request Body:
```javascript
{
  "position": { "x": 30, "y": 40 },
  "size": { "width": 150, "height": 150 },
  "content": "New Text"
}
```
Response:
```javascript
{
  "id": 2,
  "position": { "x": 30, "y": 40 },
  "size": { "width": 150, "height": 150 },
  "content": "New Text"
}
```
### Update Overlay:

**Endpoint**: /api/overlays/:id

**Method**: PUT

**Description**: Update an existing overlay by ID.

Request Body:
```javascript
{
  "position": { "x": 50, "y": 60 },
  "size": { "width": 200, "height": 200 },
  "content": "Updated Text"
}
```
Response:
```javascript
{
  "id": 2,
  "position": { "x": 50, "y": 60 },
  "size": { "width": 200, "height": 200 },
  "content": "Updated Text"
}
```
### Delete Overlay:

**Endpoint**: /api/overlays/:id

**Method**: DELETE

**Description**: Delete an existing overlay by ID.

Response:
```javascript
{
  "message": "Overlay deleted successfully."
}
```