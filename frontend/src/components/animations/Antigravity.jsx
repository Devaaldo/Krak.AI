import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const Antigravity = () => {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Check if window exists (for SSR safety, though this is Vite)
    if (typeof window === 'undefined') return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies;

    engineRef.current = Engine.create();
    engineRef.current.world.gravity.y = 0;
    engineRef.current.world.gravity.x = 0;

    renderRef.current = Render.create({
      element: containerRef.current,
      engine: engineRef.current,
      options: {
        width: containerRef.current.clientWidth,
        height: 300,
        background: 'transparent',
        wireframes: false,
      }
    });

    const w = containerRef.current.clientWidth;
    const h = 300;

    const walls = [
      Bodies.rectangle(w/2, -25, w, 50, { isStatic: true }),
      Bodies.rectangle(w/2, h+25, w, 50, { isStatic: true }),
      Bodies.rectangle(-25, h/2, 50, h, { isStatic: true }),
      Bodies.rectangle(w+25, h/2, 50, h, { isStatic: true })
    ];

    const shapes = Array.from({ length: 25 }).map(() => {
      const radius = Math.random() * 15 + 10;
      return Bodies.circle(
        Math.random() * w,
        Math.random() * h,
        radius,
        {
          render: {
            fillStyle: '#2563eb',
            strokeStyle: '#1e3a8a',
            lineWidth: 2
          },
          restitution: 0.9,
          frictionAir: 0.001
        }
      );
    });

    World.add(engineRef.current.world, [...walls, ...shapes]);

    shapes.forEach(body => {
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8
      });
    });

    const mouse = Mouse.create(renderRef.current.canvas);
    const mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    World.add(engineRef.current.world, mouseConstraint);
    renderRef.current.mouse = mouse;

    Render.run(renderRef.current);
    runnerRef.current = Runner.create();
    Runner.run(runnerRef.current, engineRef.current);

    return () => {
      if (renderRef.current) {
        Render.stop(renderRef.current);
        if (renderRef.current.canvas && renderRef.current.canvas.parentNode) {
            renderRef.current.canvas.parentNode.removeChild(renderRef.current.canvas);
        }
      }
      if (engineRef.current) {
        World.clear(engineRef.current.world);
        Engine.clear(engineRef.current);
      }
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '300px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-alt)' }} 
    />
  );
};

export default Antigravity;
