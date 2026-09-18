# NMSight

### AI-Powered Campus Safety & Intelligence Platform

**See. Detect. Respond.**

NMSight is an AI-powered campus safety platform that combines **edge AI, computer vision, drone-based monitoring, real-time event processing, and an interactive security dashboard** to help campuses detect and respond to potentially unsafe situations.

The system uses a **Raspberry Pi 5 with a camera** to process live or prerecorded video at the edge. Computer vision models detect people, vehicles, bicycles, crowds, and other relevant objects. These detections are evaluated against campus-specific business rules to identify safety incidents.

Instead of continuously transmitting raw video to the cloud, NMSight is designed around **edge processing**, reducing cloud dependency, bandwidth requirements, and response latency.

---

# 🚨 Problem

Traditional campus security systems often depend on:

* Manual CCTV monitoring
* Security personnel continuously watching multiple camera feeds
* Delayed incident identification
* Limited real-time situational awareness
* Separate systems for surveillance, incidents, and analytics
* High infrastructure and cloud-processing costs

A security operator may have access to hundreds of cameras but cannot continuously monitor every feed with equal attention.

NMSight addresses this by adding an **AI-powered monitoring layer** that automatically identifies potentially important events and brings them to the security operator's attention.

---

# 💡 Solution

NMSight transforms raw camera footage into actionable safety intelligence.

```text
Camera / Video
       ↓
Raspberry Pi 5
       ↓
Computer Vision
       ↓
Object Detection & Tracking
       ↓
Campus Safety Rules
       ↓
Incident / Alert Generation
       ↓
FastAPI Backend
       ↓
WebSocket / REST APIs
       ↓
React Security Dashboard
       ↓
Security Response
```

The system does not treat every detection as an emergency.

For example:

> A person detected on campus at 6 PM may be completely normal.

But:

> A person detected in an academic quad at 2 AM may trigger a high-priority curfew alert.

This combination of **AI detection + contextual business rules** is a key part of NMSight.

---

# 🎯 USP — Unique Selling Proposition

NMSight's primary differentiator is the combination of **edge AI + contextual campus safety intelligence + real-time visualization**.

### 1. Edge AI First

The Raspberry Pi 5 performs computer vision processing locally.

This enables:

* Lower latency
* Reduced bandwidth requirements
* Reduced cloud dependency
* Potentially lower infrastructure costs
* Operation in environments with limited connectivity

---

### 2. Detection → Context → Action

NMSight does not simply detect objects.

It interprets detections based on:

* Time
* Location
* Campus zone
* Object type
* Crowd size
* Duration
* Movement patterns
* Restricted areas

The system converts:

**"Person detected"**

into potentially meaningful events such as:

**"After-hours presence detected in restricted zone."**

---

### 3. Real-Time Security Operations

Security operators receive actionable information through a centralized dashboard.

The interface provides:

* Live campus map
* Active alerts
* Incident locations
* AI detection activity
* Drone telemetry
* Traffic counts
* System health
* Incident response actions

---

### 4. Low-Cost Deployment

By using Raspberry Pi-based edge processing, NMSight is designed as a relatively low-cost alternative to systems requiring continuous centralized video processing infrastructure.

The same architecture can potentially be deployed across:

* Universities
* Schools
* Corporate campuses
* Industrial campuses
* Residential communities
* Smart-city environments

---

# 🖥️ UI / UX

NMSight is designed as a **Security Operations Center (SOC)** rather than a conventional analytics dashboard.

The UI prioritizes information according to operational importance.

### Security Operator View

The security dashboard focuses on:

```text
                 SECURITY OPERATIONS
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
     Live Map        Active Alerts     Incidents
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                   Response Actions
```

### Key UI components

* Live campus map
* Severity-based alert markers
* Active alert panel
* Incident detail drawer
* AI detection feed
* Live pedestrian/vehicle counts
* Drone status
* Raspberry Pi health
* Incident timeline

### Severity hierarchy

| Severity      | Meaning                           |
| ------------- | --------------------------------- |
| 🔴 Critical   | Immediate security attention      |
| 🟠 High       | Significant safety concern        |
| 🟡 Medium     | Requires monitoring/investigation |
| 🔵 Low / Info | Informational event               |
| 🟢 Normal     | No active safety concern          |

The interface uses color, icons, text labels, and status indicators together so that alerts are not communicated through color alone.

---

# 👥 Role-Based Access

NMSight uses role-based access.

## Security Operator

The Security Operator is focused on real-time operations.

Access includes:

* Security Dashboard
* Live Campus Map
* Active Alerts
* Incidents
* Drone Monitoring
* AI Detection
* Traffic Monitoring
* Response Actions

## Administrator

The Administrator focuses on long-term campus intelligence.

Access will include:

* Analytics
* Historical Incidents
* Safety Trends
* Campus Zones
* Business Rules
* Reports
* System Overview

Authentication is handled through the common login system, while the backend determines the user's role.

---

# 🚨 Campus Safety Scenarios & Business Rules

NMSight uses contextual rules to convert AI detections into actionable alerts.

| Scenario                   | Trigger                                                              | Severity | Automated Action                                          |
| -------------------------- | -------------------------------------------------------------------- | -------- | --------------------------------------------------------- |
| Curfew & Presence          | Person detected in Academic Quad / Sports Complex between 12 AM–5 AM | High     | Alert SOC, focus camera/drone, log GPS                    |
| Perimeter Breach           | Person/motion within 5m of campus boundary                           | Critical | Alert control room, mark boundary sector, dispatch patrol |
| Rooftop Trespassing        | Human detected on rooftop/terrace/construction zone                  | Critical | Immediate alert, start high-definition recording          |
| Crowd Disturbance          | >8 people rapidly forming after hours / abnormal movement            | High     | Focus drone, illuminate area, dispatch patrol             |
| Distress / Fall            | Person remains prone/horizontal for >30 seconds                      | High     | Alert first responder/medical unit                        |
| Vehicle in Pedestrian Zone | Vehicle detected in restricted walkway                               | Medium   | Log timestamp/direction, notify gatekeeper                |
| Abandoned Object           | Object remains stationary >15 minutes without nearby person          | Medium   | Create investigation ticket, capture zoomed evidence      |

The rule engine can be expanded with additional campus-specific conditions.

---

# 🏗️ Architecture

NMSight follows an edge-to-cloud/application architecture.

```text
                     ┌──────────────────┐
                     │   Camera / Video │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Raspberry Pi 5  │
                     │                  │
                     │ Object Detection │
                     │ Object Tracking  │
                     │ Local Processing │
                     └────────┬─────────┘
                              │
                       Detection Events
                              │
                              ▼
                     ┌──────────────────┐
                     │  FastAPI Backend │
                     │                  │
                     │ Authentication   │
                     │ Rule Engine      │
                     │ Alert Management │
                     │ Incident Mgmt    │
                     │ Analytics        │
                     └───────┬───┬──────┘
                             │   │
                  REST API   │   │ WebSocket
                             │   │
                             ▼   ▼
                    ┌──────────────────┐
                    │ React Frontend   │
                    │                  │
                    │ Security SOC     │
                    │ Live Map         │
                    │ Alerts           │
                    │ Analytics        │
                    │ Drone Monitoring │
                    └──────────────────┘
```

### Edge Layer

Responsible for:

* Video ingestion
* Object detection
* Object tracking
* Counting
* Local preprocessing
* Event generation

### Backend Layer

Responsible for:

* Authentication
* Business rules
* Alert generation
* Incident management
* Data persistence
* REST APIs
* WebSocket event broadcasting

### Frontend Layer

Responsible for:

* Visualization
* Live map
* Alerts
* Incident response
* Analytics
* Drone monitoring
* System status

---

# 🤖 Machine Learning

NMSight uses computer vision at the edge to analyze video streams.

The ML pipeline is designed around:

```text
Video Frame
     ↓
Preprocessing
     ↓
Object Detection
     ↓
Object Tracking
     ↓
Class Identification
     ↓
Confidence Filtering
     ↓
Spatial / Temporal Context
     ↓
Business Rule Engine
     ↓
Alert / Normal Event
```

### Detection Classes

The initial system focuses on:

* Person
* Car
* Motorcycle
* Bicycle
* Relevant abandoned objects

The model can be extended to additional classes depending on the deployment environment and dataset.

---

# 📊 Dataset Utilization

The project uses image/video datasets appropriate for object detection and safety-related computer vision tasks.

Dataset utilization includes:

### Object Detection

Training/evaluation data is used to identify:

* Pedestrians
* Cars
* Bikes
* Motorcycles
* Relevant objects

### Video Simulation

For development and testing, prerecorded video can be provided to the Raspberry Pi pipeline in place of a live drone feed.

This allows the complete pipeline to be tested without requiring continuous drone deployment.

```text
Dataset / Video
      ↓
Frame Extraction
      ↓
Raspberry Pi
      ↓
Model Inference
      ↓
Detection Events
      ↓
Rule Engine
      ↓
Dashboard
```

### Traffic Intelligence

Detected objects are also used for:

* Pedestrian counting
* Vehicle counting
* Bicycle counting
* Crowd estimation
* Traffic density analysis
* Peak congestion identification

The resulting data can be aggregated over time and visualized through:

* Count charts
* Density heatmaps
* Zone-level statistics
* Peak-time analysis

---

# 📡 Real-Time Communication

NMSight is designed to use **WebSockets** for real-time dashboard updates.

The future communication flow is:

```text
Raspberry Pi
     ↓
FastAPI
     ↓
WebSocket
     ↓
React
```

For example, when the edge device detects a curfew violation:

```json
{
  "type": "NEW_ALERT",
  "severity": "HIGH",
  "event": "CURFEW_VIOLATION",
  "zone": "Academic Quad",
  "latitude": 12.9716,
  "longitude": 79.1592,
  "confidence": 0.94
}
```

The React dashboard can then:

* Add an alert marker to the map
* Update the active alert count
* Display a notification
* Add the event to the activity feed
* Open an incident workflow

This enables the dashboard to behave as a real-time security command center.

---

# 🚁 Drone Integration

The drone acts as a mobile visual sensing platform.

The drone-mounted camera can provide video to the Raspberry Pi 5.

The system can eventually expose drone telemetry such as:

* GPS location
* Battery
* Altitude
* Camera status
* Flight status
* AI inference FPS
* Processing latency

When an alert occurs, the system can provide contextual instructions such as:

**Focus camera on incident location**

or:

**Investigate perimeter sector**

Actual autonomous flight/control capabilities can be added as the project evolves.

---

# 🚗 Traffic & Crowd Intelligence

Beyond security alerts, NMSight can function as an edge-AI traffic monitoring system.

The Raspberry Pi can count:

```text
Pedestrians
Cars
Motorcycles
Bicycles
```

Counts can be aggregated by:

* Time
* Zone
* Day
* Hour
* Event period

The analytics layer can identify:

* Peak congestion times
* High-density campus zones
* Pedestrian traffic patterns
* Vehicle activity
* Crowd formation

This creates an additional smart-campus use case beyond security.

---

# 📈 Scalability & Feasibility

NMSight is designed with scalability in mind.

## Horizontal Edge Scaling

Multiple Raspberry Pi devices can be deployed across different campus zones.

```text
                 FastAPI Backend
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Raspberry Pi 1  Raspberry Pi 2  Raspberry Pi 3
        │              │              │
     Camera         Camera         Camera
```

Each device can monitor a different zone.

Examples:

* Main Gate
* Hostel Area
* Sports Complex
* Academic Zone
* Parking Area

---

## Backend Scalability

FastAPI provides an API-oriented architecture that can be expanded with:

* Multiple backend instances
* Load balancing
* Database scaling
* Message queues
* Event processing services
* Authentication services

The WebSocket layer can distribute real-time events to multiple security operators.

---

## Cost Feasibility

Using Raspberry Pi-based edge processing reduces the need to continuously stream all camera footage to centralized cloud infrastructure.

The architecture can therefore be suitable for:

* Small campuses
* Universities
* Schools
* Corporate campuses
* Smart-city pilot deployments

---

## Deployment Feasibility

The system can initially operate using:

**One Raspberry Pi + One Camera + One Backend + One Dashboard**

It can then scale to:

**Multiple Raspberry Pis + Multiple Cameras + Central FastAPI Infrastructure + Multiple Security Operators**

This allows NMSight to be demonstrated as a working prototype while retaining a realistic path toward larger deployments.

---

# 🛠️ Implementation

The implementation is divided into several layers.

## 1. Frontend

The React application provides:

* Login
* Role-based navigation
* Security dashboard
* Live map
* Alert visualization
* Incident interface
* Analytics
* Drone status
* AI activity

The interface is built with a dark Security Operations Center design.

---

## 2. Backend

FastAPI will provide:

* Authentication APIs
* Detection APIs
* Alert APIs
* Incident APIs
* Analytics APIs
* Zone APIs
* Rule APIs
* Drone status APIs
* WebSocket endpoints

Example API structure:

```text
POST /api/auth/login

GET /api/alerts
GET /api/incidents
GET /api/detections
GET /api/zones
GET /api/analytics
GET /api/drone/status

WebSocket:
WS /ws/alerts
```

---

## 3. Edge AI

The Raspberry Pi 5 handles:

* Camera/video input
* Frame processing
* Object detection
* Object tracking
* Object counting
* Local event generation

The system is designed to minimize unnecessary transmission of raw video.

---

## 4. Rule Engine

Detection events are evaluated using contextual conditions.

Example:

```text
Detection:
Person

Location:
Academic Quad

Time:
02:13 AM

Rule:
Academic Quad + Person + 12 AM–5 AM

Result:
HIGH ALERT
```

---

## 5. Alert Management

Every alert can contain:

* Alert ID
* Detection type
* Severity
* Timestamp
* Location
* GPS coordinates
* Confidence
* Triggered rule
* Evidence frame
* Status
* Response action

Alert lifecycle:

```text
DETECTED
   ↓
ACTIVE
   ↓
ACKNOWLEDGED
   ↓
DISPATCHED
   ↓
RESOLVED
```

---

# 📍 Data Shown on the Security Dashboard

The Security Operations dashboard will provide a centralized view of:

### Live Campus

* Campus map
* Zones
* Camera locations
* Drone location
* Active incident locations

### Safety

* Active alerts
* Critical incidents
* Alert severity
* Incident status
* Response status

### AI

* Current people count
* Vehicle count
* Bicycle count
* Detection confidence
* AI inference FPS
* Processing latency

### Drone

* Battery
* GPS
* Altitude
* Camera status

### Edge Device

* Raspberry Pi CPU
* RAM
* Temperature
* Model status
* Inference performance

---

# 📊 Analytics

Historical data will eventually support:

* Alerts over time
* Incidents by zone
* Peak congestion periods
* Pedestrian counts
* Vehicle counts
* Crowd activity
* Safety heatmaps
* Response times
* Frequently triggered safety rules

This allows campus administrators to move beyond individual incidents and understand broader campus activity patterns.

---

# 🔐 Privacy & Security Considerations

NMSight is designed around responsible deployment of computer vision.

Potential safeguards include:

* Edge processing where possible
* Minimizing unnecessary raw-video transmission
* Role-based dashboard access
* Authentication
* Controlled access to incident evidence
* Event-based data storage
* Configurable data retention policies

The system should be deployed according to applicable institutional policies and privacy regulations.

---


# 🧰 Tech Stack

## Frontend

* **React**
* **JavaScript / JSX**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide React**
* Interactive mapping library

## Backend

* **Python**
* **FastAPI**
* REST APIs
* WebSockets

## Edge Computing

* **Raspberry Pi 5**
* Camera / Webcam
* Python
* Local inference

## Machine Learning

* Object Detection
* Object Tracking
* Computer Vision
* YOLO-based detection pipeline
* Confidence-based filtering
* Object counting

## Data & Storage

Planned:

* Relational / NoSQL database depending on deployment requirements
* Alert records
* Incident records
* Detection events
* Zone information
* Analytics data

## Deployment

Potential deployment architecture:

* Vercel / frontend hosting
* FastAPI backend server
* Raspberry Pi edge devices
* Campus network
* Optional cloud infrastructure for centralized services

---

# 🧪 Demonstration Workflow

A typical NMSight demonstration can follow this workflow:

```text
1. Start video/webcam
          ↓
2. Raspberry Pi receives frames
          ↓
3. AI detects person
          ↓
4. Object is tracked
          ↓
5. Context is evaluated
          ↓
6. Business rule is triggered
          ↓
7. FastAPI receives event
          ↓
8. Alert is generated
          ↓
9. WebSocket sends event
          ↓
10. React dashboard updates
          ↓
11. Alert appears on map
          ↓
12. Security operator responds
```

For example:

```text
02:13 AM
     ↓
Person detected
     ↓
Academic Quad
     ↓
Curfew Rule
     ↓
HIGH ALERT
     ↓
📍 Map marker
     ↓
🚨 Security notification
     ↓
Security response
```

This demonstrates the complete **AI → Edge → Backend → Real-Time Dashboard → Human Response** pipeline.

---

# 🌍 Future Scope

NMSight can evolve beyond campus safety into a broader **edge-AI situational intelligence platform**.

Potential applications include:

* Smart campuses
* Smart cities
* Industrial facilities
* Corporate campuses
* Public spaces
* Residential communities
* Event security
* Traffic monitoring

Future AI capabilities could include:

* Advanced anomaly detection
* Multi-camera tracking
* Behavioral pattern analysis
* Predictive congestion analysis
* Automated incident summarization
* Natural-language security reports
* Privacy-preserving computer vision
* Multi-drone coordination

---

# 👩‍💻 Team

### NMSight

**Navya • Melwin • Sunidhi**

Built as an AI-powered campus safety and intelligence platform combining:

**Edge AI + Computer Vision + Real-Time Systems + Campus Intelligence**

---

# ⭐ Vision

NMSight aims to move campus security from:

> **Passive monitoring**

to:

> **Proactive, AI-assisted situational awareness.**

The goal is not to replace security personnel, but to give them the right information at the right time so that human operators can make faster and better-informed decisions.

**NMSight — See. Detect. Respond.**
