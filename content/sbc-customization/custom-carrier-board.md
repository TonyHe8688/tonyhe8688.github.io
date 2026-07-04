---
title: "Custom Carrier Board Checklist"
description: "A board-level checklist for adapting an SBC module to a production carrier board."
date: 2026-07-04
avontek_url: ""
---

A custom carrier board changes both hardware validation and software assumptions. Even when the compute module is stable, the carrier can alter power sequencing, display wiring, storage, USB current limits, Ethernet magnetics, GPIO usage, and mechanical constraints.

## Review areas

Before layout is finalized, review boot mode pins, debug UART access, recovery method, power tree, reset sources, display connector pinout, touch connector pinout, ESD protection, and production test pads. The software team should review the schematic before the first prototype arrives.

## Software impact

Carrier board changes often require device tree updates, bootloader configuration, kernel driver options, and factory test scripts. Treat the board revision as a software input, not only a hardware document.

## References

- [Linux device tree usage](https://docs.kernel.org/devicetree/usage-model.html)
- [Buildroot manual](https://buildroot.org/downloads/manual/manual.html)
- [Yocto Project documentation](https://docs.yoctoproject.org/)
