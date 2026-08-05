# MA Moments
### Scalable E-Commerce Deployment using Docker, Containerlab, Proxmox and zrok

## Project Overview

MA Moments is a modern e-commerce web application developed as a university networking project. The project demonstrates how a web application can be deployed using containerization and virtualization technologies while remaining accessible through a secure public URL.

The deployment combines Docker, Containerlab, Proxmox VE, Nginx, GitHub, and zrok to simulate a lightweight production environment.

---

## Project Objectives

- Deploy a real web application inside containers.
- Build a virtual network topology using Containerlab.
- Host the environment on Proxmox Virtual Environment.
- Publish the application securely using zrok.
- Manage the project using Git and GitHub.
- Demonstrate scalable deployment concepts for networking and cloud computing.

---

# Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Frontend |
| CSS3 | User Interface |
| JavaScript | Client-side Logic |
| Docker | Containerization |
| Docker Compose | Multi-container deployment |
| Containerlab | Virtual Network Topology |
| Proxmox VE | Virtualization Platform |
| Nginx | Web Server |
| zrok | Secure Public Access |
| Git | Version Control |
| GitHub | Source Code Repository |

---

# Network Topology

```
                    Internet
                        │
                   zrok Public URL
                        │
                Proxmox Virtual Machine
                        │
                 Containerlab Network
                        │
        ┌─────────────────────────────┐
        │                             │
        │                             │
 Client Container  ───────────►  Web Container
 (curl testing)                (Nginx + MA Moments)
```

The Client container is used to test connectivity while the Web container hosts the MA Moments application through Nginx.

---

# Deployment Architecture

```
User Browser
      │
      ▼
Public zrok URL
      │
      ▼
Proxmox Virtual Machine
      │
      ▼
Containerlab
      │
      ▼
Docker Container
      │
      ▼
Nginx Web Server
      │
      ▼
MA Moments Website
```

---

# Vendor Features

The project supports the concept of an online vendor platform.

Current implementation includes:

- Product management pages
- Category organization
- Shopping cart
- Wishlist
- Responsive interface

The architecture allows future integration of:

- Vendor Dashboard
- Authentication
- Backend APIs
- Database
- Inventory Management
- Orders
- Multi-vendor Support

---

# Public Access

The project is published using **zrok**.

Current Public URL:

```
https://3p6cxz9pi3zb.share.zrok.io
```

---

# Screenshots

## Home Page

> Add screenshot here

```
images/screenshots/homepage.png
```

---

## Containerlab Deployment

> Add deployment screenshot here

```
images/screenshots/containerlab.png
```

---

## Proxmox

> Add Proxmox screenshot here

```
images/screenshots/proxmox.png
```

---

## zrok Public Access

> Add zrok screegit add README.md
nshot here

```
images/screenshots/zrok.png
```

---

# Project Structure

```
MA_Moments
│
├── css/
├── images/
├── js/
├── docs/
│   ├── MA_Moments_Network_Deploy.docx
│   └── MA_Moments_Professional_Presentation.pptx
│
├── Dockerfile
├── compose.yaml
├── topology.clab.yml
├── index.html
├── products.html
├── cart.html
├── wishlist.html
├── admin.html
└── README.md
```

---

# How to Run

Clone the repository

```bash
git clone https://github.com/ayamaali2026/MA_Moments1.git
```

Go to the project

```bash
cd MA_Moments1
```

Build Docker image

```bash
docker build -t ma-moments .
```

Deploy the topology

```bash
containerlab deploy -t topology.clab.yml
```

Check running containers

```bash
docker ps
```

Expose the application

```bash
zrok share public http://localhost:8081
```

Open the generated zrok URL.

---

# Documentation

The complete documentation is available inside:

```
docs/
```

Including:

- Network Deployment Documentation
- Project Presentation

---

# Repository

GitHub:

https://github.com/ayamaali2026/MA_Moments1

---

# Author

**Aya Maali**

Computer Engineering Student

An-Najah National University

---

# Supervisor

**Dr. Jihad**

---

## Project Status

**Completed Successfully**

Docker ✔

Containerlab ✔

Proxmox ✔

Nginx ✔

GitHub ✔

zrok ✔

Documentation ✔

Presentation ✔