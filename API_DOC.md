# BioLink API Documentation

**Base URL:** `http://localhost:3000/api`
**Swagger UI:** `http://localhost:3000/docs`

All timestamps are returned as **Unix timestamps in seconds**.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Users / Profile](#2-users--profile)
3. [Links](#3-links)
4. [Public Profile](#4-public-profile)
5. [Error Responses](#5-error-responses)

---

## 1. Authentication

### POST `/api/auth/register`

Register a new user account.

**Request**

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "alice@example.com",
  "username": "alice",
  "password": "password123"
}
```

| Field      | Type     | Required | Rules                                 |
| ---------- | -------- | -------- | ------------------------------------- |
| `email`    | `string` | Yes      | Valid email                           |
| `username` | `string` | Yes      | 3-30 chars, alphanumeric + underscore |
| `password` | `string` | Yes      | Min 8 characters                      |

**Response `201 Created`**

```json
{
  "status": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "cmnmp97bj00006wotirhsjfic",
      "email": "alice@example.com",
      "username": "alice",
      "bio": null,
      "avatar": null,
      "createdAt": 1775450279,
      "updatedAt": 1775450279
    }
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error `409 Conflict`**

```json
{
  "message": "Email or username already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

---

### POST `/api/auth/login`

Authenticate and receive a JWT token.

**Request**

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

| Field      | Type     | Required |
| ---------- | -------- | -------- |
| `email`    | `string` | Yes      |
| `password` | `string` | Yes      |

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "cmnmp97bj00006wotirhsjfic",
      "email": "alice@example.com",
      "username": "alice",
      "bio": null,
      "avatar": null,
      "createdAt": 1775450279,
      "updatedAt": 1775450279
    }
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error `401 Unauthorized`**

```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

### GET `/api/auth/me`

Get the currently authenticated user.

**Request**

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response `200 OK`**

```json
{
  "status": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "cmnmp97bj00006wotirhsjfic",
      "email": "alice@example.com",
      "username": "alice",
      "bio": null,
      "avatar": null,
      "createdAt": 1775450279,
      "updatedAt": 1775450279
    }
  }
}
```

---

## 2. Users / Profile

> All endpoints require `Authorization: Bearer <access_token>`

### GET `/api/users/profile`

Get the authenticated user's profile.

**Request**

```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "cmnmp97bj00006wotirhsjfic",
      "email": "alice@example.com",
      "username": "alice",
      "bio": null,
      "avatar": null,
      "createdAt": 1775450279,
      "updatedAt": 1775450279
    }
  }
}
```

---

### PATCH `/api/users/profile`

Update the authenticated user's profile.

**Request**

```http
PATCH /api/users/profile
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "bio": "Hey! I make cool things.",
  "username": "alice_updated"
}
```

| Field      | Type     | Required | Rules                                 |
| ---------- | -------- | -------- | ------------------------------------- |
| `username` | `string` | No       | 3-30 chars, alphanumeric + underscore |
| `bio`      | `string` | No       | Max 300 characters                    |
| `avatar`   | `string` | No       | Public URL to avatar image            |

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "cmnmp97bj00006wotirhsjfic",
      "email": "alice@example.com",
      "username": "alice_updated",
      "bio": "Hey! I make cool things.",
      "avatar": null,
      "createdAt": 1775450279,
      "updatedAt": 1775450281
    }
  }
}
```

---

### POST `/api/users/avatar`

Upload an avatar image (multipart form data).

**Request**

```http
POST /api/users/avatar
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

| Field    | Type   | Required |
| -------- | ------ | -------- |
| `avatar` | `file` | Yes      |

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "user": {
      "id": "cmnmp97bj00006wotirhsjfic",
      "email": "alice@example.com",
      "username": "alice",
      "bio": null,
      "avatar": "/uploads/avatars/1775450300-123456789.png",
      "createdAt": 1775450279,
      "updatedAt": 1775450300
    }
  }
}
```

---

## 3. Links

> All endpoints require `Authorization: Bearer <access_token>`

### GET `/api/links`

List all links for the authenticated user, ordered by `order` ascending.

**Request**

```http
GET /api/links
Authorization: Bearer <access_token>
```

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Links retrieved successfully",
  "data": {
    "links": [
      {
        "id": "cmnmp99oy00016wotjji836iu",
        "title": "My Portfolio",
        "url": "https://alice.dev",
        "active": true,
        "order": 0,
        "startTime": null,
        "endTime": null,
        "createdAt": 1775450282,
        "updatedAt": 1775450282
      },
      {
        "id": "cmnmp9a6a00026wotelz8ifvx",
        "title": "My Blog",
        "url": "https://blog.alice.dev",
        "active": true,
        "order": 1,
        "startTime": 1748736000,
        "endTime": 1767225599,
        "createdAt": 1775450283,
        "updatedAt": 1775450283
      }
    ]
  }
}
```

---

### POST `/api/links`

Create a new link.

**Request**

```http
POST /api/links
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "title": "My Portfolio",
  "url": "https://alice.dev",
  "active": true,
  "order": 0,
  "startTime": "2025-06-01T00:00:00Z",
  "endTime": "2025-12-31T23:59:59Z"
}
```

| Field       | Type       | Required | Description                                |
| ----------- | ---------- | -------- | ------------------------------------------ |
| `title`     | `string`   | Yes      | Display title for the link                 |
| `url`       | `string`   | Yes      | Must be a valid URL                        |
| `active`    | `boolean`  | No       | Defaults to `true`                         |
| `order`     | `number`   | No       | Integer position; auto-assigned if omitted |
| `startTime` | `DateTime` | No       | ISO 8601 — link is hidden before this time |
| `endTime`   | `DateTime` | No       | ISO 8601 — link is hidden after this time  |

**Response `201 Created`**

```json
{
  "status": true,
  "message": "Link created successfully",
  "data": {
    "link": {
      "id": "cmnmp99oy00016wotjji836iu",
      "title": "My Portfolio",
      "url": "https://alice.dev",
      "active": true,
      "order": 0,
      "startTime": 1748736000,
      "endTime": 1767225599,
      "createdAt": 1775450282,
      "updatedAt": 1775450282
    }
  }
}
```

---

### GET `/api/links/:id`

Get a single link by ID.

**Request**

```http
GET /api/links/cmnmp99oy00016wotjji836iu
Authorization: Bearer <access_token>
```

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Link retrieved successfully",
  "data": {
    "link": {
      "id": "cmnmp99oy00016wotjji836iu",
      "title": "My Portfolio",
      "url": "https://alice.dev",
      "active": true,
      "order": 0,
      "startTime": null,
      "endTime": null,
      "createdAt": 1775450282,
      "updatedAt": 1775450282
    }
  }
}
```

**Error `404 Not Found`**

```json
{
  "message": "Link not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### PATCH `/api/links/:id`

Update link fields. All fields are optional.

**Request**

```http
PATCH /api/links/cmnmp99oy00016wotjji836iu
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "title": "Updated Portfolio"
}
```

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Link updated successfully",
  "data": {
    "link": {
      "id": "cmnmp99oy00016wotjji836iu",
      "title": "Updated Portfolio",
      "url": "https://alice.dev",
      "active": true,
      "order": 0,
      "startTime": null,
      "endTime": null,
      "createdAt": 1775450282,
      "updatedAt": 1775450285
    }
  }
}
```

---

### DELETE `/api/links/:id`

Delete a link permanently.

**Request**

```http
DELETE /api/links/cmnmp99oy00016wotjji836iu
Authorization: Bearer <access_token>
```

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Link deleted successfully"
}
```

---

### PATCH `/api/links/:id/toggle`

Toggle a link's active/inactive status.

**Request**

```http
PATCH /api/links/cmnmp99oy00016wotjji836iu/toggle
Authorization: Bearer <access_token>
```

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Link toggled successfully",
  "data": {
    "link": {
      "id": "cmnmp99oy00016wotjji836iu",
      "title": "My Portfolio",
      "url": "https://alice.dev",
      "active": false,
      "order": 0,
      "startTime": null,
      "endTime": null,
      "createdAt": 1775450282,
      "updatedAt": 1775450285
    }
  }
}
```

---

### PATCH `/api/links/reorder`

Update the sort order of all links.

**Request**

```http
PATCH /api/links/reorder
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "links": [
    { "id": "cmnmp99oy00016wotjji836iu", "order": 1 },
    { "id": "cmnmp9a6a00026wotelz8ifvx", "order": 0 }
  ]
}
```

| Field   | Type                                 | Required |
| ------- | ------------------------------------ | -------- |
| `links` | `Array<{id: string, order: number}>` | Yes      |

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Links reordered successfully"
}
```

---

## 4. Public Profile

> No authentication required.

### GET `/api/public/:username`

Fetch a public profile with filtered active links. Only links where `active = true` and within the `startTime`/`endTime` window are returned.

**Request**

```http
GET /api/public/alice
```

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Public profile retrieved successfully",
  "data": {
    "profile": {
      "username": "alice",
      "bio": "Hey! I make cool things.",
      "avatar": null,
      "links": [
        {
          "id": "cmnmp9a6a00026wotelz8ifvx",
          "title": "My Blog",
          "url": "https://blog.alice.dev",
          "order": 0
        }
      ]
    }
  }
}
```

**Error `404 Not Found`**

```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## 5. Error Responses

### Standard Error Shape

```json
{
  "message": "Error description",
  "error": "Error Type",
  "statusCode": 400
}
```

### Common Error Codes

| Status | Name           | When                                       |
| ------ | -------------- | ------------------------------------------ |
| `400`  | Bad Request    | Validation failed (class-validator)        |
| `401`  | Unauthorized   | Missing or invalid JWT token               |
| `403`  | Forbidden      | Authenticated but not resource owner       |
| `404`  | Not Found      | Resource (user / link) does not exist      |
| `409`  | Conflict       | Duplicate email or username on register    |
| `422`  | Unprocessable  | Manual validation error                    |
| `500`  | Internal Error | Unexpected server error                    |

### Validation Error (400)

```json
{
  "message": ["email must be an email", "password must be longer than or equal to 8 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Unauthorized (401)

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```
