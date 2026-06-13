(function () {
  const catalog = window.EA_CATALOG || {};
  const { esc } = window.EA_UTILS;

  const graphSurface = ({
    eyebrow,
    title,
    copy,
    coreLabel,
    coreCopy,
    nodes = [],
    actions = [],
    variant = "default",
  }) => `
    <section class="zone-card hero graph-surface graph-surface--${esc(variant)}" data-graph-surface>
      <div class="graph-surface__content">
        <div class="section-head">
          <p class="eyebrow">${esc(eyebrow)}</p>
          <h2>${esc(title)}</h2>
          <p class="lede">${esc(copy)}</p>
        </div>
        ${
          actions.length
            ? `
              <div class="button-row">
                ${actions
                  .map(
                    (action, index) =>
                      `<a class="button ${index === 0 ? "button--primary" : "button--secondary"}" href="${esc(action.href)}"${action.target ? ` target="${esc(action.target)}" rel="noreferrer"` : ""}>${esc(action.label)}</a>`,
                  )
                  .join("")}
              </div>
            `
            : ""
        }
      </div>
      <div class="graph-surface__stage">
        <canvas class="graph-surface__canvas" aria-hidden="true"></canvas>
        <div class="graph-surface__grid" aria-hidden="true"></div>
        <div class="graph-surface__halo" aria-hidden="true"></div>
        <div class="graph-surface__ring graph-surface__ring--outer" aria-hidden="true"></div>
        <div class="graph-surface__ring graph-surface__ring--inner" aria-hidden="true"></div>
        <div class="graph-surface__core" aria-hidden="true">
          <strong>${esc(coreLabel || title)}</strong>
          ${coreCopy ? `<small>${esc(coreCopy)}</small>` : ""}
        </div>
        ${nodes
          .map(
            (node, index) => {
              const tag = node.href ? "a" : "button";
              const label = node.label || `Node ${index + 1}`;
              const note = node.note || "";
              const attrs = [
                !node.href ? 'type="button"' : "",
                node.href ? `href="${esc(node.href)}"` : "",
                node.target ? `target="${esc(node.target)}" rel="noreferrer"` : "",
                `aria-label="${esc(note ? `${label} - ${note}` : label)}"`,
              ]
                .filter(Boolean)
                .join(" ");
              return `
                <${tag}
                  class="graph-surface__node"
                  data-graph-node
                  data-node-index="${index}"
                  data-node-label="${esc(label)}"
                  data-node-note="${esc(note)}"
                  ${attrs}
                  style="--x:${esc(node.x || "0rem")};--y:${esc(node.y || "0rem")};--z:${esc(node.z || "0rem")};--node-color:${esc(node.color || "rgba(234,220,207,0.9)")};"
                >
                </${tag}>
              `;
            },
          )
          .join("")}
      </div>
    </section>
  `;

  const crossNavigation = () =>
    graphSurface({
      eyebrow: "ATLAS",
      title: "A site held together by orbiting routes.",
      copy: "Pages stay linked through the same frame: work, research, archive, contact and the external stack.",
      coreLabel: catalog.ecosystem?.root || "Electronic Artefacts",
      coreCopy: "Central node",
      nodes: [
        { label: "WORK", note: "Projects", href: "./work.html", x: "-12rem", y: "-7rem", z: "-18rem", angle: "28deg", length: "13rem" },
        { label: "PROJECTS", note: "Routes", href: "./projects.html", x: "11rem", y: "-6rem", z: "16rem", angle: "-26deg", length: "12rem" },
        { label: "PROGRAMS", note: "Stack", href: "./programs.html", x: "-15rem", y: "1rem", z: "8rem", angle: "6deg", length: "14rem" },
        { label: "RESEARCH", note: "Fields", href: "./research.html", x: "14rem", y: "2rem", z: "-8rem", angle: "-8deg", length: "15rem" },
        { label: "ARCHIVE", note: "Fragments", href: "./archive.html", x: "-9rem", y: "10rem", z: "12rem", angle: "-44deg", length: "11rem" },
        { label: "ABOUT", note: "Lineage", href: "./about.html", x: "9rem", y: "11rem", z: "-14rem", angle: "-54deg", length: "10rem" },
        { label: "CONTACT", note: "Links", href: "./contact.html", x: "0rem", y: "-14rem", z: "6rem", angle: "90deg", length: "14rem" },
        { label: "VASTE", note: "External", href: "https://www.vaste.space/", target: "_blank", x: "0rem", y: "14rem", z: "-4rem", angle: "-90deg", length: "13rem", emphasis: true },
      ],
    });

  const uxSurface = (eyebrow, title, copy, metrics = [], links = []) =>
    graphSurface({
      eyebrow,
      title,
      copy,
      coreLabel: title,
      coreCopy: "Signal map",
      nodes: metrics.slice(0, 5).map((item, index) => {
        const positions = [
          { x: "-11rem", y: "-6rem", z: "-14rem", angle: "32deg" },
          { x: "10rem", y: "-7rem", z: "15rem", angle: "-30deg" },
          { x: "-13rem", y: "2rem", z: "10rem", angle: "8deg" },
          { x: "12rem", y: "3rem", z: "-10rem", angle: "-10deg" },
          { x: "0rem", y: "13rem", z: "4rem", angle: "-90deg" },
        ][index] || { x: "0rem", y: "0rem", z: "0rem", angle: "0deg" };
        return {
          label: item.value,
          note: item.label,
          x: positions.x,
          y: positions.y,
          z: positions.z,
          angle: positions.angle,
          length: index === 4 ? "13rem" : "12rem",
        };
      }),
      actions: links,
    });

  const nodesFromItems = (items = [], options = {}) =>
    items.slice(0, options.limit || 7).map((item, index) => ({
      label: options.labelFor ? options.labelFor(item, index) : item.title || item.name || `Node ${index + 1}`,
      note: options.noteFor ? options.noteFor(item, index) : item.type || item.statusLabel || item.category || "",
      href: options.hrefFor ? options.hrefFor(item, index) : item.route || item.href || "",
      target: options.targetFor ? options.targetFor(item, index) : "",
      x: options.positions?.[index]?.x || `${(index % 2 === 0 ? -1 : 1) * (10 + index * 2)}rem`,
      y: options.positions?.[index]?.y || `${(index - 2) * 3}rem`,
      z: options.positions?.[index]?.z || `${(index % 3 - 1) * 8}rem`,
      angle: options.positions?.[index]?.angle || `${(index % 2 === 0 ? 24 : -24)}deg`,
      length: options.positions?.[index]?.length || "14rem",
      emphasis: index === 0,
    }));

  const ecosystemExplorer = () => {
    const projects = catalog.projects?.length || 0;
    const programs = catalog.programs?.length || 0;
    const artefacts = catalog.artefacts?.length || 0;
    const research = catalog.researchFields?.length || 0;
    return uxSurface(
      "LAYER",
      "Signals in orbit.",
      "Quick routes, linked surfaces and current status, all held in one frame.",
      [
        { label: "Projects", value: String(projects), level: 76 },
        { label: "Programs", value: String(programs), level: 88 },
        { label: "Artefacts", value: String(artefacts), level: 64 },
        { label: "Research", value: String(research), level: 70 },
        { label: "Routes", value: "8", level: 92 },
      ],
      [
        { label: "Search", href: "./search.html" },
        { label: "Archive", href: "./archive.html" },
        { label: "VASTE", href: "https://www.vaste.space/", target: "_blank" },
      ],
    );
  };

  const startGraphSurfaceAnimation = () => {
    if (window.__graphSurfaceAnimationStarted) return;
    window.__graphSurfaceAnimationStarted = true;

    const surfaces = [...document.querySelectorAll("[data-graph-surface]")];
    if (!surfaces.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const contexts = surfaces
      .map((surface) => {
        const stage = surface.querySelector(".graph-surface__stage");
        const canvas = surface.querySelector(".graph-surface__canvas");
        const ctx = canvas?.getContext("2d");
        const nodes = [...surface.querySelectorAll("[data-graph-node]")].map((el) => ({
          el,
          label: el.dataset.nodeLabel || el.textContent.trim(),
          color: el.style.getPropertyValue("--node-color") || "rgba(234,220,207,0.9)",
          dragX: 0,
          dragY: 0,
          currentX: 0,
          currentY: 0,
          pointerX: 0,
          pointerY: 0,
          isDragging: false,
        }));

        if (!stage || !canvas || !ctx || !nodes.length) return null;
        return {
          surface,
          stage,
          canvas,
          ctx,
          nodes,
          phase: Math.random() * Math.PI * 2,
          activePointerId: null,
        };
      })
      .filter(Boolean);

    if (!contexts.length) return;

    const resize = (context) => {
      const rect = context.stage.getBoundingClientRect();
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      context.canvas.width = Math.max(1, Math.round(rect.width * dpr));
      context.canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.canvas.style.width = `${rect.width}px`;
      context.canvas.style.height = `${rect.height}px`;
      context.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.width = rect.width;
      context.height = rect.height;
      context.centerX = rect.width / 2;
      context.centerY = rect.height / 2;
      context.minDim = Math.min(rect.width, rect.height);
    };

    contexts.forEach(resize);

    const setNodeDragging = (context, nodeIndex, dragging) => {
      const node = context.nodes[nodeIndex];
      if (!node) return;
      node.el.classList.toggle("is-dragging", dragging);
      node.isDragging = dragging;
    };

    const drawNode = (ctx, node, cx, cy, radius, pulse, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "rgba(255,255,255,0.18)";
      ctx.shadowBlur = 14 * pulse;
      ctx.lineWidth = 1.1 + pulse * 0.65;
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(3.2, radius * 0.28), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "600 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(node.label, 0, radius + 8);
      ctx.restore();
    };

    let rafId = 0;
    const render = () => {
      contexts.forEach((context) => {
        if (!document.body.contains(context.surface)) return;

        const rect = context.stage.getBoundingClientRect();
        if (rect.width !== context.width || rect.height !== context.height) {
          resize(context);
        }

        const { ctx, width, height, centerX, centerY, minDim } = context;
        const t = performance.now() * 0.001;

        ctx.clearRect(0, 0, width, height);

        const bg = ctx.createRadialGradient(centerX, centerY, minDim * 0.02, centerX, centerY, minDim * 0.72);
        bg.addColorStop(0, "rgba(234,220,207,0.08)");
        bg.addColorStop(0.45, "rgba(255,255,255,0.02)");
        bg.addColorStop(1, "rgba(0,0,0,0.04)");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += Math.max(52, width / 10)) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += Math.max(44, height / 8)) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        const orbit1 = minDim * 0.38;
        const orbit2 = minDim * 0.22;
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbit1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbit2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(22, minDim * 0.08), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(234,220,207,0.12)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.88)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const positions = context.nodes.map((node, index) => {
          const angle = t * 0.25 + index * (Math.PI * 2 / context.nodes.length);
          const radiusBase = orbit1 - 26 - index * 5;
          const wobble = Math.sin(t * 1.2 + index) * 12;
          const depth = Math.sin(t * 0.9 + index * 1.3);
          const baseX = centerX + Math.cos(angle) * (radiusBase + wobble * 0.25);
          const baseY = centerY + Math.sin(angle * 0.95) * (orbit2 + wobble * 0.15);
          const x = node.isDragging ? node.pointerX : baseX + node.dragX;
          const y = node.isDragging ? node.pointerY : baseY + node.dragY;
          const radius = 14 + (depth + 1) * 4;
          const pulse = 0.7 + (Math.sin(t * 2 + index) + 1) * 0.2;
          node.currentX = x;
          node.currentY = y;
          node.baseX = baseX;
          node.baseY = baseY;
          return { node, x, y, radius, pulse, depth };
        });

        positions.forEach((item) => {
          ctx.strokeStyle = "rgba(255,255,255,0.26)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(item.x, item.y);
          ctx.stroke();
        });

        positions.forEach((item, index) => {
          const next = positions[(index + 1) % positions.length];
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(item.x, item.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        });

        positions.forEach((item) => {
          const z = Math.round(item.depth * 28);
          item.node.el.style.transform = `translate3d(calc(-50% + ${item.x - centerX}px), calc(-50% + ${item.y - centerY}px), ${z}px)`;
          drawNode(ctx, item.node, item.x, item.y, item.radius, item.pulse, 0.68 + item.depth * 0.12);
        });
      });

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", () => contexts.forEach(resize), { passive: true });

    const onPointerMove = (event) => {
      if (!window.__graphSurfaceDrag) return;
      const drag = window.__graphSurfaceDrag;
      const context = drag.context;
      const node = context?.nodes?.[drag.nodeIndex];
      if (!context || !node) return;

      const rect = context.stage.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;

      if (Math.abs(px - drag.pointerStartX) > 2 || Math.abs(py - drag.pointerStartY) > 2) {
        context.dragMoved = true;
      }

      node.pointerX = px;
      node.pointerY = py;
    };

    const onPointerUp = () => {
      if (!window.__graphSurfaceDrag) return;
      const { context, nodeIndex } = window.__graphSurfaceDrag;
      const node = context.nodes[nodeIndex];
      if (node) {
        const baseX = Number.isFinite(node.baseX) ? node.baseX : node.currentX;
        const baseY = Number.isFinite(node.baseY) ? node.baseY : node.currentY;
        node.dragX = node.pointerX - baseX;
        node.dragY = node.pointerY - baseY;
      }
      setNodeDragging(context, nodeIndex, false);
      context.activePointerId = null;
      window.__graphSurfaceDrag = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    contexts.forEach((context) => {
      context.nodes.forEach((node, nodeIndex) => {
        node.el.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          const rect = context.stage.getBoundingClientRect();
          const pointerX = event.clientX - rect.left;
          const pointerY = event.clientY - rect.top;

          window.__graphSurfaceDrag = {
            context,
            nodeIndex,
            pointerStartX: pointerX,
            pointerStartY: pointerY,
          };
          context.dragMoved = false;
          context.activePointerId = event.pointerId;
          node.pointerX = pointerX;
          node.pointerY = pointerY;
          setNodeDragging(context, nodeIndex, true);
          node.el.setPointerCapture?.(event.pointerId);
          window.addEventListener("pointermove", onPointerMove);
          window.addEventListener("pointerup", onPointerUp);
          window.addEventListener("pointercancel", onPointerUp);
        });

        node.el.addEventListener("click", (event) => {
          if (context.dragMoved) {
            event.preventDefault();
            event.stopPropagation();
          }
          context.dragMoved = false;
        });
      });
    });

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  };

  const pageLens = (type) => {
    const configs = {
      work: {
        eyebrow: "WORK LENS",
        title: "Work in orbit.",
        copy: "Projects, roles and signals stay on the same plane.",
        nodes: nodesFromItems((catalog.projects || []).filter((item) => item.visibility !== "internal"), {
          limit: 6,
          labelFor: (item) => item.title,
          noteFor: (item) => item.category || item.statusLabel || "Project",
          hrefFor: (item) => `./project.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-15rem", y: "-8rem", z: "-15rem", angle: "20deg" },
            { x: "14rem", y: "-8rem", z: "15rem", angle: "-18deg" },
            { x: "-17rem", y: "0rem", z: "7rem", angle: "4deg" },
            { x: "17rem", y: "1rem", z: "-8rem", angle: "-6deg" },
            { x: "-10rem", y: "13rem", z: "11rem", angle: "-42deg" },
            { x: "10rem", y: "13rem", z: "-13rem", angle: "-48deg" },
          ],
        }),
        links: [
          { label: "Projects", href: "./projects.html" },
          { label: "Search", href: "./search.html" },
        ],
      },
      projects: {
        eyebrow: "PROJECT MAP",
        title: "Project constellation.",
        copy: "Each route keeps its own orbit.",
        nodes: nodesFromItems(catalog.projects || [], {
          limit: 7,
          labelFor: (item) => item.title,
          noteFor: (item) => item.program || item.category || item.statusLabel || "Project",
          hrefFor: (item) => `./project.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-16rem", y: "-9rem", z: "-16rem" },
            { x: "15rem", y: "-8rem", z: "15rem" },
            { x: "-18rem", y: "0rem", z: "10rem" },
            { x: "18rem", y: "1rem", z: "-10rem" },
            { x: "-10rem", y: "15rem", z: "11rem" },
            { x: "10rem", y: "15rem", z: "-11rem" },
            { x: "0rem", y: "-18rem", z: "6rem" },
          ],
        }),
        links: [
          { label: "Work", href: "./work.html" },
          { label: "Research", href: "./research.html" },
        ],
      },
      research: {
        eyebrow: "RESEARCH FIELD",
        title: "Theory, branching.",
        copy: "VOID expands into fields, notes and translations.",
        nodes: nodesFromItems(catalog.researchFields || [], {
          limit: 6,
          labelFor: (item) => item.title,
          noteFor: (item) => item.parent || item.type || "Field",
          hrefFor: (item) => `./entity.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-15rem", y: "-8rem", z: "-15rem" },
            { x: "15rem", y: "-7rem", z: "16rem" },
            { x: "-17rem", y: "1rem", z: "8rem" },
            { x: "17rem", y: "2rem", z: "-8rem" },
            { x: "-9rem", y: "14rem", z: "12rem" },
            { x: "9rem", y: "14rem", z: "-12rem" },
          ],
        }),
        links: [
          { label: "Programs", href: "./programs.html" },
          { label: "Archive", href: "./archive.html" },
        ],
      },
      programs: {
        eyebrow: "SYSTEM REGISTRY",
        title: "System lattice.",
        copy: "Lineage, grouping and status stay visible.",
        nodes: nodesFromItems(catalog.programs || [], {
          limit: 7,
          labelFor: (item) => item.title,
          noteFor: (item) => item.systemGroup || item.statusLabel || item.type,
          hrefFor: (item) => `./entity.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-16rem", y: "-9rem", z: "-16rem" },
            { x: "16rem", y: "-8rem", z: "16rem" },
            { x: "-18rem", y: "0rem", z: "10rem" },
            { x: "18rem", y: "1rem", z: "-10rem" },
            { x: "-10rem", y: "15rem", z: "12rem" },
            { x: "10rem", y: "15rem", z: "-12rem" },
            { x: "0rem", y: "-18rem", z: "6rem" },
          ],
        }),
        links: [
          { label: "VASTE", href: "https://www.vaste.space/", target: "_blank" },
          { label: "Research", href: "./research.html" },
        ],
      },
      archive: {
        eyebrow: "ARCHIVE CONSOLE",
        title: "Archive field.",
        copy: "Fragments, filters and links drift together.",
        nodes: nodesFromItems(catalog.artefacts || [], {
          limit: 7,
          labelFor: (item) => item.title,
          noteFor: (item) => item.category || item.type || item.statusLabel || "Artefact",
          hrefFor: (item) => `./artefact.html?id=${encodeURIComponent(item.id)}`,
          positions: [
            { x: "-16rem", y: "-8rem", z: "-14rem" },
            { x: "16rem", y: "-8rem", z: "14rem" },
            { x: "-18rem", y: "0rem", z: "8rem" },
            { x: "18rem", y: "1rem", z: "-8rem" },
            { x: "-10rem", y: "14rem", z: "12rem" },
            { x: "10rem", y: "14rem", z: "-12rem" },
            { x: "0rem", y: "-17rem", z: "6rem" },
          ],
        }),
        links: [
          { label: "Search", href: "./search.html" },
          { label: "Work", href: "./work.html" },
        ],
      },
      about: {
        eyebrow: "ECOSYSTEM VIEW",
        title: "Lineage map.",
        copy: "Method, pillars and network.",
        nodes: [
          { label: "VOID", note: "Theory", href: "./research.html", x: "-15rem", y: "-8rem", z: "-15rem" },
          { label: "PALIMPSESTS", note: "Art", href: "./work.html", x: "15rem", y: "-8rem", z: "15rem" },
          { label: "VASTE", note: "Technology", href: "https://www.vaste.space/", target: "_blank", x: "-17rem", y: "1rem", z: "8rem", emphasis: true },
          { label: "AtypikHouse", note: "Surface", href: "./projects.html", x: "17rem", y: "1rem", z: "-8rem" },
          { label: "CreativeStuff.jpg", note: "Archive", href: "./archive.html", x: "-10rem", y: "14rem", z: "12rem" },
          { label: "L’Œil de Meg", note: "Surface", href: "./work.html", x: "10rem", y: "14rem", z: "-12rem" },
        ],
        links: [
          { label: "Work", href: "./work.html" },
          { label: "Contact", href: "./contact.html" },
        ],
      },
      contact: {
        eyebrow: "CONTACT ROUTER",
        title: "Contact routes.",
        copy: "Email, social and external links.",
        nodes: [
          { label: "Email", note: "Direct", href: "mailto:electronic.artefacts@gmail.com", x: "-15rem", y: "-8rem", z: "-14rem" },
          { label: "Instagram", note: "Social", href: "https://www.instagram.com/", target: "_blank", x: "15rem", y: "-8rem", z: "14rem" },
          { label: "VASTE", note: "External", href: "https://www.vaste.space/", target: "_blank", x: "-17rem", y: "1rem", z: "8rem" },
          { label: "Archive", note: "Browse", href: "./archive.html", x: "17rem", y: "1rem", z: "-8rem" },
        ],
        links: [
          { label: "Email", href: "mailto:electronic.artefacts@gmail.com" },
          { label: "Archive", href: "./archive.html" },
        ],
      },
    };
    const config = configs[type];
    if (!config) return "";
    return graphSurface({
      eyebrow: config.eyebrow,
      title: config.title,
      copy: config.copy,
      coreLabel: config.title,
      coreCopy: "Page graph",
      nodes: config.nodes || [],
      actions: config.links || [],
      variant: type,
    });
  };


  window.EA_SURFACE = {
    graphSurface,
    crossNavigation,
    uxSurface,
    nodesFromItems,
    ecosystemExplorer,
    startGraphSurfaceAnimation,
    pageLens,
  };
})();
