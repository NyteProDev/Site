import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function ParticlesBackground() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
  id="tsparticles"
  init={particlesInit}
  options={{
    fullScreen: { enable: true, zIndex: -1 }, // met en fond
    background: {
      color: {
        value: "#066D3C" // même fond que ta section principale si tu veux du vert
      }
    },
    particles: {
      number: { value: 50 },
      color: { value: "#FFD700" }, // jaune doré
      shape: { type: "circle" },
      opacity: { value: 0.5 },
      size: { value: { min: 1, max: 4 } },
      move: { enable: true, speed: 0.8 }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 100 },
        push: { quantity: 4 }
      }
    }
  }}
/>
  );
}

export default ParticlesBackground;
