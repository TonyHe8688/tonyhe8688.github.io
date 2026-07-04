---
title: "PoE Power Module Integration"
description: "Practical notes for adding Power over Ethernet support to embedded Linux and industrial SBC products."
date: 2026-07-04
avontek_url: ""
---

Power over Ethernet is useful when an embedded device needs both network connectivity and power from a single cable. It is common in access control terminals, industrial controllers, wall-mounted HMI panels, gateways, and remote monitoring devices.

## Design points

The first choice is the target PoE class and power budget. A small Linux SBC with Ethernet, display, touch, Wi-Fi, USB, and backlight load can consume more current than expected during boot or peak brightness. The power tree should reserve margin for cold start, peripheral hotplug, and cable voltage drop.

PoE integration also affects thermal design. A PD controller, transformer, rectifier, DC/DC stage, and protection components can create localized heat. For enclosed products, the layout and enclosure material matter as much as the nominal power rating.

## Bring-up checklist

Check PD detection, classification, input protection, isolated or non-isolated conversion, inrush behavior, Ethernet magnetics, and EMI performance. On the software side, record boot behavior at low input voltage and confirm the device recovers cleanly after network power cycling.

## References

- [IEEE 802.3 Ethernet standards](https://standards.ieee.org/ieee/802.3/7071/)
- [Linux Ethernet bridge documentation](https://docs.kernel.org/networking/bridge.html)
- [OpenWrt hardware notes](https://openwrt.org/docs/techref/hardware)
