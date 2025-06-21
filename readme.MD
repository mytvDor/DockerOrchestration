# 🐳 Docker Container Manager API

This is a simple Express.js-based API that allows you to:

- List currently running Docker containers
- Pull an image and start a new container dynamically
- Auto-assign available ports from 8000–8999

---

## 📦 Tech Stack

- Node.js
- Express.js
- [dockerode](https://github.com/apocas/dockerode) (Docker SDK for Node.js)
- Docker

---

## 🚀 Features

- `GET /containers`: List all running containers
- `POST /containers`: Pull a Docker image and run a container on an available port (8000–8999)
- Internal mapping of ports to containers and vice versa

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js v14+
- Docker must be installed and running
- Internet access to pull images from Docker Hub

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server

```bash
node index.js
```

The API will be available on:
**[http://localhost:9000](http://localhost:9000)**

---

## 📘 API Reference

### 🔍 `GET /containers`

Returns a list of currently running Docker containers.

#### Example response:

```json
{
  "containers": [
    {
      "id": "0a1b2c3d4e5f",
      "names": ["/friendly_name"],
      "image": "nginx"
    }
  ]
}
```

---

### ▶️ `POST /containers`

Starts a container using the given Docker image and maps an available port (from 8000–8999) to port 80 inside the container.

#### Request body:

```json
{
  "image": "nginx"
}
```

#### Example response:

```json
{
  "container": "abcdef1234567890..."
}
```

If the image doesn't exist or fails to pull:

```json
{
  "error": "Image not found or failed to download"
}
```

---

## 🔌 Port Management

The server automatically scans ports from **8000 to 8999** and uses the first available one to map the container’s internal port `80`.

Port mappings are stored in-memory using:

```js
PORT_TO_CONTAINER = {
  8000: "container_id",
};

CONTAINER_TO_PORT = {
  container_id: 8000,
};
```
