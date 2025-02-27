import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Home() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000 
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xF5F5F5, 1); 
    
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create arm components
    const upperArmGroup = new THREE.Group();
    const lowerArmGroup = new THREE.Group();

    // Upper arm
    const upperArmGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const upperArmMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    upperArm.position.y = 1;
    upperArmGroup.add(upperArm);
    
    // Lower arm
    const lowerArmGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const lowerArmMaterial = new THREE.MeshPhongMaterial({ color: 0xA9A9A9 });
    const lowerArm = new THREE.Mesh(lowerArmGeometry, lowerArmMaterial);
    lowerArm.position.y = 1;
    lowerArmGroup.add(lowerArm);

    lowerArmGroup.position.y = 2;
    upperArmGroup.add(lowerArmGroup);
    upperArmGroup.position.set(0, 1, 0); // Position at shoulder height
    scene.add(upperArmGroup);

    // Camera positioning
    camera.position.set(5, 2, 8);
    camera.lookAt(0, 2, 0);

    // Mouse interaction setup
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let selectedPart = null;

    const onMouseDown = (event) => {
      isDragging = true;
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
      document.body.style.cursor = 'grabbing';
      selectedPart = upperArmGroup; // Select the shoulder for movement
    };

    const onMouseMove = (event) => {
      if (isDragging && selectedPart) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;
        const rotationSensitivity = 0.01;

        // Rotate shoulder around all axes
        upperArmGroup.rotation.x -= deltaY * rotationSensitivity;
        upperArmGroup.rotation.y += deltaX * rotationSensitivity;
        upperArmGroup.rotation.z += deltaY * rotationSensitivity;

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
        renderer.render(scene, camera);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      document.body.style.cursor = 'default';
      selectedPart = null;
    };

    // Add event listeners
    canvasRef.current.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvasRef.current?.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <canvas ref={canvasRef} className="w-full h-full border border-gray-300 rounded-lg shadow-sm" />
    </div>
  );
}
