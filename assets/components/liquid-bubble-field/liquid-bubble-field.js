(() => {
  const clamp = (min, value, max) => Math.max(min, Math.min(max, value));
  const initField = (field) => {
    if (field.dataset.liquidBubbleReady === "true") return;
    const stage = field.closest("[data-liquid-bubble-stage]");
    const links = [...field.querySelectorAll(".liquid-bubble")];
    if (!stage || !links.length) return;
    field.dataset.liquidBubbleReady = "true";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 3;
    const bodies = links.map((link) => ({ link, x:0, y:0, vx:0, vy:0, mass:1, pinned:false, renderedX:NaN, renderedY:NaN }));
    links.forEach((link, index) => {
      const light = { x:24,y:8,tx:24,ty:8,w:1,h:1,frame:0 };
      const renderLight = () => {
        light.x += (light.tx - light.x) * .115;
        light.y += (light.ty - light.y) * .115;
        link.style.setProperty("--light-x", `${light.x * light.w / 100 - light.w * .25}px`);
        link.style.setProperty("--light-y", `${light.y * light.h / 100 - light.h * .25}px`);
        if (Math.abs(light.tx-light.x)+Math.abs(light.ty-light.y)>.04) light.frame=requestAnimationFrame(renderLight); else light.frame=0;
      };
      const schedule = () => { if (!light.frame) light.frame=requestAnimationFrame(renderLight); };
      link.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;
        const rect=link.getBoundingClientRect(); light.w=rect.width; light.h=rect.height;
        light.tx=clamp(0,(event.clientX-rect.left)/Math.max(1,rect.width)*100,100);
        light.ty=clamp(0,(event.clientY-rect.top)/Math.max(1,rect.height)*100,100);
        link.style.setProperty("--magnetic-x",`${(light.tx-50)*.045}px`);
        link.style.setProperty("--magnetic-y",`${(light.ty-50)*.032}px`); schedule();
      });
      link.addEventListener("pointerenter",()=>{bodies[index].pinned=true;});
      link.addEventListener("pointerleave",()=>{bodies[index].pinned=false;light.tx=24;light.ty=8;link.style.setProperty("--magnetic-x","0px");link.style.setProperty("--magnetic-y","0px");schedule();});
    });
    let active=!reduced.matches, last=0, scrollImpulse=0, previousScroll=scrollY;
    const frameInterval=lowPower?22:15;
    const tick=(time=0)=>{
      if (!active) return;
      if (time-last>frameInterval) {
        const dt=clamp(.45,(time-last)/16.667,1.8); last=time;
        const bounds=field.getBoundingClientRect(); const rects=bodies.map(({link})=>link.getBoundingClientRect());
        bodies.forEach((body,i)=>{const rect=rects[i];body.mass=Math.max(.85,rect.width*rect.height/22000);if(!body.pinned){body.vx+=-body.x*.0065*dt;body.vy+=-body.y*.0065*dt;}if(rect.left<bounds.left+12)body.x+=bounds.left+12-rect.left;if(rect.right>bounds.right-12)body.x-=rect.right-bounds.right+12;if(rect.top<bounds.top+12)body.y+=bounds.top+12-rect.top;if(rect.bottom>bounds.bottom-12)body.y-=rect.bottom-bounds.bottom+12;});
        bodies.forEach((a,i)=>bodies.slice(i+1).forEach((b,offset)=>{const j=i+1+offset,ra=rects[i],rb=rects[j],dx=rb.left+rb.width/2-(ra.left+ra.width/2),dy=rb.top+rb.height/2-(ra.top+ra.height/2),distance=Math.max(1,Math.hypot(dx,dy)),overlap=Math.min(ra.width,ra.height)*.57+Math.min(rb.width,rb.height)*.57+24-distance;if(overlap<=0)return;const nx=dx/distance,ny=dy/distance,push=Math.min(18,overlap*.26);if(!a.pinned){a.x-=nx*push;a.y-=ny*push;}if(!b.pinned){b.x+=nx*push;b.y+=ny*push;}}));
        bodies.forEach((body,i)=>{if(!body.pinned){body.vy+=scrollImpulse*(i%2?-.02:.02)/body.mass;body.x=clamp(-170,body.x+body.vx*dt,170);body.y=clamp(-170,body.y+body.vy*dt,170);}body.vx*=Math.pow(.88,dt);body.vy*=Math.pow(.88,dt);const speed=Math.min(1,Math.hypot(body.vx,body.vy)/8),horizontal=Math.abs(body.vx)>=Math.abs(body.vy),stretch=speed*.06;body.link.style.setProperty("--physics-x",`${body.x.toFixed(2)}px`);body.link.style.setProperty("--physics-y",`${body.y.toFixed(2)}px`);body.link.style.setProperty("--stretch-x",(horizontal?stretch:-stretch*.42).toFixed(3));body.link.style.setProperty("--stretch-y",(horizontal?-stretch*.42:stretch).toFixed(3));});
        scrollImpulse*=.16;
      }
      requestAnimationFrame(tick);
    };
    new IntersectionObserver(([entry])=>{const was=active;active=!reduced.matches&&entry.isIntersecting;if(active&&!was)requestAnimationFrame(tick);},{rootMargin:"15%"}).observe(stage);
    addEventListener("scroll",()=>{const next=scrollY;scrollImpulse=clamp(-90,scrollImpulse+next-previousScroll,90);previousScroll=next;},{passive:true});
    document.addEventListener("visibilitychange",()=>{active=!document.hidden&&!reduced.matches;if(active)requestAnimationFrame(tick);});
    requestAnimationFrame(tick);
  };
  const init=(root=document)=>root.querySelectorAll("[data-liquid-bubble-field]").forEach(initField);
  window.EALiquidBubbleField={init};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>init());else init();
})();

