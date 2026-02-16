# API Reference: Pair Drop 🔌

This document provides the technical specifications for the Pair Drop REST API and WebSocket events.

## 🌐 REST API

All endpoints are prefixed with `/api`.

### Sessions

#### **Create Session**
- **Method**: `POST`
- **Path**: `/api/sessions`
- **Response** (201):
  ```json
  {
    "id": 1,
    "code": "123456",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-02T00:00:00.000Z"
  }
  ```

#### **Get Session by Code**
- **Method**: `GET`
- **Path**: `/api/sessions/:code`
- **Response** (200): Session object.
- **Errors**: 404 if expired or not found.

---

### Items

#### **Get Items for Session**
- **Method**: `GET`
- **Path**: `/api/sessions/:code/items`
- **Response** (200): Array of shared items.

#### **Add Item to Session**
- **Method**: `POST`
- **Path**: `/api/sessions/:code/items`
- **Body**:
  ```json
  {
    "type": "text",
    "content": "Hello world!"
  }
  ```
  *OR for files:*
  ```json
  {
    "type": "file",
    "fileName": "document.pdf",
    "fileSize": 1024,
    "fileUrl": "..."
  }
  ```
- **Response** (201): Created item object.

---

## 🛰️ WebSocket API

Connections should be made to `/ws?code=:sessionCode`.

### Events Sent by Server

#### **`NEW_ITEM`**
Broadcasted when a new item (text or file) is added to the session.
- **Payload**: The created item object.

#### **`JOIN`** (Planned)
Sent when a new device joins the session.

#### **`ERROR`**
Sent if there is a connection or session error.

---

## 🛠️ Implementation Details

The API contract is shared between client and server via `shared/routes.ts`, ensuring strict type safety and consistent validation using **Zod**.

---

[Back to README](file:///m:/40.%20Go%20Lang%20Practice/Pair-Drop/readme.md)
