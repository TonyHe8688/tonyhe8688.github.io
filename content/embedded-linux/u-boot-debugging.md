---
title: "U-Boot Debugging for Custom Boards"
description: "A short checklist for diagnosing bootloader problems during embedded board bring-up."
date: 2026-07-04
avontek_url: ""
---

U-Boot issues often look random until the boot chain is separated into stages. A useful debug session starts with power rails, reset timing, boot mode straps, UART output, and storage access before moving into kernel handoff.

## What to check first

Confirm that the board reaches early serial output. If there is no output, inspect boot ROM mode, clock source, DRAM initialization, and whether the correct image is being loaded. If U-Boot starts but Linux does not, compare bootargs, device tree address, initramfs configuration, and storage partition names.

## Common board-level causes

Custom boards frequently fail because the reference design changed a GPIO, PMIC rail, storage bus width, or reset line. Those changes must be reflected in the bootloader device tree and board configuration, not only in the Linux kernel tree.

## References

- [U-Boot board porting guide](https://docs.u-boot.org/en/latest/develop/board.html)
- [U-Boot environment variables](https://docs.u-boot.org/en/latest/usage/environment.html)
- [Linux kernel boot parameters](https://docs.kernel.org/admin-guide/kernel-parameters.html)
