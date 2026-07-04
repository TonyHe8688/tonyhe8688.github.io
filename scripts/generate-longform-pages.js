const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const refs = {
  kernel: ["Linux kernel documentation", "https://docs.kernel.org/"],
  dt: ["Linux device tree documentation", "https://docs.kernel.org/devicetree/usage-model.html"],
  uboot: ["U-Boot documentation", "https://docs.u-boot.org/"],
  buildroot: ["Buildroot manual", "https://buildroot.org/downloads/manual/manual.html"],
  yocto: ["Yocto Project documentation", "https://docs.yoctoproject.org/"],
  android: ["Android source documentation", "https://source.android.com/docs"],
  drm: ["Linux DRM/KMS documentation", "https://docs.kernel.org/gpu/drm-kms.html"],
  input: ["Linux input subsystem", "https://docs.kernel.org/input/input.html"],
  lvgl: ["LVGL documentation", "https://docs.lvgl.io/"],
  qt: ["Qt Embedded Linux documentation", "https://doc.qt.io/qt-6/embedded-linux.html"],
  can: ["Linux CAN documentation", "https://docs.kernel.org/networking/can.html"],
  gpio: ["Linux GPIO character device API", "https://docs.kernel.org/userspace-api/gpio/chardev.html"],
  rtc: ["Linux RTC documentation", "https://docs.kernel.org/driver-api/rtc.html"],
  rs485: ["Linux RS485 serial documentation", "https://docs.kernel.org/driver-api/serial/serial-rs485.html"],
};

const pages = [
  page("embedded-linux", "rockchip-bsp-notes", "Rockchip BSP Bring-up Notes", "Practical checkpoints for reviewing a Rockchip Linux BSP before board-level customization.", "Rockchip BSP work usually starts from a vendor tree that already boots on a reference board. The engineering task is to turn that baseline into a reliable product image for a specific carrier board, display, storage device, and production process.", ["Vendor SDK", "Bootloader", "Kernel tree", "Device tree", "Root filesystem"], ["kernel", "dt", "uboot"]),
  page("embedded-linux", "u-boot-debugging", "U-Boot Debugging for Custom Boards", "A checklist for diagnosing bootloader problems during embedded board bring-up.", "U-Boot is the first software layer that most board teams can observe and modify. A clean bootloader debug method separates power, strap, DRAM, storage, environment, and kernel handoff problems instead of treating every failure as a single boot issue.", ["Boot ROM", "SPL", "U-Boot proper", "Environment", "Kernel handoff"], ["uboot", "kernel", "dt"]),
  page("embedded-linux", "device-tree-display", "Device Tree Display and GPIO Review", "How to review display, GPIO, regulator, and pinctrl nodes before enabling custom hardware.", "Device tree review is one of the highest value steps in an embedded Linux project. It connects the schematic to the kernel driver model and often explains why a display stays blank, a reset line toggles at the wrong time, or a peripheral never probes.", ["Schematic", "Regulators", "Pinctrl", "Display node", "Driver probe"], ["dt", "kernel", "drm"]),
  page("embedded-linux", "buildroot-minimal-system", "Buildroot Minimal Linux System", "Notes on creating a small production-focused Linux image with Buildroot.", "Buildroot is useful when a product needs a compact Linux system with predictable packages and a short build path. It is often a good fit for gateways, display controllers, appliance interfaces, and single-purpose industrial devices.", ["Board defconfig", "Toolchain", "Kernel", "Rootfs", "Post-build scripts"], ["buildroot", "kernel", "dt"]),
  page("embedded-linux", "yocto-board-customization", "Yocto Board Customization Workflow", "A practical workflow for adapting Yocto layers to a custom embedded Linux board.", "Yocto is valuable when a product needs long-term maintainability, layered customization, package control, and reproducible images across board revisions. The challenge is not only building an image but keeping board changes organized over time.", ["BSP layer", "Distro layer", "Machine config", "Recipes", "Image output"], ["yocto", "kernel", "dt"]),
  page("embedded-linux", "linux-kernel-driver-notes", "Linux Kernel Driver Debug Notes", "Driver debug notes for probe failures, device tree binding issues, interrupts, clocks, and regulators.", "Kernel driver debugging becomes easier when the driver, device tree, clocks, regulators, interrupts, and runtime logs are reviewed together. A failed probe is usually a structured dependency problem, not a random kernel behavior.", ["Binding", "Probe", "Clocks", "Regulators", "Runtime logs"], ["kernel", "dt"]),

  page("android-sbc", "android-board-bringup", "Android Board Bring-up on Industrial SBCs", "Key areas to validate when adapting Android to an embedded single board computer.", "Android bring-up on an industrial SBC combines bootloader, kernel, hardware abstraction layers, display, input, storage, security policy, and system application behavior. Treating it as only an app problem usually leads to unstable products.", ["Boot image", "Kernel", "HAL", "Display", "System app"], ["android", "kernel", "dt"]),
  page("android-sbc", "android-display-debugging", "Android Display Debugging", "Display pipeline notes for Android panels, HDMI output, rotation, brightness, and boot animation.", "Android display debugging is a full pipeline problem. The panel driver can be correct while SurfaceFlinger, hardware composer, rotation settings, or backlight control still produce a blank or unusable screen.", ["Panel driver", "DRM", "HWC", "SurfaceFlinger", "App UI"], ["android", "drm", "kernel"]),
  page("android-sbc", "touch-panel-integration", "Touch Panel Integration on Android", "Android touch controller notes for I2C, input events, rotation, calibration, and product UI behavior.", "Touch integration on Android starts in hardware but ends in user experience. A controller can probe successfully and still feel wrong if rotation, coordinate mapping, interrupt timing, or palm rejection is not validated in the final enclosure.", ["I2C", "Interrupt", "Input events", "Rotation", "UI test"], ["android", "input", "kernel"]),
  page("android-sbc", "industrial-android-panel", "Industrial Android Panel Kiosk Mode", "Kiosk-mode Android notes for locked-down industrial panels and operator terminals.", "Industrial Android panels usually run one controlled application instead of a general consumer tablet experience. Kiosk mode must handle boot launch, system navigation, updates, network loss, watchdog recovery, and restricted user access.", ["Launcher", "System UI", "Policy", "Watchdog", "Recovery"], ["android", "kernel"]),
  page("android-sbc", "android-ota-recovery", "Android OTA and Recovery Strategy", "A practical Android update and recovery plan for embedded products.", "A reliable Android product needs an update strategy before deployment. The system should recover from interrupted writes, bad application releases, power loss during update, and field devices with unreliable networks.", ["A/B slots", "Recovery", "Update package", "Rollback", "Field logs"], ["android"]),
  page("android-sbc", "android-peripheral-validation", "Android Peripheral Validation Checklist", "Checklist for validating Ethernet, Wi-Fi, USB, audio, RTC, GPIO, and serial peripherals on Android SBCs.", "Peripheral validation on Android should be repeatable and tied to board revision. A one-time manual test is not enough for a product that will ship with multiple hardware lots, displays, storage devices, and peripheral options.", ["Ethernet", "USB", "Audio", "RTC", "Factory test"], ["android", "kernel"]),

  page("display-integration", "mipi-dsi-display", "MIPI DSI Display Integration Checklist", "A checklist for panel timing, lane configuration, power sequencing, and backlight control.", "MIPI DSI display integration requires the digital display pipeline and the physical panel sequence to match. A framebuffer can render correctly while the panel remains black because reset, power rails, lane count, or initialization commands are wrong.", ["Regulators", "Reset", "DSI host", "Panel init", "Backlight"], ["drm", "dt", "kernel"]),
  page("display-integration", "capacitive-touch-panel", "Capacitive Touch Panel Integration", "Notes on I2C touch controllers, interrupts, reset lines, coordinates, and Linux input testing.", "Capacitive touch integration is a combined hardware, driver, and UI problem. The controller may be visible on I2C while coordinates are rotated, interrupts are noisy, or the final application receives unusable input.", ["I2C", "Reset", "Interrupt", "Input events", "UI mapping"], ["input", "dt", "kernel"]),
  page("display-integration", "lvds-display-interface", "LVDS Display Interface Notes", "LVDS display notes for panel timing, channel mapping, power sequencing, and signal validation.", "LVDS panels are common in industrial displays because they are stable, widely available, and suitable for moderate cable lengths. Integration depends on the correct timing, bit mapping, power sequence, and backlight behavior.", ["Timing", "LVDS lanes", "Panel power", "Backlight", "EMI"], ["drm", "dt", "kernel"]),
  page("display-integration", "rgb-tft-panel-timing", "RGB TFT Panel Timing Review", "RGB TFT timing review for data bus width, sync signals, pixel clock, and Linux panel configuration.", "Parallel RGB TFT panels look simple because they expose direct timing signals, but they can be sensitive to pixel clock, porch values, bus width, color order, and reset timing.", ["Pixel clock", "HSYNC", "VSYNC", "Data bus", "Panel driver"], ["drm", "dt", "kernel"]),
  page("display-integration", "hdmi-output-debugging", "HDMI Output Debugging", "HDMI debug notes for EDID, modes, hotplug detect, audio, and Linux DRM tooling.", "HDMI output debugging starts with link detection and display modes, then moves into color format, audio, hotplug behavior, and application rendering. It should be tested with more than one monitor.", ["HPD", "EDID", "Mode set", "Audio", "Compositor"], ["drm", "kernel"]),
  page("display-integration", "backlight-brightness-control", "Backlight and Brightness Control", "Backlight control notes for PWM, enable GPIO, current drivers, dimming range, and Linux interfaces.", "Backlight design affects readability, power consumption, thermal load, and perceived product quality. A panel can show the correct image but still fail product testing because brightness control is noisy, inverted, or inconsistent.", ["PWM", "Enable GPIO", "Driver IC", "Thermal", "Userspace"], ["drm", "dt", "kernel"]),

  page("hardware-modules", "rtc-backup-power", "RTC Backup Power and Timekeeping", "Notes on real-time clock circuits, backup batteries, Linux timekeeping, and product behavior after power loss.", "An RTC keeps system time when the main power supply is off. It is a small circuit, but it affects logs, certificates, scheduled actions, event records, and troubleshooting after a field device loses power.", ["RTC chip", "Backup cell", "I2C", "Kernel RTC", "Time sync"], ["rtc", "kernel"]),
  page("hardware-modules", "rs485-industrial-bus", "RS485 Interface Notes for Industrial Devices", "RS485 electrical and Linux software notes for Modbus, long cables, and noisy environments.", "RS485 remains common in industrial products because it supports differential signaling, long cable runs, and multi-drop communication. Reliable integration needs both electrical design and software timing.", ["Transceiver", "Termination", "Biasing", "Direction control", "Protocol test"], ["rs485", "kernel"]),
  page("hardware-modules", "can-bus-interface", "CAN Bus Interface for Embedded Linux", "CAN controller, transceiver, termination, and SocketCAN notes for Linux-based embedded devices.", "CAN bus is widely used in vehicles, industrial automation, battery systems, and distributed control products. On Linux, a useful validation path combines hardware checks with SocketCAN tools.", ["Controller", "Transceiver", "Termination", "SocketCAN", "Error counters"], ["can", "kernel", "dt"]),
  page("hardware-modules", "gpio-isolated-io", "GPIO and Isolated I/O Design Notes", "Notes on GPIO expansion, opto-isolated inputs, relay outputs, and Linux control paths.", "GPIO lines connect software to the physical world: buttons, relays, alarms, sensors, fixtures, and status outputs. In industrial products, GPIO design needs protection, clear ownership, and predictable boot states.", ["SoC GPIO", "Isolation", "Output driver", "libgpiod", "Factory test"], ["gpio", "kernel"]),

  page("hmi-development", "lvgl-on-linux", "LVGL on Embedded Linux", "Framebuffer, DRM, input, and performance notes when using LVGL on Linux devices.", "LVGL is a strong choice for compact HMIs that need predictable interaction without a heavy desktop stack. On Linux, the display backend, input path, redraw strategy, and asset sizes determine whether the UI feels responsive.", ["Display backend", "Input", "Assets", "Redraw", "Profiling"], ["lvgl", "drm", "input"]),
  page("hmi-development", "qt-embedded-hmi", "Qt Embedded HMI Stack Notes", "Practical considerations for Qt-based industrial HMI applications on embedded Linux.", "Qt is useful when an embedded HMI needs richer widgets, internationalization, complex layout, or a larger application structure. Platform plugin choice has a direct impact on graphics, input, and deployment.", ["QPA plugin", "Graphics", "Fonts", "Input", "Update"], ["qt", "drm", "input"]),
  page("hmi-development", "industrial-control-ui", "Industrial Control UI Structure", "How to structure screens, states, alarms, and operator workflows for industrial control interfaces.", "Industrial control UI design is different from a marketing interface. Operators need fast scanning, stable status areas, clear alarms, predictable navigation, and safe confirmation flows.", ["Status", "Navigation", "Alarm", "Trend", "Action"], ["qt", "lvgl"]),
  page("hmi-development", "lightweight-hmi-update-strategy", "Lightweight HMI Update Strategy", "Update and rollback notes for embedded HMI software on Linux devices.", "HMI update design should be planned before the first field release. A broken UI can make a device appear dead even when Linux is still running, so rollback and recovery paths matter.", ["Package", "Config", "Rollback", "Watchdog", "Logs"], ["kernel"]),
  page("hmi-development", "touch-calibration-ui-rotation", "Touch Calibration and UI Rotation", "Touch calibration, display rotation, and coordinate mapping notes for embedded HMI devices.", "Touch calibration and UI rotation must be handled consistently across kernel, compositor, toolkit, and application. Splitting rotation across layers often creates confusing behavior.", ["Panel rotation", "Input transform", "Toolkit", "Calibration", "QA"], ["input", "lvgl", "qt"]),
  page("hmi-development", "hmi-performance-testing", "HMI Performance Testing on Low-Power Boards", "A practical test plan for UI latency, redraw cost, boot time, and memory use on embedded boards.", "HMI performance should be measured under real interaction, not only on an idle screen. Low-power boards can pass a demo and still fail when logs, network traffic, and touch events happen together.", ["Boot time", "Frame time", "CPU", "Memory", "Thermal"], ["lvgl", "qt", "kernel"]),

  page("sbc-customization", "custom-carrier-board", "Custom Carrier Board Checklist", "A board-level checklist for adapting an SBC module to a production carrier board.", "A custom carrier board changes both hardware validation and software assumptions. Even when the compute module is stable, the carrier can alter power sequencing, display wiring, storage, USB, Ethernet, GPIO, and mechanical access.", ["Power", "Connectors", "Device tree", "Test pads", "Production"], ["dt", "kernel"]),
  page("sbc-customization", "industrial-sbc-design", "Industrial SBC Design Review", "Design review notes for industrial SBCs used in displays, gateways, and control devices.", "Industrial SBC design is a balance between compute module capability, I/O requirements, supply stability, thermal limits, lifecycle, and testability. The review should involve hardware, software, manufacturing, and service teams.", ["SoC", "Power", "I/O", "Thermal", "Lifecycle"], ["kernel", "dt"]),
  page("sbc-customization", "production-testing", "Production Testing for Embedded Boards", "Factory test strategy for embedded Linux boards and industrial panel products.", "Production testing should prove that every shipped board has working hardware, correct firmware, readable identity, and traceable results. A good test plan is designed with the product, not added at the end.", ["Fixture", "Firmware", "Peripherals", "Result log", "Traceability"], ["kernel"]),
  page("sbc-customization", "thermal-design-enclosed-sbc", "Thermal Design for Enclosed SBCs", "Thermal validation notes for fanless embedded boards and enclosed HMI products.", "Fanless embedded devices are limited by enclosure design, ambient temperature, processor load, display brightness, and power conversion losses. Thermal work should start before layout and continue through product validation.", ["Heat source", "Copper", "Enclosure", "Load test", "Throttle"], ["kernel"]),
  page("sbc-customization", "bom-lifecycle-control", "Long-Term Availability and BOM Control", "BOM and lifecycle notes for industrial SBC products with multi-year support requirements.", "Industrial products often need stable supply for years. BOM control is not only purchasing work; it affects drivers, calibration, mechanical fit, certifications, and field maintenance.", ["BOM", "Second source", "Firmware", "Qualification", "Change log"], ["kernel"]),
  page("sbc-customization", "board-revision-firmware", "Board Revision Tracking and Firmware Compatibility", "How to track board revisions and keep firmware compatible across production changes.", "Board revisions should be visible to software. Without revision tracking, one firmware image may behave differently across lots because GPIO assignments, display panels, PMIC settings, or peripheral options changed.", ["Revision ID", "Device tree", "EEPROM", "Firmware", "Factory log"], ["dt", "kernel"]),
];

function page(section, slug, title, description, summary, blocks, refKeys) {
  return { section, slug, title, description, summary, blocks, refKeys };
}

function svgFor(p) {
  const labels = p.blocks.slice(0, 5);
  const boxes = labels.map((label, i) => {
    const x = 60 + i * 170;
    return `<rect class="box" x="${x}" y="150" width="130" height="86" rx="8"/><text class="small" x="${x + 18}" y="198">${escapeXml(label)}</text>${i < labels.length - 1 ? `<path class="wire" d="M${x + 130} 193 H${x + 168}"/>` : ""}`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="420" viewBox="0 0 960 420" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(p.title)}</title>
  <desc id="desc">A simplified engineering flow diagram for ${escapeXml(p.title)}.</desc>
  <rect width="960" height="420" fill="#f7f8f5"/>
  <style>
    .box{fill:#fff;stroke:#d9ded8;stroke-width:2}
    .title{font:700 28px sans-serif;fill:#1f2522}
    .small{font:16px sans-serif;fill:#1f2522}
    .note{font:16px sans-serif;fill:#5b6661}
    .wire{stroke:#166a5b;stroke-width:4;fill:none;marker-end:url(#arrow)}
  </style>
  <defs><marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M2,2 L10,6 L2,10 Z" fill="#166a5b"/></marker></defs>
  <text class="title" x="58" y="82">${escapeXml(p.title)}</text>
  <text class="note" x="60" y="118">Review the hardware path, software binding, validation method, and production behavior together.</text>
  ${boxes}
  <rect x="60" y="292" width="820" height="58" rx="8" fill="#fff8f3" stroke="#b55228" stroke-width="2"/>
  <text class="note" x="88" y="327">A reliable product test should record board revision, firmware build, result, and failure evidence.</text>
</svg>
`;
}

function markdownFor(p) {
  const imagePath = `/images/${p.slug}.svg`;
  const tableRows = p.blocks.map((b, i) => `| ${b} | ${decisionText(b, i)} | ${riskText(b, i)} |`).join("\n");
  const refsMd = p.refKeys.map((key) => refs[key]).filter(Boolean).map(([name, url]) => `- [${name}](${url})`).join("\n");
  return `---
title: "${p.title}"
description: "${p.description}"
date: 2026-07-04
avontek_url: ""
---

${p.summary} This page is written as an engineering note rather than a marketing overview. The goal is to identify the design choices, bring-up checks, validation evidence, and production risks that should be visible before a board or panel product is released.

![${p.title}](${imagePath})

## System context

In a real product, ${lowerFirst(p.title)} is rarely isolated from the rest of the system. It interacts with power sequencing, connector choices, firmware configuration, device tree or board configuration, factory tests, and the final enclosure. A feature that works on an open bench can still fail in production if the cable length changes, the product warms up, a different peripheral is installed, or the software image handles errors differently.

The first review should connect the schematic, layout, firmware, and test plan. That review does not need to be complicated, but it should be explicit. Engineers should know which signal or driver owns the feature, how it is enabled during boot, what a normal log looks like, and what evidence proves that the function is stable.

## Design decisions

| Area | Engineering decision | Risk if ignored |
| --- | --- | --- |
${tableRows}

The table should be filled during design review and updated after the first prototype. Keeping these decisions in one place prevents the common problem where the schematic, firmware, and factory test procedure each describe a slightly different product.

## Bring-up checklist

A practical bring-up sequence should start with observable signals and only then move into application behavior:

${p.blocks.map((b) => "- Confirm " + lowerFirst(b) + " behavior against the schematic and board revision.").join("\n")}
- Capture a clean boot log and save it with the firmware build number.
- Record one passing test and at least one intentional failure case.
- Repeat the test after thermal soak, power cycling, and enclosure assembly.

During early validation, do not rely on a single successful boot. Many embedded failures are intermittent because they depend on timing, rail ramp, cable quality, interrupt noise, storage state, or temperature. A useful bring-up note includes both the pass condition and the failure evidence that was checked.

## Linux and firmware checks

Most embedded product features need a small set of repeatable software checks. The exact command depends on the platform, but the habit should be consistent: identify the kernel device, inspect logs, exercise the interface, and record the result.

\`\`\`sh
dmesg | tail -80
find /sys -maxdepth 3 -iname "*${p.slug.split("-")[0]}*" 2>/dev/null
ls -l /dev | head
\`\`\`

For a production-oriented test, prefer a script that prints a compact result line. A fixture or CI system can parse that output and store it with the serial number:

\`\`\`text
TEST_RESULT feature=${p.slug} board_rev=B2 firmware=2026.07.04 status=pass
\`\`\`

If the feature depends on device tree, bootloader variables, Android properties, or a userspace service, record those settings beside the test result. A board that passes today can fail after a minor firmware update if the configuration path is not documented.

## Common failure modes

The most common failures come from mismatched assumptions. Hardware may expose a signal with one polarity while software assumes another. A driver may probe successfully but use the wrong timing. A factory test may verify that a device node exists without proving that the external connector or real load works.

Another frequent issue is testing only in the easiest condition. The product should also be tested after repeated cold boots, during warm operation, with realistic cable length, with expected peripherals attached, and after unexpected power removal. For display or HMI products, include maximum brightness and touch interaction because those conditions change power, thermal behavior, and interrupt activity.

## Production validation

Before release, define what must be true for a unit to pass production. The answer should be measurable. A good factory procedure records the board revision, firmware version, test fixture version, feature result, and failure log. If a device comes back from the field, that record helps separate manufacturing defects from firmware regressions or installation problems.

For long-term maintenance, keep the validation method stable across board revisions. If the hardware changes, update the test procedure and make the difference visible in the release notes. Silent changes make root cause analysis much harder.

## References

${refsMd}
`;
}

function decisionText(block, i) {
  const options = ["Define the electrical and software owner", "Choose the validation interface", "Document timing and polarity", "Record production pass criteria", "Keep a revision-specific test note"];
  return options[i % options.length] + ` for ${lowerFirst(block)}`;
}

function riskText(block, i) {
  const risks = ["Driver probes but hardware does not work", "Factory test misses connector-level failure", "Boot behavior changes between revisions", "Field recovery has no useful evidence", "Future firmware breaks old hardware"];
  return risks[i % risks.length];
}

function lowerFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function escapeXml(value) {
  return value.replace(/[<>&"]/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[ch]));
}

for (const p of pages) {
  const contentDir = path.join(root, "content", p.section);
  const imageDir = path.join(root, "static", "images");
  fs.mkdirSync(contentDir, { recursive: true });
  fs.mkdirSync(imageDir, { recursive: true });
  fs.writeFileSync(path.join(contentDir, `${p.slug}.md`), markdownFor(p));
  fs.writeFileSync(path.join(imageDir, `${p.slug}.svg`), svgFor(p));
}

console.log(`Generated ${pages.length} long-form pages and diagrams.`);
