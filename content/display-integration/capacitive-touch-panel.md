---
title: "Capacitive Touch Panel Integration"
description: "Notes on I2C touch controllers, interrupts, reset lines, coordinates, and Linux input testing."
date: 2026-07-04
avontek_url: ""
---

Capacitive touch panel integration is usually split between hardware wiring, firmware or controller configuration, kernel driver support, and coordinate mapping. The display can be correct while touch remains inverted, rotated, noisy, or missing.

## Bring-up checklist

Confirm I2C address detection, reset GPIO polarity, interrupt trigger type, power rail timing, and driver binding. After the driver probes, verify events through the Linux input subsystem before testing a graphical application.

## Coordinate problems

Rotation and axis inversion should be handled consistently across the kernel, compositor, and application stack. Mixing coordinate transforms across layers can produce a touch experience that works in one test program and fails in the final UI.

## References

- [Linux input subsystem](https://docs.kernel.org/input/input.html)
- [evtest project](https://gitlab.freedesktop.org/libevdev/evtest)
- [libinput documentation](https://wayland.freedesktop.org/libinput/doc/latest/)
