# NetworkSim: A Real-Time Distributed Systems Simulation and Failure Analysis Platform for Architectural Education and Resilience Engineering

**Ankur Yadav (24BCE1836)**  
*School of Computer Science and Engineering, Vellore Institute of Technology, Chennai, India*  
`ankur.yadav2024@vitstudent.ac.in`  

> **Abstract.** Traditional teaching methods have their limitations. The complex nature of cloud and microservice systems can lead to failure cascades that are difficult to predict, as well as bottelneck systems and backpressure. Developing an entire system in order to test it for these failure points is costly and takes up valuable time. NetworkSim offers a way to teach distributed systems design through building failure resiliency in systems and verifying their design without the need for infrastructure. The tool is web based, and includes Next.js, FastAPI, and NetworkX in its core design. Using a browser as a client allows users to manipulate the nodes, which represent parts of the distributed system, and observes failure states in real time. For this submission, a Review 2 of a core implementation is offered that is fully functional. This tool simulates traffic movement along DAGs. The engine models traffic propagation using an M/M/1 queing system, but unlike static simulations, uses a model where latency degrades as the network becomes more congested. To introduce a simulation that more closely reflects real world operating conditions, the Chaos Daemon fails a node in the graph every 15 simulation steps. Traffic propagation becomes congested, as would happen in a real network, after the failure. When the simulation finishes, the analyzer uses the failure data to determine the traffic flow and the congestion at each node, classifies the traffic failures, and makes recommendations to repair the topology to prevent such failures in the future. To prove this system works as advertised, the system are used to perform traffic propagation on an 8 node topology simulating a real world online store. As the topology fails and recovers, the simulation adapts, and live estimated AWS cost of the topology is reported. This system will be a useful pedagogical tool to assist students in understanding the dynamic, real-time aspects of network system design.
> 
> **Keywords:** Distributed Systems Simulation, Fault Injection, Chaos Engineering, M/M/1 Queuing, Resilience Engineering, Telemetry Streaming, Architectural Education.

## 1 Introduction

### 1.1 Background and Motivation

Many software engineers have now adopted microservices and other distributed architectural styles [1]. These styles offer some benefits, but also present complex challenges. Cascading failures, backpressure, and network partitoning are just a few of these operational hazards [2]. When software architects are taught to design software through the use of diagrams and slides, they miss out on how to deal with throughput bottlenecks. It is nearly impossible for engineers to observe how the effects of throughput bottelnecks can ripple across a series of services in real-time.

### 1.2 Problem Statement

Simulators designed for higher network layers usually overlook the realities of lower layer complexities and thus result in unrealistic models of networks for higher layers. Packet level simulators such as NS-3 and Mininet take longer to learn and requires heavy compilation to run. However, they allow the user to easily set up higher level network application topologies. The simulation environments in cloud testbeds and chaos engineering platforms require infrastructure to run and are chargeable by the hour and therefore costly. These tools provide dynamic simulation but lack behavioral analysis. Static drawing tools such as Lucidchart or Draw.io help to visualize the topology but don’t allow the user to dynamically run simulations of the network to view changes.

### 1.3 Proposed Solution

NetworkSim closes the gap between theory and practice by offering an easy-to-use browser-based environment for modeling and testing systems. Simulation paramaters are controlled via a visual interface with an interactive graph on which to drag-and-drop service blocks and define system topologies (requests per second, service capacity, base latency, etc.). After clicking a start button, the discrete-event simulations run in the user's browser, streaming updates to the live view using WebSockets. System health status is presented by color-coded service badges. Visual queues and charts (also updating in real time) provide more context for the simulation.

### 1.4 Scope and Review 2 Objectives

Review 2 of the core software are 100% complete, including all functional requirements, and all code is experimentally validated. Delivery includes the physics engine, WebSocket communications, the deterministic fault injector, Chaos Daemon, automated root cause analysis, an automated estimator of AWS costs, serializing blueprint data, and a deployment across multiple containers.

## 2 Literature Survey and Related Work

### 2.1 Network and Distributed System Simulators

GNS3, Cisco Packet Tracer and Mininet provide emulation for switches and routers and simulate packet traffic for IP networks. Although, these systems don't meet the need for high-level modeling of distributed service interaction because they focus too heavily on the framing, ARP resolution and routing layers.

### 2.2 Discrete-Event Simulation Frameworks

Discrete event simulation environments, such as Python SimPy and OMNeT++, are capable of constructing and simulating a queuing system. However, in each of those systems, scripting and a lack of graphical modeling capabilties means the system cannot easily meet the real-time requirements of an operational environment, particularly for non-technical users.

### 2.3 Chaos Engineering Tools

Although the Chaos Monkey and ChaosMesh [5] tools are common in the industry, their usage in a classroom setting is restricted by the need for active production systems and a high reliance on Kubernetes and Amazon EC2 infrastrucure. Therefore, for risk-free experimentation, they cannot be used.

### 2.4 Architecture Diagramming Tools

Cloudcraft, Lucidchart and Draw.io are all designed to do a good job of structural export and static visualization, however they provides zero capabilities to verify models, show queing latency or the ability to propagate failures.

### 2.5 Positioning of NetworkSim

As illustrated in Table 1, NetworkSim provides integrated support for intuitive visual diagramming and interactive discrete-event simulation with automated root-cause analysis for educational computing, a combination that have not been supported by existing software.

**Table 1.** Feature comparison of NetworkSim against related systems

| System | Abstraction | Real-Time UI | Chaos Injection | Cost Modeling | Educational Focus |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GNS3 / Packet Tracer** | L2–L4 Network | Medium (Desktop) | Manual Link Drop | No | Networking Curricula |
| **Mininet** | OpenFlow / Linux Net | Low (CLI/Python) | Scripted | No | SDN Research |
| **SimPy** | Code-Defined Queues | None (Headless) | Programmable | No | Operations Research |
| **Chaos Monkey / Gremlin** | Cloud Infrastructure | Dashboard Only | Automated / Cloud | No | Enterprise SRE |
| **Draw.io / Lucidchart** | Visual Static | High (Web) | No | No | General Diagramming |
| **NetworkSim (Ours)** | L7 Service Nodes | High (Web / WS) | Deterministic + Chaos | Yes (AWS Est.) | System Design & Arch. |

## 3 System Architecture and Methodology

### 3.1 High-Level System Architecture

NetworkSim uses a cloud-native, decoupled, 3-tier architecture. Next.js 16 and React Flow v12 with Tailwind CSS make up the Presentation Layer. The Application Layer are made up of a high-speed Python 3.10 FastAPI asynchronus server and directed graph models created with NetworkX. A Redis cache can be added to store session and template data.

![Fig. 1. High-level system architecture of NetworkSim](../Diagrams/png_opt/fig1_arch.png)

### 3.2 Data Flow Diagrams

Figure 2 contains the Level-1 Data Flow Diagram. A user first constructs the simulation’s topology, which is a graph (V,E), on the interface. A ‘Run Simulation’ event will send G in JSON over a WebSocket connection to /ws/simulate. The simulation’s execution engine then uses G to construct a dependency order of the network devices. In each of the simulation’s 20Hz ticks, traffic flows will be determined, queus for packets will be calculated, failures that will impact network conditions will be determined, and a status message will be sent. Finally, history telemetry will be sent to the Diagnostic Analyzer for post simulation analysis.

![Fig. 2. Level-1 Data Flow Diagram for NetworkSim simulation pipeline](../Diagrams/png_opt/fig2_dfd.png)

### 3.3 Module Breakdown

The platform is partitioned into modular, highly cohesive software unit:

* **LabCanvas (`components/canvas/LabCanvas.tsx`):** Interactive drag-and-drop workspace supporting custom node types, connection edge validations, and viewport scaling.
* **CustomNodes (`components/nodes/CustomNodes.tsx`):** Renderers for 11 node types with animated status rings, capacity bars, and live throughput badges.
* **Zustand Store (`lib/store.ts`):** Client-side reactive state container managing nodes[], edges[], and the unit cost matrix.
* **FastAPI Application (`backend/app/main.py`):** High-performance asynchronous API layer exposing REST and WebSocket endpoints.
* **Simulation Engine (`backend/app/simulation/engine.py`):** Core discrete-event physics engine running M/M/1 queue calculations, topological propagation, and failure injection.
* **Diagnostic Analyzer (`backend/app/simulation/analyzer.py`):** Post-simulation inference module identifying root-cause bottlenecks and generating prescriptive remediations.
* **Template Library (`backend/app/templates.py`):** Pre-configured production-grade blueprint topologies (E-Commerce, Microservices, Event-Driven).

### 3.4 Algorithm Descriptions

Algorithm 1 provides the physics for discrete time queing on a DAG. For every incoming packet, if the service’s current capacity is insufficient, a service will create a queue and add it to its current queue and increase the latency to L=L_base + 0.5 * Q. Crashes of components result in 0 capacity of a service at specified time ticks. A chaos daemon (Algorithm 3) removes a component of a service at random at every 15 time ticks.

```text
Algorithm 1: DAG Traffic Propagation and M/M/1 Queuing
Input: Graph G = (V, E), Duration T, Failures F, ChaosMode C
Output: Telemetry History H
1: Initialize topological order: order = TopologicalSort(G)
2: for tick = 1 to T do
3:    ApplyFailures(G, F, tick)
4:    if C and (tick mod 15 == 0) then ExecuteChaosDaemon(G) end if
5:    for each node u in order do
6:       if u.type == 'client' then u.throughput = u.base_rps
7:       else u.incoming_rps = Sum(v.throughput for v in InNeighbors(u))
8:            eff_cap = u.capacity
9:            if u.incoming_rps > eff_cap then
10:              u.drop_rate = u.incoming_rps - eff_cap; u.queue_depth += u.drop_rate
11:              u.throughput = eff_cap; u.status = 'critical'
12:           else u.throughput = u.incoming_rps; u.status = 'healthy' end if
13:           u.latency = u.base_latency + (0.5 * u.queue_depth)
14:      end if
15:   end for
16:   EmitTickSnapshot(H, tick, G)
17: end for
```

## 4 UML and System Diagrams

This chapter includes the design of NetworkSim in its entirety, comprising structural and behavioral UML model such as the use case model, component model, execution and state models, the domain model, and the container deployment models.

### 4.1 Use Case Diagram

Fifteen use cases divided into four functional areas — Topology Construction, Blueprint Lifecycle, Simulation Execution, and Telemetry Analysis — are initiated by the System Architect / Student. A secondary actor, the Chaos Daemon, randomly delete nodes to achieve system disorder.

![Fig. 3. UML Use Case Diagram](../Diagrams/png_opt/fig3_usecase.png)

### 4.2 Component Diagram

The Application Archetecture is segmented by Frontend and Backend Packages within the Component Diagram. As the Client-Side State Controller, Zustand interacts with UI Panels and the Backend via REST/Websocket protocols.

![Fig. 4. UML Component Diagram](../Diagrams/png_opt/fig4_component.png)

### 4.3 Sequence Diagram — Simulation Run

The following Sequence Diagram shows an asynchronus WebSocket connection, a 60-tick streaming loop at 20 Hz, synchronization of the downstream UI states and the sending of post-simulation analysis data.

![Fig. 5. UML Sequence Diagram](../Diagrams/png_opt/fig5_sequence.png)

### 4.4 Node State Machine Diagram

Each node behaves like a finite state automaton and go through 4 different states, Healthy (Green), Warning (Amber, when load is 80% or greater), Critical (Red, when load is over 100% or if queue is greater than 0), and Failed (Black, capacity is 0).

![Fig. 6. UML State Machine Diagram](../Diagrams/png_opt/fig6_statemachine.png)

### 4.5 Domain Class Diagram

The Domain Class Diagram provides a visual representation of Pydantic v2 data models. The base node data class define 11 telemetry data attributes and is supplemented by 11 subclasses (ClientData, LoadBalancerData, ApiServerData, DatabaseData, and more).

![Fig. 7. UML Class Diagram](../Diagrams/png_opt/fig7_class.png)

### 4.6 Deployment Diagram — Docker Architecture

This diagram detail the production multi-container setup running Docker Compose with Next.js client, FastAPI simulation backend and Redis.

![Fig. 8. Deployment Diagram](../Diagrams/png_opt/fig8_deployment.png)

## 5 Implementation and Experimental Setup

### 5.1 Technology Stack

The full technology stack employed across frontend, backend, and deployement is itemized in Table 2.

**Table 2.** Technology stack employed across frontend, backend, and deployment

| Layer | Technology | Version / Role | Key Functionality |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js / React | v16.2 / v19.2 | Server-side rendering, layout management, client routing |
| **Graph Canvas** | @xyflow/react (React Flow) | v12.10.2 | Node dragging, connection handles, animated SVG edges |
| **State Management** | Zustand | v5.0.12 | Single store for nodes, edges, unit costs, and tick telemetry |
| **Data Visualization** | Recharts & Chart.js | v3.8.1 / v4.5.1 | Real-time streaming multi-line charts and capacity gauges |
| **Backend Framework** | FastAPI / Starlette | v0.110.0 | Asynchronous ASGI server, REST endpoints, WebSocket handler |
| **Graph Modeling** | NetworkX | v3.2.1 | DiGraph construction, topological sorting, dependency checks |
| **Data Validation** | Pydantic | v2.6.4 | Strict typed schema validation for graphs, requests, and ticks |
| **Styling & Icons** | Tailwind CSS & Lucide | v4.0 / v1.8.0 | Dark-mode aesthetic, micro-animations, iconography |
| **Containerization** | Docker & Compose | v24.0+ | Multi-container orchestration for web, API, and cache services |

### 5.2 Implementation Status — Review 2 Delivery

By Review 2, the entirety of NetworkSim are functional and ready for deployment. The developed components of NetworkSim have been integrated, and the final assembly of NetworkSim has been experimentally verified. All of the functionality has been confirmed during execution of the browser environment.

#### 5.2.1 Implemented Core Modules (Complete):
* Interactive drag-and-drop canvas supporting 11 distinct infrastructure node types with live connection validation.
* Dynamic properties sidebar featuring responsive sliders for base RPS, throughput capacity, and baseline latency.
* Zustand global store implementing complete reactive CRUD state management across topology nodes, edges, and unit prices.
* FastAPI asynchronous REST endpoints (GET /, GET /templates, POST /simulate, POST /analyze) and WebSocket (/ws/simulate).
* Tick-based physics engine executing DAG topological sorts and M/M/1 queuing with dynamic latency penalties.
* Deterministic failure scheduler enabling time-targeted node crashes and artificial traffic spikes.
* Autonomous Chaos Daemon executing stochastic node termination every 15 simulation ticks.
* Automated post-simulation diagnostic analyzer generating root-cause narratives and prescriptive remediation steps.
* Real-time Recharts analytics panel plotting throughput, queue depths, and dropped packets with live grid status indication.
* Terminal-style Event Console displaying color-coded tick events and context-aware fix recommendations.
* Gamified AWS cost estimation configurator computing dynamic monthly operational expenditures based on provisioned capacity.
* Blueprint JSON export and import pipeline facilitating persistent topology storage in local browser environments.
* Pre-configured multi-tier blueprint template library spanning E-Commerce, Microservices, and Event-Driven systems.
* Production-grade Docker Compose stack orchestrating Next.js, FastAPI, and Redis services.

#### 5.2.2 Future Enhancements (Post-Submission Polish):
* Natural language processing terminal for interactive topology repair commands.
* Multi-hop cascade dependency tracing visualizing historical failure propagation paths on the canvas.
* Persistent cloud database storage for user project workspaces and versioned blueprints.
* Automated PDF and CSV export of complete simulation telemetry runs.

### 5.3 Key APIs and Interfaces

For real-time and batch executions, the API were developed with simplicity in mind (Table 3).

**Table 3.** FastAPI REST and WebSocket endpoint reference

| Method | Endpoint | Protocol | Payload / Return | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | HTTP/1.1 | None $\rightarrow$ JSON | Health check endpoint returning system status. |
| `GET` | `/templates` | HTTP/1.1 | None $\rightarrow$ List[Template] | Retrieves pre-configured topology blueprint templates. |
| `POST` | `/simulate` | HTTP/1.1 | SimRequest $\rightarrow$ SimResponse | Executes full batch simulation returning complete tick history and analysis. |
| `POST` | `/analyze` | HTTP/1.1 | AnalyzeRequest $\rightarrow$ Output | Runs standalone diagnostic inference on provided tick history data. |
| `WS` | `/ws/simulate` | WebSocket | JSON $\rightarrow$ Stream[TickResult] | Streams real-time simulation ticks at 20 Hz (50 ms intervals) for 60 ticks. |

### 5.4 User Interface Overview

The user interface has an all dark-mode theme to fit the “control room” style of a system, like the simulation E-commerce example in Fig. 9. As you can see, the main design includes 8 nodes: Client -> DNS -> CDN -> Load Balancer -> API Servers -> Database. In Fig. 10, the simulation is mid-process and we can see live events streaming in the Event Console at Tick 25. The status bars at the top say ‘SIMULATING’ to show it’s active, and nodes glow status colors based on their state (in this case, green and amber status ring).

![Fig. 9. NetworkSim main interface](../Screenshots/fig9_main_canvas_ecommerce.png)

![Fig. 10. Live simulation running](../Screenshots/fig10_simulation_running_tick25.png)

## 6 Experimental Results and Discussion

### 6.1 Traffic Propagation Accuracy

For mathematical verification, we ran a simple linear simulation. In the Client to API to Database architecture (500, 1000, 500 RPS) over 60 steps, with zero congestion and the API receiving 500 RPS, we observes zero packet loss and a base latency of 10 ms. The database handled the 500 write capacity with zero lag. In the doubled traffic scenario (1000 RPS), the database experienced an accumulating queue at 500 req/tick. Latency in that case grew as the theory predicted (L=Lbase + 0.5Q). These observations proves that the topologcal sort correctly maps traffic without numeric corruption.

### 6.2 Chaos Daemon Cascade Testing

Resilience under stochastic degradation was benchmarked on the 8-node E-Commerce blueprint with Chaos Mode active. At tick 15, the Chaos Daemon annihilated the `api_web` instance, instantly reducing the E-Commerce blueprint's capacity to 0 RPS. Traffic was routed to the last surviving API instance (`api_pay`), which caused an event log to be emitted in the Event Console (‘Capacity exceeded at api_pay’). A second chaos event, an acute downstream outage, was triggered at tick 30 on the last surviving API instance. Throughput in the real-time Recharts panel shows a step down at tick 15, 30 and 45. Queue backlog grew to 10,500 requests, lost packets shot up, and the status of the system grid went from ‘Flawless’ to ‘Compromised’. Fig. 12 captures the Chaos strikes alongside intelligent context-based remediation suggestions in the Event Console (e.g. ‘Auto-scale API pods or implement aggressive caching’).

![Fig. 11. Real-time Recharts analytics panel](../Screenshots/fig11_analytics_panel.png)

![Fig. 12. Event Console](../Screenshots/fig12_event_console_chaos_strikes.png)

### 6.3 Post-Simulation Diagnostic Analysis Quality

The telemetry data recorded after the disruption was sent to the Diagnostic Analyzer by using `POST /analyze`. The Diagnostic Analyzer was able to correctly identify the cause of the failure and label it an CATASTROPHIC OUTAGE, as shown in Fig. 13. The reason it provided for the label was ‘waf_1 experienced a hard crash. Processing capacity plummeted to 0, blackholing all downstream traffic’. Along with the reason, it automatically provided recommended remediation actions which included an inspection of the logs, and a multizone automated failover deployment.

![Fig. 13. Post-simulation Diagnostic Report modal](../Screenshots/fig13_cost_modal.png)

### 6.4 Cost Estimation Validation

The Budget Configurator tool was tested to confirm that it correctly estimate the run cost at $760 per month with the current E-Commerce topology (Fig. 14). With that topology, the costs were broken down by infrastructure tier (DNS at $250/month, Load Balancers at $240/month, and API Servers at $70/month) and confirmed proportional cost scaling for 11 infrastructure entities with node capacity and unit price modifications.

![Fig. 14. Budget Configurator modal](../Screenshots/fig14_post_sim_analysis.png)

## 7 Conclusion and Future Scope

NetworkSim enables systems engineers to perform educational simulations, chaos tests, and explore different design options directly from their browser, requiring no downloads. With the implementation of its core software, NetworkSim's discrete physics engine run at 20Hz and include a Chaos Daemon to disrupt a systems network in a controlled and intentional manner. Users are provided with tools for cause-and-effect analyses, dynamic estimates of AWS costs, and import/export capabilities of designs created with Docker Compose. M/M/1 queing physics and cascading failures was observed and accurately captured in simulations and analyses, and cost estimates for designs were updated in real time. Extensions to NetworkSim are proposed that will include NLP based automated failure diagnostics, an automated, multi-hop cascade failure diagnosis and root cause analysis tool, and persistent repositories for designs.

## References

[1] Newman, S.: Building Microservices: Designing Fine-Grained Systems. O'Reilly Media, Sebastopol (2021)  
[2] Kleppmann, M.: Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems. O'Reilly Media, Sebastopol (2017)  
[3] Lantz, B., Heller, B., McKeown, N.: A network in a laptop: rapid prototyping for software-defined networks. In: Proceedings of the 9th ACM SIGCOMM Workshop on Hot Topics in Networks (HotNets-IX), pp. 1–6. ACM, New York (2010)  
[4] Matloff, N.: Introduction to Discrete-Event Simulation and the SimPy Language. University of California, Davis (2008)  
[5] Basiri, A., Sengupta, N., Shturova, J., et al.: Chaos Engineering. IEEE Software 33(3), 35–41 (2016)  
[6] Beyer, B., Jones, C., Petoff, J., Murphy, N.R.: Site Reliability Engineering: How Google Runs Production Systems. O'Reilly Media, Sebastopol (2016)  
[7] Tanenbaum, A.S., Van Steen, M.: Distributed Systems: Principles and Paradigms, 3rd edn. CreateSpace Independent Publishing (2017)  
[8] Tiwary, M., et al.: Interactive Visual Simulation Environments for Computer Science Education. ACM Inroads 11(2), 44–53 (2020)  
[9] Ramirez, A., et al.: Web-Based Simulation Platforms in Systems Engineering Curricula. IEEE Transactions on Learning Technologies 14(4), 512–524 (2021)  
[10] Varga, A., Hornig, R.: An overview of the OMNeT++ simulation environment. In: Proceedings of the 1st International Conference on Simulation Tools and Techniques for Communications, Networks and Systems (SIMUTools). ICST, Brussels (2008)  
[11] Allspaw, J., Robbins, J.: Web Operations: Keeping the Data On Time. O'Reilly Media, Sebastopol (2010)  
[12] Fowler, M.: Patterns of Enterprise Application Architecture. Addison-Wesley, Boston (2002)  
