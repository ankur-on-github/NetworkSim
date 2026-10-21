# NetworkSim Project Docs

## Problem Statement

Modern distributed systems are hard to understand by only looking at a diagram. A static sketch can show boxes and arrows, but it cannot show what will happen when traffic rises, when one service becomes slow, or when a database goes down. Because of that, students, software engineers, and system architects often have to guess how a design will behave before they test it in real cloud infrastructure.

This proposed project will solve that gap by turning a network architecture into a live learning environment. Instead of showing only the structure of the system, it will let the user see traffic flow, queue buildup, latency changes, packet drops, node health, and failure cascades in real time. It will also show an estimated cost view, so users can understand both the technical and financial impact of their design choices.

## Proposed Method

The project will use a split design.

The frontend will be built with Node.js-based Next.js and React Flow. It will give the user a drag-and-drop canvas for creating a network. Users will be able to place nodes such as clients, load balancers, API servers, caches, databases, message queues, CDN nodes, DNS, object stores, workers, and serverless units. They will connect these nodes with edges, change node settings, remove parts of the topology, save or load blueprints, and start a simulation with one click.

The backend will be a FastAPI service written in Python. It will receive the topology as a directed graph and run a tick-based simulation using NetworkX. On each tick, the engine will calculate how much traffic enters each node, compare it with the node capacity, and decide whether the node stays healthy, becomes overloaded, or fails. If a node is overloaded, the engine will increase queue depth, raise latency, and record the event. If a failure is injected or chaos mode is enabled, the system will deliberately break a node and let the impact spread through the graph. The backend will stream each tick back to the browser through WebSockets, so the canvas and charts will update live.

The frontend will then present the result in three simple ways. The canvas will update node status in real time, the analytics panel will plot throughput, queue depth, and packet loss, and the event console will explain what happened during the run. A cost modal will also estimate monthly infrastructure cost based on the nodes in the topology.

## Why This Will Be Different

Most existing tools do only one part of the job. Some tools are good for drawing architecture diagrams, but they do not simulate behavior. Monitoring tools show live metrics, but they usually assume a real system already exists. Cloud planning tools may estimate cost, but they often do not give an easy way to test failures, overload, and routing changes in one place.

NetworkSim will combine all of those ideas in a single sandbox. It will not try to replace a full cloud platform, and it will not be just a drawing app. Its main value will be that a user can build an architecture, stress it, break it, and study the result without spending real money or deploying real services. That will make it useful for learning, design review, and quick experimentation.

In simple terms, the project will answer this question: "What will happen to my system if traffic rises or one service fails?" It will give a visual and practical answer instead of a static guess.
