---
title: "RTC Backup Power and Timekeeping"
description: "Notes on real-time clock circuits, backup batteries, Linux timekeeping, and product behavior after power loss."
date: 2026-07-04
avontek_url: ""
---

An RTC keeps system time when the main power supply is off. It is a small function, but it affects logs, certificates, scheduled tasks, data records, and field diagnostics.

## Hardware considerations

The RTC may be integrated in the SoC, PMIC, or provided by an external chip over I2C or SPI. The backup source can be a coin cell, rechargeable battery, or supercapacitor. The expected backup duration, leakage current, temperature range, and service life should be checked against the product environment.

For industrial devices, the mechanical access to the battery is also important. A difficult-to-replace coin cell can become a maintenance problem if the product is installed in a cabinet or sealed enclosure.

## Linux behavior

Linux normally reads hardware time during boot and writes system time back during shutdown or scheduled sync. If the RTC starts from an invalid date, application logs and TLS connections may fail. It is useful to detect invalid RTC values and fall back to network time when available.

## References

- [Linux RTC documentation](https://docs.kernel.org/driver-api/rtc.html)
- [systemd-timesyncd documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd-timesyncd.service.html)
- [hwclock manual](https://man7.org/linux/man-pages/man8/hwclock.8.html)
