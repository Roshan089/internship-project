import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Home() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near plane
      1000 // Far plane
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: true // Enable transparency
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xF5F5F5, 1); // Match background color
    
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5); // Position for good shadows
    scene.add(directionalLight);

    // Create arm components with proper hierarchy
    const upperArmGroup = new THREE.Group();
    const lowerArmGroup = new THREE.Group();

    // Upper arm
    const upperArmGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const upperArmMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    
    // Position upper arm to extend upward from origin
    upperArm.position.y = 1; // Move up by half its length to center at origin
    upperArm.rotation.x = 0; // Ensure it's perfectly vertical
    upperArmGroup.add(upperArm);
    
    // Lower arm
    const lowerArmGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const lowerArmMaterial = new THREE.MeshPhongMaterial({ color: 0xA9A9A9 });
    const lowerArm = new THREE.Mesh(lowerArmGeometry, lowerArmMaterial);
    
    // Position lower arm
    lowerArm.position.y = 1; // Center it within its group
    lowerArm.rotation.x = 0; // Ensure it's perfectly vertical
    lowerArmGroup.add(lowerArm);

    // Position lower arm group at the end of upper arm
    lowerArmGroup.position.y = 2; // Place at the top of upper arm
    upperArmGroup.add(lowerArmGroup); // Parent to upper arm group

    // Position the entire arm assembly at scene origin
    upperArmGroup.position.set(0, 0, 0);
    scene.add(upperArmGroup);

    // Camera positioning
    camera.position.set(5, 2, 8); // Position camera for good view of arm
    camera.lookAt(0, 2, 0); // Look at middle of the arm

    // Raycaster setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let selectedHandle = null;
    let previousMouseX = 0;
    let previousMouseY = 0;

    // Create rotation handles with exact specifications
    const handleGeometry = new THREE.SphereGeometry(0.1); // Exact 0.1 radius as specified
    const handleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0000FF,  // Exact blue color as specified
      transparent: true,
      opacity: 0.8,
      shininess: 30
    });
    
    // Shoulder handle at base of upper arm (0, 0, 0)
    const shoulderHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    shoulderHandle.position.set(0, 0, 0); // Exactly at origin
    upperArmGroup.add(shoulderHandle);
    
    // Elbow handle at junction (0, 2, 0)
    const elbowHandle = new THREE.Mesh(handleGeometry.clone(), handleMaterial.clone());
    elbowHandle.position.set(0, 0, 0); // At base of lower arm group (which is already at y=2)
    lowerArmGroup.add(elbowHandle);

    // Highlight handles on hover
    const highlightHandle = (handle) => {
      handle.material.opacity = 1;
      handle.scale.setScalar(1.2);
    };

    const unhighlightHandle = (handle) => {
      handle.material.opacity = 0.8;
      handle.scale.setScalar(1);
    };

    // Event handlers
    const onMouseDown = (event) => {
      event.preventDefault();
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([shoulderHandle, elbowHandle]);

      if (intersects.length > 0) {
        isDragging = true;
        selectedHandle = intersects[0].object;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
        document.body.style.cursor = 'grabbing';
      }
    };

    const onMouseMove = (event) => {
      if (isDragging && selectedHandle) {
        // Calculate delta movement
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;
        const rotationSensitivity = 0.01;

        // Apply rotation based on selected handle
        if (selectedHandle === shoulderHandle) {
          // Rotate upper arm around Y-axis
          upperArmGroup.rotation.y += deltaX * rotationSensitivity;
          // Add some Z-axis rotation for more natural movement
          const zRotation = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, 
            upperArmGroup.rotation.z - deltaY * rotationSensitivity));
          upperArmGroup.rotation.z = zRotation;
        } else if (selectedHandle === elbowHandle) {
          // Rotate lower arm around its local Y-axis
          lowerArmGroup.rotation.y += deltaX * rotationSensitivity;
          // Add constrained Z-axis rotation
          const zRotation = Math.max(-Math.PI * 0.8, Math.min(Math.PI * 0.8, 
            lowerArmGroup.rotation.z - deltaY * rotationSensitivity));
          lowerArmGroup.rotation.z = zRotation;
        }

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
        renderer.render(scene, camera);
      } else {
        // Hover effect
        const rect = canvasRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([shoulderHandle, elbowHandle]);

        // Reset all handles
        unhighlightHandle(shoulderHandle);
        unhighlightHandle(elbowHandle);
        document.body.style.cursor = 'default';

        if (intersects.length > 0) {
          highlightHandle(intersects[0].object);
          document.body.style.cursor = 'grab';
        }

        renderer.render(scene, camera);
      }
    };

    const onMouseUp = () => {
      if (selectedHandle) {
        unhighlightHandle(selectedHandle);
      }
      isDragging = false;
      selectedHandle = null;
      document.body.style.cursor = 'default';
    };

    // Add rotation constraints
    const constrainRotation = () => {
      // Constrain shoulder rotation
      upperArmGroup.rotation.z = Math.max(-Math.PI / 2, 
        Math.min(Math.PI / 2, upperArmGroup.rotation.z));

      // Constrain elbow rotation
      lowerArmGroup.rotation.z = Math.max(-Math.PI * 0.8, 
        Math.min(Math.PI * 0.8, lowerArmGroup.rotation.z));
    };

    // Update animation loop to include constraints
    const animate = () => {
      requestAnimationFrame(animate);
      constrainRotation();
      renderer.render(scene, camera);
    };

    // Add event listeners
    canvasRef.current.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation loop
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
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
      <canvas
        ref={canvasRef}
        className="w-full h-full border border-gray-300 rounded-lg shadow-sm"
      />
    </div>
  );
}
