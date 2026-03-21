import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShaderAnimation({ style = {} }) {
  const containerRef = useRef(null);
  const sceneRef     = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`;

    const fragmentShader = `
      precision highp float;
      uniform vec2  resolution;
      uniform float time;

      void main(void) {
        vec2  uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t  = time * 0.05;
        float lw = 0.002;
        vec3 color = vec3(0.0);
        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 5; i++) {
            color[j] += lw * float(i*i)
              / abs(fract(t - 0.01*float(j) + float(i)*0.01)*5.0
                    - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }
        gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
      }
    `;

    const camera   = new THREE.Camera();
    camera.position.z = 1;
    const scene    = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time:       { type: "f",  value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    scene.add(new THREE.Mesh(geometry, material));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
    };
    onResize();
    window.addEventListener("resize", onResize);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose(); geometry.dispose(); material.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"hidden", ...style }} />;
}
