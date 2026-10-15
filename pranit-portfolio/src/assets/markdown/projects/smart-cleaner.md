# Smart Floor Cleaning Robot (IoT)

Designed and developed an **IoT-based autonomous floor cleaning robot** utilizing vacuum and mopping mechanisms. This project integrates embedded systems, real-time sensor data processing, and wireless remote control for efficient domestic maintenance.

---

## 🛠️ Technical Implementation

### 📱 Wireless Control & Monitoring
-   **IoT Integration:** Implemented seamless wireless control using the **Blynk IoT platform**, allowing users to operate the robot from their mobile devices.
-   **Live Video Feed:** Integrated the **ESP32-CAM** module to provide a real-time video stream, enabling remote monitoring of the cleaning process.
-   **WiFi Communication:** Established reliable communication between the robot and the control interface via local WiFi networks.

### 🤖 Autonomous Navigation
-   **Obstacle Avoidance:** Utilized **Ultrasonic Sensors** for precise real-time obstacle detection, enabling the robot to navigate complex environments without collisions.
-   **Motor Synchronization:** Synchronized dual-motor drivers to ensure smooth movement and precise turning radius for full room coverage.
-   **Fail-safe Logic:** Programmed autonomous routines that take over if manual control is disconnected.

---

## 🏗️ Hardware Architecture

The system is built on a modular hardware stack designed for durability and performance:

-   **Microcontroller:** ESP32 (Dual-core, high efficiency)
-   **Sensors:** HC-SR04 Ultrasonic Sensors for distance measurement.
-   **Actuators:** High-torque DC motors with L298N motor drivers.
-   **Power Management:** Rechargeable Li-ion battery pack with voltage regulation for stable operation.

---

## 🌍 Impact & Efficiency

This project demonstrates the practical application of IoT in everyday life. By combining low-cost components with sophisticated software logic, it provides an affordable solution for automated home cleaning, reducing manual labor and enhancing efficiency through intelligent navigation and remote monitoring.
