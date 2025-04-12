# 🧱 MUI Grid - Usage Guide

This guide provides practical examples and best practices for using the new `Grid` component from MUI.

> ✅ The Grid system is built on **Flexbox**, not CSS Grid. Use it for fluid, responsive layouts with predictable column spans.

---

## 📦 Basic Usage

Wrap your layout in a container and use child Grid items with column sizes.

```tsx
<Grid container spacing={2}>
  <Grid size={8}>
    <Item>size=8</Item>
  </Grid>
  <Grid size={4}>
    <Item>size=4</Item>
  </Grid>
</Grid>
```

- `container`: enables flex container behavior.
- `size`: column span out of 12 (default).
- `spacing`: controls space between items.

---

## 🔁 Responsive Breakpoints

Define different column spans per breakpoint.

```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6 }}>
    <Item>xs=12 sm=6</Item>
  </Grid>
  <Grid size={{ xs: 12, sm: 6 }}>
    <Item>xs=12 sm=6</Item>
  </Grid>
</Grid>
```

Supported breakpoints: `xs`, `sm`, `md`, `lg`, `xl`

---

## 📐 Row & Column Spacing

Customize spacing independently.

```tsx
<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  <Grid size={6}><Item>1</Item></Grid>
  <Grid size={6}><Item>2</Item></Grid>
</Grid>
```

---

## 🧬 Responsive Columns

Customize total columns across breakpoints.

```tsx
<Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
  {Array.from(Array(6)).map((_, index) => (
    <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
      <Item>{index + 1}</Item>
    </Grid>
  ))}
</Grid>
```

---

## 🧠 Auto Layout

Let items grow automatically to fill space.

```tsx
<Grid container spacing={2}>
  <Grid size="grow"><Item>Auto</Item></Grid>
  <Grid size={6}><Item>Fixed</Item></Grid>
  <Grid size="grow"><Item>Auto</Item></Grid>
</Grid>
```

---

## 🎯 Offsets

Push items to the right with `offset`.

```tsx
<Grid container spacing={3}>
  <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 0 }}>
    <Item>Offset Grid</Item>
  </Grid>
</Grid>
```

- `offset={2}` shifts the item right by 2 columns.
- `offset="auto"` aligns the item to the right.

---

## 🧱 Nested Grids

Use nested containers to build complex layouts.

```tsx
<Grid container spacing={2}>
  <Grid size={12}>
    <Grid container spacing={2}>
      <Grid size={6}><Item>Nested 1</Item></Grid>
      <Grid size={6}><Item>Nested 2</Item></Grid>
    </Grid>
  </Grid>
</Grid>
```

> Nested containers inherit `spacing` and `columns` unless overridden.

---

## 🎛 Custom Breakpoints

Extend breakpoints via theme.

```ts
const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1280,
    },
  },
});
```

Use in Grid:

```tsx
<Grid container spacing={{ tablet: 2, laptop: 3 }}>
  <Grid size={{ mobile: 6, tablet: 4, laptop: 3 }}>
    <Item>Custom Breakpoint</Item>
  </Grid>
</Grid>
```

---

## 🎨 Centering Content

Use `display="flex"` on items:

```tsx
<Grid container spacing={2} minHeight={160}>
  <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
    <Avatar src="/avatar.jpg" />
  </Grid>
</Grid>
```

---

## ⚠️ Limitations

- No **row-spanning** — use CSS Grid for that.
- `direction="column"` not supported for layout flow — use `Stack` instead.
- `Grid` is for **layout**, not data tables. Use `DataGrid` for tabular content.

---

## ✅ Best Practices

- Use `Grid` for horizontal layouts.
- Use `Stack` for vertical stacking.
- Avoid mixing non-Grid elements between containers and items.
- Use `sx` for custom styles, spacing, and responsiveness.
