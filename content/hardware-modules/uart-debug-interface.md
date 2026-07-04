---
title: "UART Debug Interface for Embedded Boards"
description: "UART design and bring-up notes for boot logs, factory testing, and board recovery."
date: 2026-07-04
avontek_url: ""
---

UART is still the most important debug interface on embedded boards. Before Ethernet, display, USB, storage, Wi-Fi, or an application stack are stable, serial logs usually provide the first reliable view of bootloader and kernel behavior. A well-planned UART interface can save hours during first board bring-up, production testing, and field recovery.

![UART debug chain for embedded board bring-up](/images/uart-debug-chain.svg)

For industrial SBCs and display panels, the debug UART is often treated as a small detail. In practice it is part of the product architecture. It determines how engineers see early boot failures, how a factory fixture records errors, and how a deployed device can be recovered when the main UI does not start.

## Hardware considerations

Expose at least one debug UART through a header, test pad, board edge connector, or internal service connector. The voltage level should be clearly documented as 1.8 V, 3.3 V, or another logic level. Do not assume that a board can connect directly to RS232 voltage levels unless a proper transceiver is present. A logic-level UART and a classic RS232 port are not interchangeable.

The connector style should match the product stage. During early prototypes, a 3-pin or 4-pin header is convenient. For a sealed production product, pogo pads may be better because they support factory automation without exposing a service port to normal users. If a connector remains inside the enclosure, the mechanical team should confirm that it is still reachable after the board is installed.

| Item | Recommended practice | Reason |
| --- | --- | --- |
| Pins | TX, RX, GND, optional Vref | Vref helps identify logic level but should not power the board by accident |
| Voltage | Mark 1.8 V, 3.3 V, or 5 V clearly | Wrong adapter voltage can damage SoC pins |
| Connector | Header for EVT, pads for production | Different stages need different access methods |
| Boot console | Enable during development | Required for U-Boot and kernel diagnosis |
| Production policy | Disable login or require authentication | Prevents uncontrolled shell access |

For production devices, the UART can also be used for factory logs and recovery, but it should not expose uncontrolled shell access in deployed products. Access policy should be decided before release images are built. If a serial console is useful for manufacturing, keep the boot log visible but disable automatic root shell login. If a field service team needs access, design a controlled authentication method instead of leaving a development console open.

## Related engineering notes

This topic is usually reviewed together with [U-Boot Debugging for Custom Boards](/embedded-linux/u-boot-debugging/) and [Production Testing for Embedded Boards](/sbc-customization/production-testing/). Reading the related notes helps connect the board-level decision, software configuration, and production validation path before the design is frozen.

## Bring-up checklist

Confirm TX/RX orientation, voltage level, baud rate, boot ROM output, U-Boot output, kernel console settings, and whether the serial console remains enabled in production. Keep a known-good USB-to-UART adapter in the lab because many bring-up problems are caused by simple level or wiring mistakes.

A practical bring-up sequence:

- Confirm board ground and adapter ground are connected.
- Connect board TX to adapter RX, and board RX to adapter TX.
- Confirm voltage level before connecting the adapter.
- Start with `115200 8N1` unless the BSP documentation says otherwise.
- Capture power-on logs from the first byte, not only after Linux starts.
- Save one complete successful boot log as a baseline.
- Repeat the log capture after every bootloader, kernel, or device tree change.

On macOS or Linux, a basic serial session may look like this:

```sh
screen /dev/tty.usbserial-0001 115200
```

On Linux, `picocom` or `minicom` are also common:

```sh
picocom -b 115200 /dev/ttyUSB0
```

For automated factory capture, a simple script can timestamp serial output:

```sh
mkdir -p logs
ts=$(date +%Y%m%d-%H%M%S)
stdbuf -oL cat /dev/ttyUSB0 | tee "logs/uart-$ts.log"
```

The exact device name depends on the USB-UART adapter and host operating system. The important point is to capture logs consistently and store them with the board revision, firmware build, and test condition.

## Bootloader and kernel settings

UART debug becomes useful only when the boot chain routes messages to the expected port. In U-Boot, the console is usually configured through board configuration, device tree aliases, or environment variables. In Linux, the kernel command line normally includes a `console=` parameter.

Example kernel command line fragment:

```text
console=ttyS2,115200n8 earlycon root=/dev/mmcblk0p2 rw
```

The exact device name may be `ttyS0`, `ttyS2`, `ttyAMA0`, `ttymxc0`, or another SoC-specific name. Do not copy a console parameter from another platform without checking the serial driver naming used by the target kernel.

Early console support is useful when the kernel crashes before the normal serial driver is fully registered. It can reveal clock, pinctrl, memory, or device tree errors that would otherwise look like a silent boot hang.

## Common failure modes

The most common UART issue is swapped TX and RX. The second is wrong voltage level. The third is assuming the wrong baud rate. These are simple problems, but they can look like a dead board during first bring-up.

Another common issue is pin multiplexing. A SoC pin may be configured as GPIO, PWM, I2C, or another function instead of UART. In that case, the boot ROM might print early output but Linux later becomes silent, or the reverse. Review pinctrl settings in both bootloader and kernel device trees.

Noise and cable length can also matter. A long flying wire from a prototype board to a USB adapter can pick up noise, especially near DC/DC converters, display cables, or motors. For debug logs, short wires and a reliable ground connection are usually enough. For an actual external serial product port, use the proper transceiver and protection circuit.

## Factory and field use

UART can be more than a developer tool. In a production fixture, it can provide board identity, boot progress, hardware test results, and final pass/fail status. The firmware can print a compact machine-readable line at the end of testing, such as:

```text
FACTORY_RESULT board=AVT-RK3568 rev=B2 emmc=ok rtc=ok eth=ok display=ok result=pass
```

This type of output is easy to parse and archive. It also gives the quality team a record that is tied to the firmware version and board revision.

For field service, be more careful. A UART port inside the enclosure may be acceptable, but a permanently exposed debug console can become a security problem. If logs are needed in the field, consider read-only diagnostic output or a temporary service mode rather than a full login shell.

## Validation checklist

Before freezing the board design, verify the following:

- The UART is reachable on assembled hardware.
- The logic level is marked in schematic and service documentation.
- Boot ROM, U-Boot, and Linux logs are visible when expected.
- The UART still works after display, Wi-Fi, LTE, and other high-load peripherals start.
- Production firmware does not expose unintended root access.
- Factory fixtures can capture logs without manual terminal setup.
- The connector or pads are mechanically reachable in the final enclosure.

Good UART design is not complicated, but it has a high return. When a board fails before the network stack starts or the display turns on, a clean serial log is often the difference between guessing and debugging.

## References

- [Linux serial console documentation](https://docs.kernel.org/admin-guide/serial-console.html)
- [U-Boot console documentation](https://docs.u-boot.org/en/latest/usage/cmd/console.html)
- [Linux TTY documentation](https://docs.kernel.org/driver-api/tty/)
