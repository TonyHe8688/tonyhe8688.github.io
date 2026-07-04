const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pages = {
  "embedded-linux/rockchip-bsp-notes": ["embedded-linux/u-boot-debugging", "embedded-linux/device-tree-display"],
  "embedded-linux/u-boot-debugging": ["embedded-linux/rockchip-bsp-notes", "embedded-linux/linux-kernel-driver-notes"],
  "embedded-linux/device-tree-display": ["display-integration/mipi-dsi-display", "hardware-modules/gpio-isolated-io"],
  "embedded-linux/buildroot-minimal-system": ["embedded-linux/linux-kernel-driver-notes", "sbc-customization/production-testing"],
  "embedded-linux/yocto-board-customization": ["sbc-customization/board-revision-firmware", "sbc-customization/bom-lifecycle-control"],
  "embedded-linux/linux-kernel-driver-notes": ["embedded-linux/device-tree-display", "hardware-modules/gpio-isolated-io"],

  "android-sbc/android-board-bringup": ["android-sbc/android-display-debugging", "android-sbc/touch-panel-integration"],
  "android-sbc/android-display-debugging": ["display-integration/mipi-dsi-display", "display-integration/backlight-brightness-control"],
  "android-sbc/touch-panel-integration": ["display-integration/capacitive-touch-panel", "hmi-development/touch-calibration-ui-rotation"],
  "android-sbc/industrial-android-panel": ["hmi-development/industrial-control-ui", "android-sbc/android-ota-recovery"],
  "android-sbc/android-ota-recovery": ["hmi-development/lightweight-hmi-update-strategy", "sbc-customization/board-revision-firmware"],
  "android-sbc/android-peripheral-validation": ["hardware-modules/rtc-backup-power", "hardware-modules/uart-debug-interface"],

  "display-integration/mipi-dsi-display": ["embedded-linux/device-tree-display", "display-integration/backlight-brightness-control"],
  "display-integration/capacitive-touch-panel": ["android-sbc/touch-panel-integration", "hmi-development/touch-calibration-ui-rotation"],
  "display-integration/lvds-display-interface": ["display-integration/backlight-brightness-control", "sbc-customization/custom-carrier-board"],
  "display-integration/rgb-tft-panel-timing": ["display-integration/backlight-brightness-control", "embedded-linux/device-tree-display"],
  "display-integration/hdmi-output-debugging": ["hmi-development/qt-embedded-hmi", "embedded-linux/linux-kernel-driver-notes"],
  "display-integration/backlight-brightness-control": ["display-integration/mipi-dsi-display", "sbc-customization/thermal-design-enclosed-sbc"],

  "hardware-modules/poe-power-module": ["sbc-customization/thermal-design-enclosed-sbc", "hardware-modules/rs485-industrial-bus"],
  "hardware-modules/uart-debug-interface": ["embedded-linux/u-boot-debugging", "sbc-customization/production-testing"],
  "hardware-modules/rtc-backup-power": ["android-sbc/android-peripheral-validation", "sbc-customization/production-testing"],
  "hardware-modules/rs485-industrial-bus": ["hardware-modules/gpio-isolated-io", "sbc-customization/custom-carrier-board"],
  "hardware-modules/can-bus-interface": ["embedded-linux/linux-kernel-driver-notes", "sbc-customization/production-testing"],
  "hardware-modules/gpio-isolated-io": ["embedded-linux/device-tree-display", "sbc-customization/custom-carrier-board"],

  "hmi-development/lvgl-on-linux": ["display-integration/capacitive-touch-panel", "hmi-development/hmi-performance-testing"],
  "hmi-development/qt-embedded-hmi": ["display-integration/hdmi-output-debugging", "hmi-development/industrial-control-ui"],
  "hmi-development/industrial-control-ui": ["hmi-development/touch-calibration-ui-rotation", "android-sbc/industrial-android-panel"],
  "hmi-development/lightweight-hmi-update-strategy": ["android-sbc/android-ota-recovery", "sbc-customization/board-revision-firmware"],
  "hmi-development/touch-calibration-ui-rotation": ["display-integration/capacitive-touch-panel", "android-sbc/touch-panel-integration"],
  "hmi-development/hmi-performance-testing": ["hmi-development/lvgl-on-linux", "sbc-customization/thermal-design-enclosed-sbc"],

  "sbc-customization/custom-carrier-board": ["hardware-modules/gpio-isolated-io", "embedded-linux/device-tree-display"],
  "sbc-customization/industrial-sbc-design": ["hardware-modules/poe-power-module", "sbc-customization/thermal-design-enclosed-sbc"],
  "sbc-customization/production-testing": ["hardware-modules/uart-debug-interface", "android-sbc/android-peripheral-validation"],
  "sbc-customization/thermal-design-enclosed-sbc": ["hardware-modules/poe-power-module", "display-integration/backlight-brightness-control"],
  "sbc-customization/bom-lifecycle-control": ["sbc-customization/board-revision-firmware", "embedded-linux/yocto-board-customization"],
  "sbc-customization/board-revision-firmware": ["embedded-linux/yocto-board-customization", "sbc-customization/production-testing"],
};

function titleFor(key) {
  const file = path.join(root, "content", `${key}.md`);
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^title:\s+"([^"]+)"/m);
  return match ? match[1] : key.split("/").pop().replace(/-/g, " ");
}

function blockFor(key, targets) {
  const links = targets.map((target) => `[${titleFor(target)}](/${target}/)`);
  return `\n## Related engineering notes\n\nThis topic is usually reviewed together with ${links[0]} and ${links[1]}. Reading the related notes helps connect the board-level decision, software configuration, and production validation path before the design is frozen.\n`;
}

for (const [key, targets] of Object.entries(pages)) {
  const file = path.join(root, "content", `${key}.md`);
  let text = fs.readFileSync(file, "utf8");
  text = text.replace(/\n## Related engineering notes\n\nThis topic is usually reviewed together with .*?before the design is frozen\.\n/s, "\n");
  const block = blockFor(key, targets);
  if (text.includes("\n## Design decisions\n")) {
    text = text.replace("\n## Design decisions\n", `${block}\n## Design decisions\n`);
  } else if (text.includes("\n## Bring-up checklist\n")) {
    text = text.replace("\n## Bring-up checklist\n", `${block}\n## Bring-up checklist\n`);
  } else if (text.includes("\n## Hardware considerations\n")) {
    text = text.replace("\n## Hardware considerations\n", `${block}\n## Hardware considerations\n`);
  } else {
    text += block;
  }
  fs.writeFileSync(file, text);
}

console.log(`Added internal links to ${Object.keys(pages).length} pages.`);
