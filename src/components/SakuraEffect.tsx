import React, { useEffect, useRef, useState } from 'react';

interface SakuraEffectProps {
    petalCount?: number;
    className?: string;
    interactive?: boolean;
}

interface Petal {
    x: number;
    y: number;
    size: number;
    speed: number;
    angle: number;
    rotation: number;
    rotationSpeed: number;
    flutter: number;
    opacity: number;
    color: string;
    vx: number; // velocity x for mouse interaction
    vy: number; // velocity y for mouse interaction
}

/**
 * Sakura Petals Falling Effect
 * Luxury ambient animation with mouse interaction
 */
const SakuraEffect: React.FC<SakuraEffectProps> = ({
    petalCount = 50, // Default count, can be overridden
    className = '',
    interactive = true
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const petalsRef = useRef<Petal[]>([]);
    const animationRef = useRef<number | null>(null);
    const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            if (interactive) {
                mouseRef.current = { x: e.clientX, y: e.clientY };
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Create petals
        const createPetals = () => {
            const petals: Petal[] = [];
            // Luxury pastel palette (Soft Pink, Champagne, Pearl, Peach)
            const colors = ['#FFB7C5', '#FFD1DC', '#F5EFE6', '#FFF0F5', '#FFE4E1'];

            for (let i = 0; i < petalCount; i++) {
                petals.push({
                    x: Math.random() * canvas.width,
                    y: -20 - Math.random() * canvas.height,
                    size: 4 + Math.random() * 6,
                    speed: 0.3 + Math.random() * 1.2,
                    angle: Math.random() * Math.PI * 2,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: 0.008 + Math.random() * 0.02,
                    flutter: 0.2 + Math.random() * 0.4,
                    opacity: 0.4 + Math.random() * 0.4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: 0,
                    vy: 0
                });
            }
            petalsRef.current = petals;
        };

        createPetals();

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            petalsRef.current.forEach((petal) => {
                // Mouse interaction - "parting" effect
                if (interactive) {
                    const dx = petal.x - mouseRef.current.x;
                    const dy = petal.y - mouseRef.current.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const repelRadius = 120; // Radius of influence

                    if (distance < repelRadius) {
                        // Apply repelling force
                        const force = (repelRadius - distance) / repelRadius;
                        const angle = Math.atan2(dy, dx);
                        petal.vx += Math.cos(angle) * force * 0.8;
                        petal.vy += Math.sin(angle) * force * 0.8;
                    }
                }

                // Apply velocity (with damping)
                petal.x += petal.vx;
                petal.y += petal.vy;
                petal.vx *= 0.92; // Damping
                petal.vy *= 0.92;

                // Natural falling motion
                petal.y += petal.speed;
                petal.x += Math.sin(petal.angle) * petal.flutter;
                petal.angle += 0.015;
                petal.rotation += petal.rotationSpeed;

                // Draw petal with enhanced luxury styling
                ctx.save();
                ctx.translate(petal.x, petal.y);
                ctx.rotate(petal.rotation);
                ctx.globalAlpha = petal.opacity;

                // Gradient fill for depth
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size);
                gradient.addColorStop(0, petal.color);
                gradient.addColorStop(1, petal.color + '80'); // Add transparency
                ctx.fillStyle = gradient;

                // Petal shape (more refined)
                ctx.beginPath();
                ctx.moveTo(0, -petal.size / 2);
                ctx.bezierCurveTo(
                    petal.size / 2, -petal.size / 3,
                    petal.size / 2, petal.size / 3,
                    0, petal.size / 2
                );
                ctx.bezierCurveTo(
                    -petal.size / 2, petal.size / 3,
                    -petal.size / 2, -petal.size / 3,
                    0, -petal.size / 2
                );
                ctx.closePath();
                ctx.fill();

                // Subtle glow for luxury effect
                ctx.shadowBlur = 4;
                ctx.shadowColor = petal.color;

                ctx.restore();

                // Reset petal when off screen
                if (petal.y > canvas.height + 50) {
                    petal.y = -20;
                    petal.x = Math.random() * canvas.width;
                    petal.vx = 0;
                    petal.vy = 0;
                } else if (petal.x < -50) {
                    petal.x = canvas.width + 20;
                } else if (petal.x > canvas.width + 50) {
                    petal.x = -20;
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [petalCount, interactive]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 ${className}`}
        />
    );
};

export default SakuraEffect;
