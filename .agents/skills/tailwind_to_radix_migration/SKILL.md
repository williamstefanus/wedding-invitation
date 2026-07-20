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

## 6. Dark Mode and Theme Cleanup
When setting up dark mode with Radix UI, be vigilant about lingering Tailwind classes and global CSS overrides:
- **Use `next-themes`**: Wrap the Radix `<Theme>` in `next-themes` `<ThemeProvider>` and bind `appearance={resolvedTheme}`.
- **Clean up hardcoded backgrounds**: Ensure layout files and page wrappers do not contain `bg-white`, `bg-slate-50`, or hardcoded style props like `backgroundColor: "white"`. Rely entirely on Radix UI's `hasBackground={true}` on the `<Theme>` tag to set the root background, or use `var(--color-surface)` / `var(--color-panel-solid)`.
- **Avoid Global CSS overriding `color-scheme`**: Never hardcode `color-scheme: light;` in global `.radix-themes` classes.
- **Avoid Hardcoding Theme Palettes**: Do not override Radix native scale variables (like `--crimson-1: #ffffff;`) in global CSS unless you are providing matching variables for dark mode (`.dark` or `.dark-theme`). Using Radix's native palettes ensures automatic light/dark switching out of the box.

## 7. Modal / Dialog Migration
When migrating custom modals (e.g., ones built with Tailwind classes like `fixed inset-0 bg-slate-900/50 z-50`):
- **Always rewrite them using Radix UI `Dialog` components** (`Dialog.Root`, `Dialog.Content`, `Dialog.Title`, etc.).
- Hardcoded Tailwind backgrounds and text colors inside custom modals often break during dark mode toggling. The native Radix `Dialog` handles focus trapping, accessibility, animations, and dark mode colors seamlessly.

## 8. Icon Dependencies
Radix UI's documentation often uses `@radix-ui/react-icons` (e.g., `InfoCircledIcon`, `Cross2Icon`) in their examples.
- **Do not blindly copy/paste imports from `@radix-ui/react-icons`** unless you are sure the package is installed.
- If the project is already using a different icon set (like `lucide-react`), find the equivalent icon (e.g., `AlertCircle` instead of `InfoCircledIcon`) to avoid introducing missing module build errors (`Module not found: Can't resolve '@radix-ui/react-icons'`).
