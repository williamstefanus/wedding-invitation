import re

with open('src/theme/knotice-theme.css', 'r') as f:
    content = f.read()

# Replace :root knotic chestnut variables
content = re.sub(r'--knotice-chestnut-rose-50: #fcf5f4;', '--knotice-chestnut-rose-50: #fffcfc;', content)
content = re.sub(r'--knotice-chestnut-rose-100: #faebe9;', '--knotice-chestnut-rose-100: #fef8f7;', content)
content = re.sub(r'--knotice-chestnut-rose-200: #f5d8d6;', '--knotice-chestnut-rose-200: #fdece9;', content)
content = re.sub(r'--knotice-chestnut-rose-300: #edb7b4;', '--knotice-chestnut-rose-300: #ffddd8;', content)
content = re.sub(r'--knotice-chestnut-rose-400: #e28c8a;', '--knotice-chestnut-rose-400: #ffcfc8;', content)
content = re.sub(r'--knotice-chestnut-rose-500: #d36060;', '--knotice-chestnut-rose-500: #fabfb8;', content)
content = re.sub(r'--knotice-chestnut-rose-600: #bd4147;', '--knotice-chestnut-rose-600: #f1aba3;', content)
content = re.sub(r'--knotice-chestnut-rose-700: #9f3139;', '--knotice-chestnut-rose-700: #e79288;', content)
content = re.sub(r'--knotice-chestnut-rose-800: #852c35;', '--knotice-chestnut-rose-800: #ec5e55;', content)
content = re.sub(r'--knotice-chestnut-rose-900: #732832;', '--knotice-chestnut-rose-900: #df5049;', content)
content = re.sub(r'--knotice-chestnut-rose-950: #3f1217;', '--knotice-chestnut-rose-950: #c83c37;', content)

# Also update --crimson-a2 to --red-a2
content = re.sub(r'var\(--crimson-a2\)', 'var(--red-a2)', content)

# The new block
new_block = """
/* Custom Radix Red Palette Overrides */
.dark .radix-themes[data-accent-color="red"], .radix-themes.dark-theme[data-accent-color="red"] {
  --red-1: #1b1312;
  --red-2: #211513;
  --red-3: #3b1412;
  --red-4: #501210;
  --red-5: #611916;
  --red-6: #722622;
  --red-7: #8b3630;
  --red-8: #b34740;
  --red-9: #ec5e55;
  --red-10: #de5149;
  --red-11: #ff9084;
  --red-12: #ffd2cd;

  --red-a1: #f800000a;
  --red-a2: #f3070011;
  --red-a3: #fb0b002d;
  --red-a4: #fe070043;
  --red-a5: #ff1f1055;
  --red-a6: #fd3e2f68;
  --red-a7: #fe544683;
  --red-a8: #fe5e52ae;
  --red-a9: #ff645aeb;
  --red-a10: #ff5a51dc;
  --red-a11: #ff9084;
  --red-a12: #ffd2cd;

  --red-contrast: #fff;
  --red-surface: #30150e80;
  --red-indicator: #ec5e55;
  --red-track: #ec5e55;
}

@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    .dark .radix-themes[data-accent-color="red"], .radix-themes.dark-theme[data-accent-color="red"] {
      --red-1: oklch(19.7% 0.013 26.64);
      --red-2: oklch(21% 0.0202 26.64);
      --red-3: oklch(25.3% 0.0617 26.64);
      --red-4: oklch(29% 0.0935 26.64);
      --red-5: oklch(33.2% 0.1041 26.64);
      --red-6: oklch(38.2% 0.1083 26.64);
      --red-7: oklch(45% 0.1171 26.64);
      --red-8: oklch(54.2% 0.1424 26.64);
      --red-9: oklch(66.3% 0.1776 26.64);
      --red-10: oklch(62.4% 0.1776 26.64);
      --red-11: oklch(78.4% 0.1618 26.64);
      --red-12: oklch(90.1% 0.0507 26.64);

      --red-a1: color(display-p3 0.9922 0 0 / 0.03);
      --red-a2: color(display-p3 1 0.0118 0 / 0.051);
      --red-a3: color(display-p3 0.9961 0.0863 0 / 0.149);
      --red-a4: color(display-p3 1 0.1059 0 / 0.229);
      --red-a5: color(display-p3 1 0.2078 0.1098 / 0.297);
      --red-a6: color(display-p3 1 0.3137 0.2275 / 0.365);
      --red-a7: color(display-p3 1 0.3961 0.3255 / 0.467);
      --red-a8: color(display-p3 1 0.4392 0.3765 / 0.623);
      --red-a9: color(display-p3 1 0.4627 0.4039 / 0.848);
      --red-a10: color(display-p3 1 0.4275 0.3647 / 0.793);
      --red-a11: color(display-p3 1 0.6235 0.5608 / 0.937);
      --red-a12: color(display-p3 0.9961 0.851 0.8275 / 0.971);

      --red-contrast: #fff;
      --red-surface: color(display-p3 0.1647 0.0784 0.0588 / 0.5);
      --red-indicator: oklch(66.3% 0.1776 26.64);
      --red-track: oklch(66.3% 0.1776 26.64);
    }
  }
}

:root .radix-themes[data-accent-color="red"], .light .radix-themes[data-accent-color="red"], .radix-themes.light-theme[data-accent-color="red"] {
  --red-1: #fffcfc;
  --red-2: #fef8f7;
  --red-3: #fdece9;
  --red-4: #ffddd8;
  --red-5: #ffcfc8;
  --red-6: #fabfb8;
  --red-7: #f1aba3;
  --red-8: #e79288;
  --red-9: #ec5e55;
  --red-10: #df5049;
  --red-11: #c83c37;
  --red-12: #5f221e;

  --red-a1: #ff000003;
  --red-a2: #e0200008;
  --red-a3: #e8230016;
  --red-a4: #ff210027;
  --red-a5: #ff210037;
  --red-a6: #ee1a0047;
  --red-a7: #d917005c;
  --red-a8: #cc160077;
  --red-a9: #e30e00aa;
  --red-a10: #d20a00b6;
  --red-a11: #b90700c8;
  --red-a12: #4a0500e1;

  --red-contrast: #fff;
  --red-surface: #fef6f5cc;
  --red-indicator: #ec5e55;
  --red-track: #ec5e55;
}

@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    :root .radix-themes[data-accent-color="red"], .light .radix-themes[data-accent-color="red"], .radix-themes.light-theme[data-accent-color="red"] {
      --red-1: oklch(99.4% 0.0029 26.64);
      --red-2: oklch(98.4% 0.0072 26.64);
      --red-3: oklch(95.6% 0.0195 26.64);
      --red-4: oklch(92.7% 0.0431 26.64);
      --red-5: oklch(89.5% 0.0568 26.64);
      --red-6: oklch(85.5% 0.0689 26.64);
      --red-7: oklch(80.6% 0.0833 26.64);
      --red-8: oklch(74.4% 0.1052 26.64);
      --red-9: oklch(66.3% 0.1776 26.64);
      --red-10: oklch(62.4% 0.1792 26.64);
      --red-11: oklch(56% 0.1776 26.64);
      --red-12: oklch(34.2% 0.0903 26.64);

      --red-a1: color(display-p3 0.6745 0.0235 0.0235 / 0.012);
      --red-a2: color(display-p3 0.7569 0.1451 0.0196 / 0.032);
      --red-a3: color(display-p3 0.7647 0.1529 0.0078 / 0.083);
      --red-a4: color(display-p3 0.8431 0.1373 0.0078 / 0.15);
      --red-a5: color(display-p3 0.851 0.1333 0.0039 / 0.208);
      --red-a6: color(display-p3 0.8 0.1059 0.0039 / 0.271);
      --red-a7: color(display-p3 0.7373 0.102 0.0039 / 0.353);
      --red-a8: color(display-p3 0.6902 0.098 0.0039 / 0.455);
      --red-a9: color(display-p3 0.7804 0.0745 0 / 0.644);
      --red-a10: color(display-p3 0.7255 0.0627 0 / 0.691);
      --red-a11: color(display-p3 0.6392 0.0471 0 / 0.757);
      --red-a12: color(display-p3 0.2471 0.0235 0 / 0.871);

      --red-contrast: #fff;
      --red-surface: color(display-p3 0.9922 0.9647 0.9608 / 0.8);
      --red-indicator: oklch(66.3% 0.1776 26.64);
      --red-track: oklch(66.3% 0.1776 26.64);
    }
  }
}
"""

with open('src/theme/knotice-theme.css', 'w') as f:
    f.write(content + "\n" + new_block)

