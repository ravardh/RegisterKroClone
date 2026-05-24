import sharp from "sharp";

const regions = [
  { name: "t-a", left: 780, top: 680, width: 320, height: 220 },
  { name: "t-b", left: 820, top: 720, width: 320, height: 220 },
  { name: "t-c", left: 880, top: 760, width: 320, height: 220 },
  { name: "t-d", left: 920, top: 680, width: 380, height: 280 },
];

for (const r of regions) {
  await sharp("src/assets/about2.png").extract(r).toFile(`src/assets/_debug_${r.name}.png`);
}
