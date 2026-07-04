---
title: "CAN Bus Interface for Embedded Linux"
description: "CAN controller, transceiver, termination, and SocketCAN notes for Linux-based embedded devices."
date: 2026-07-04
avontek_url: ""
---

CAN bus is common in vehicles, industrial automation, battery systems, and distributed control devices. On Linux products, CAN integration usually combines a controller driver, a physical transceiver, termination, and SocketCAN tooling.

## Hardware checklist

Confirm whether the SoC has an internal CAN controller or needs an external controller over SPI. The board still needs a suitable CAN transceiver, protection components, and a clear termination option. For cabinet or vehicle installations, connector pinout and shielding should be documented.

## Linux checklist

SocketCAN exposes CAN interfaces as network devices. During bring-up, check the device tree node, clock source, bitrate configuration, bus-off behavior, and receive error counters. A silent or listen-only mode can be useful when attaching to an existing bus.

## References

- [Linux CAN documentation](https://docs.kernel.org/networking/can.html)
- [can-utils project](https://github.com/linux-can/can-utils)
- [SocketCAN overview](https://www.kernel.org/doc/html/latest/networking/can.html)
