---
name: migrate_tailwind_to_radix
description: "Guidelines and lessons learned for migrating components from Tailwind CSS to Radix UI Themes."
---

# Migrating from Tailwind CSS to Radix UI

When migrating or refactoring UI components from Tailwind CSS to Radix UI Themes, keep these specific lessons in mind based on past project experience:

## 1. Strictly Typed Color Scales
Radix UI heavily enforces its own semantic color scale and will throw strict TypeScript errors if you pass invalid colors. You cannot use standard Tailwind colors.
- **Invalid**: `color="emerald"`, `color="rose"`, `color="slate"`, `color="cyan"`
- **Valid (Radix palette)**: `color="ruby"`, `color="crimson"`, `color="gray"`, `color="jade"`, `color="green"`, `color="blue"`, `color="iris"`, etc.
Always ensure you map Tailwind colors to their closest Radix equivalent.

## 2. Layout and Display Props
Radix UI components do not accept arbitrary CSS props (like `display`) directly unless explicitly defined in their API.
- **Do not** pass `display="block"` to typography components like `<Text>` or data-display components like `<Progress>`. It will throw a Type error.
- **Instead**, use the `as="div"` or `asChild` prop if you need block behavior, or simply wrap the component in a Radix `<Box>` or `<Flex>`.

## 3. Form Input Styling and Alignment
When using Radix `TextField.Root` and `TextField.Slot` (e.g., adding an eye icon for a password toggle):
- Radix automatically computes the necessary padding for the inner `<input>` when slots are present.
- **Avoid** manually overriding alignment (e.g., `textAlign: "center"`) or adding manual `paddingLeft`/`paddingRight` to `TextField.Root`. This will clash with Radix's internal padding calculations and cause asymmetric, misaligned placeholder text.
- Rely on standard left-alignment for forms and let Radix handle the slot spacing natively.

## 4. Reusable Spacing and Flex Props
Instead of using Tailwind utility classes (`mb-4`, `p-4`, `flex`, `flex-col`, `items-center`), use Radix UI layout components and its spacing scale (0-9):
- `<Flex direction="column" align="center" justify="between" gap="5">`
- `mb="4"`, `p="3"`, `px="2"`, `pt="5"`
Avoid mixing `className="flex flex-col"` on a Radix `<Box>` or `<Card>`. Use the native Radix layout props whenever possible for consistent design tokens.

## 5. CSS Variables for Custom Styling
When inline styling is unavoidable via the `style` prop, leverage Radix UI's injected CSS scale variables rather than hardcoded hex codes or Tailwind classes.
- **Example**: `backgroundColor: "var(--crimson-3)"`
- **Example**: `color: "var(--gray-11)"`
- **Example**: `borderTop: "1px solid var(--gray-4)"`
