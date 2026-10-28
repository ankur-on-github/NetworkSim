# NetworkSim: Real-Time Distributed Systems Simulation & Resilience Engineering Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React Flow](https://img.shields.io/badge/@xyflow/react-12.10-ff0072)](https://reactflow.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)]()

An interactive, browser-based distributed systems simulator and chaos engineering platform for designing, visualizing, and stress-testing cloud microservice architectures in real time.

---

## 1. Project Overview

**NetworkSim** is an interactive, browser-based distributed systems simulator and chaos engineering platform designed for software architecture education. Traditional teaching of distributed systems relies on static slide diagrams, hiding dynamic phenomena such as cascading failures, backpressure propagation, and throughput bottlenecks.

NetworkSim bridges the gap between static diagramming and low-level packet emulation (like NS-3 or Mininet) by modeling Layer-7 microservice interactions, dynamic M/M/1 queuing physics, and automated root-cause failure diagnostics—all without requiring paid cloud infrastructure.

---

## 2. Key Features

- **Interactive Architecture Canvas:** Drag-and-drop workspace powered by React Flow (`@xyflow/react`) supporting 11 distinct infrastructure node types (Client, DNS, CDN, WAF, API Gateway, Load Balancer, API Server, Queue, Microservice, Database, Cache).
- **Real-Time Physics Engine:** Python FastAPI simulation engine executing Directed Acyclic Graph (DAG) topological sorting and non-linear M/M/1 queue calculations at 20 Hz ticks.
- **Dynamic Latency Degradation:** Dynamic latency penalties calculated via $L = L_{\text{base}} + 0.5 \times Q$, accurately modeling backpressure.
- **Autonomous Chaos Daemon:** Background stochastic fault injector terminating random node instances every 15 simulation ticks to test failover and resilience.
- **Deterministic Fault Scheduler:** Ability to schedule targeted crashes and synthetic traffic spikes at specific time ticks.
- **Post-Simulation Diagnostic Inference:** Automated root-cause analyzer (`POST /analyze`) that inspects multi-node telemetry and emits prescriptive remediation guidelines.
- **Gamified AWS Cost Configurator:** Real-time operational cost estimator calculating dynamic monthly cloud expenditure based on node capacities and provisioned instances.
- **Blueprint Lifecycle:** One-click JSON import/export and a pre-configured template library (E-Commerce Store, Microservices Pipeline, Event-Driven Broker).

---

## 3. System Architecture

NetworkSim adopts a decoupled 3-tier architecture:

```
+-------------------------------------------------------------+
|                      Presentation Tier                      |
|       Next.js 16 + React Flow v12 + Recharts + Zustand      |
+-------------------------------------------------------------+
                               |  ^
              REST (HTTP/1.1)  |  |  WebSocket (20 Hz Stream)
                               v  |
+-------------------------------------------------------------+
|                     Application Logic Tier                  |
|          FastAPI + NetworkX (DiGraph Physics Engine)        |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                     Infrastructure Tier                     |
|                 Docker Compose Orchestration                |
+-------------------------------------------------------------+
```

---

## 4. Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **Docker & Docker Compose** (Optional, for containerized run)

---

### Method A: One-Click Launch (Windows)

Simply double-click or run the provided batch script in the root directory:
```cmd
start_lab.bat
```
This automatically sets up both Python and Node.js environments and starts the services simultaneously.

---

### Method B: Manual Local Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/ankur-on-github/NetworkSim.git
cd NetworkSim
```

#### 2. Backend Setup (FastAPI)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server (port 8000)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend API Docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs)*

#### 3. Frontend Setup (Next.js)
Open a new terminal window in the project root:
```bash
# Install NPM dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Method C: Docker Compose Setup

Run the entire multi-container environment with a single command:
```bash
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)

---

## 5. Environment Variables Setup

Create a `.env.local` file in the root directory (or use default fallbacks):

```env
# Frontend Environment Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/simulate

# Backend Environment Configuration
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000
```
*(No sensitive API keys or private credentials are required for local simulation execution.)*

---

## 6. Key API Endpoints Reference

| Method | Endpoint | Protocol | Description |
|:---|:---|:---|:---|
| `GET` | `/` | HTTP/1.1 | Health check and engine status verification |
| `GET` | `/templates` | HTTP/1.1 | Retrieves pre-configured topology blueprint templates |
| `POST` | `/simulate` | HTTP/1.1 | Full batch simulation execution returning 60-tick history |
| `POST` | `/analyze` | HTTP/1.1 | Diagnostic inference module generating root-cause narratives |
| `WS` | `/ws/simulate` | WebSocket | Real-time streaming simulation at 20 Hz (50 ms intervals) |

---

## 7. Project Architecture & Directory Structure

```
NetworkSim/
├── app/                          # Next.js 16 App Router (pages, layout, global styling)
├── backend/                      # FastAPI Python backend
│   ├── app/
│   │   ├── simulation/           # Physics engine (M/M/1 queues, DAG) & diagnostic analyzer
│   │   ├── main.py               # REST API & real-time WebSocket endpoints
│   │   ├── models.py             # Pydantic telemetry & topology schemas
│   │   └── templates.py          # Pre-configured production system blueprints
│   ├── Dockerfile                # Backend containerization definition
│   └── requirements.txt          # Python runtime dependencies
├── components/                   # Modular React UI components
│   ├── canvas/LabCanvas.tsx      # Interactive drag-and-drop React Flow canvas
│   ├── nodes/CustomNodes.tsx     # 11 distinct infrastructure node type renderers
│   └── panels/                   # Telemetry analytics, live console, and cost modals
├── lib/store.ts                  # Zustand reactive client-side state store
├── public/                       # Static UI assets and icons
├── docker-compose.yml            # Multi-container orchestration specification
├── start_lab.bat                 # One-click Windows developer launch script
├── package.json                  # Next.js and frontend dependencies
├── LICENSE                       # MIT Open Source License
└── README.md                     # Comprehensive documentation
```

---

## 8. Author & Maintenance

Developed and maintained by **[Ankur Yadav](https://github.com/ankur-on-github)**.

---

## 9. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
