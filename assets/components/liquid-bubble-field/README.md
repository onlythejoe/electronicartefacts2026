# Liquid Bubble Field

Reusable, dependency-free CTA constellation extracted from the Palimpsests hero.
It preserves the liquid-glass rendering, pointer luminance, scroll impulse,
soft-body deformation, collision avoidance and adaptive frame budget without
coupling the component to a project page.

## Usage

Load `liquid-bubble-field.css` and `liquid-bubble-field.js`, then use:

```html
<div class="liquid-bubble-stage" data-liquid-bubble-stage>
  <nav class="liquid-bubble-field" data-liquid-bubble-field aria-label="Explore">
    <a class="liquid-bubble" href="#one"><span>First action</span></a>
    <a class="liquid-bubble" href="#two"><span>Second action</span></a>
    <a class="liquid-bubble" href="#three"><span>Third action</span></a>
  </nav>
</div>
```

The module initializes automatically. It also exposes
`window.EALiquidBubbleField.init(root)` for dynamically inserted markup.

## Contract

- The stage must be positioned and have a measurable height.
- Bubble anchors remain native links and keyboard accessible.
- `prefers-reduced-motion` disables physics.
- Low-power devices automatically use a reduced collision/frame budget.
- The runtime sleeps when the stage leaves the viewport or the tab is hidden.

Open `demo.html` through a local HTTP server to inspect the preserved model.

