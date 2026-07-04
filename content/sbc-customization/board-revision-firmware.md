---
title: "Board Revision Tracking and Firmware Compatibility"
description: "How to track board revisions and keep firmware compatible across production changes."
date: 2026-07-04
avontek_url: ""
---

Board revisions should be visible to software. Without revision tracking, one firmware image may behave differently across lots because GPIO assignments, display panels, PMIC settings, or peripheral options changed. This page is written as an engineering note rather than a marketing overview. The goal is to identify the design choices, bring-up checks, validation evidence, and production risks that should be visible before a board or panel product is released.

![Board Revision Tracking and Firmware Compatibility](/images/board-revision-firmware.svg)

## System context

In a real product, board Revision Tracking and Firmware Compatibility is rarely isolated from the rest of the system. It interacts with power sequencing, connector choices, firmware configuration, device tree or board configuration, factory tests, and the final enclosure. A feature that works on an open bench can still fail in production if the cable length changes, the product warms up, a different peripheral is installed, or the software image handles errors differently.

The first review should connect the schematic, layout, firmware, and test plan. That review does not need to be complicated, but it should be explicit. Engineers should know which signal or driver owns the feature, how it is enabled during boot, what a normal log looks like, and what evidence proves that the function is stable.

## Related engineering notes

This topic is usually reviewed together with [Yocto Board Customization Workflow](/embedded-linux/yocto-board-customization/) and [Production Testing for Embedded Boards](/sbc-customization/production-testing/). Reading the related notes helps connect the board-level decision, software configuration, and production validation path before the design is frozen.

## Design decisions

| Area | Engineering decision | Risk if ignored |
| --- | --- | --- |
| Revision ID | Define the electrical and software owner for revision ID | Driver probes but hardware does not work |
| Device tree | Choose the validation interface for device tree | Factory test misses connector-level failure |
| EEPROM | Document timing and polarity for eEPROM | Boot behavior changes between revisions |
| Firmware | Record production pass criteria for firmware | Field recovery has no useful evidence |
| Factory log | Keep a revision-specific test note for factory log | Future firmware breaks old hardware |

The table should be filled during design review and updated after the first prototype. Keeping these decisions in one place prevents the common problem where the schematic, firmware, and factory test procedure each describe a slightly different product.

## Bring-up checklist

A practical bring-up sequence should start with observable signals and only then move into application behavior:

- Confirm revision ID behavior against the schematic and board revision.
- Confirm device tree behavior against the schematic and board revision.
- Confirm eEPROM behavior against the schematic and board revision.
- Confirm firmware behavior against the schematic and board revision.
- Confirm factory log behavior against the schematic and board revision.
- Capture a clean boot log and save it with the firmware build number.
- Record one passing test and at least one intentional failure case.
- Repeat the test after thermal soak, power cycling, and enclosure assembly.

During early validation, do not rely on a single successful boot. Many embedded failures are intermittent because they depend on timing, rail ramp, cable quality, interrupt noise, storage state, or temperature. A useful bring-up note includes both the pass condition and the failure evidence that was checked.

## Linux and firmware checks

Most embedded product features need a small set of repeatable software checks. The exact command depends on the platform, but the habit should be consistent: identify the kernel device, inspect logs, exercise the interface, and record the result.

```sh
dmesg | tail -80
find /sys -maxdepth 3 -iname "*board*" 2>/dev/null
ls -l /dev | head
```

For a production-oriented test, prefer a script that prints a compact result line. A fixture or CI system can parse that output and store it with the serial number:

```text
TEST_RESULT feature=board-revision-firmware board_rev=B2 firmware=2026.07.04 status=pass
```

If the feature depends on device tree, bootloader variables, Android properties, or a userspace service, record those settings beside the test result. A board that passes today can fail after a minor firmware update if the configuration path is not documented.

## Common failure modes

The most common failures come from mismatched assumptions. Hardware may expose a signal with one polarity while software assumes another. A driver may probe successfully but use the wrong timing. A factory test may verify that a device node exists without proving that the external connector or real load works.

Another frequent issue is testing only in the easiest condition. The product should also be tested after repeated cold boots, during warm operation, with realistic cable length, with expected peripherals attached, and after unexpected power removal. For display or HMI products, include maximum brightness and touch interaction because those conditions change power, thermal behavior, and interrupt activity.

## Production validation

Before release, define what must be true for a unit to pass production. The answer should be measurable. A good factory procedure records the board revision, firmware version, test fixture version, feature result, and failure log. If a device comes back from the field, that record helps separate manufacturing defects from firmware regressions or installation problems.

For long-term maintenance, keep the validation method stable across board revisions. If the hardware changes, update the test procedure and make the difference visible in the release notes. Silent changes make root cause analysis much harder.

## References

- [Linux device tree documentation](https://docs.kernel.org/devicetree/usage-model.html)
- [Linux kernel documentation](https://docs.kernel.org/)
