import React, { useEffect, useRef } from 'react';

// ─── COSMOS + SAKURA FUSION ───────────────────────────────────────────────────
// Sfondo void Dark Luxury con stelle animate + foglie sakura dorate
const CosmosBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // ── STELLE ────────────────────────────────────────────────────────────────
        const stars = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.1 + 0.2,
            o: Math.random() * 0.4 + 0.1,
            speed: Math.random() * 0.003 + 0.001,
            phase: Math.random() * Math.PI * 2,
        }));

        // ── PETALI SAKURA ─────────────────────────────────────────────────────────
        // Forma petalo come ellisse ruotata
        const PETAL_COUNT = 55;
        type Petal = {
            x: number; y: number;
            vx: number; vy: number;
            size: number;
            rotation: number;
            rotSpeed: number;
            swing: number;
            swingSpeed: number;
            swingPhase: number;
            opacity: number;
            fadeSpeed: number;
            // colore: oro/crema/alchemico per Dark Luxury
            hue: number; // 0=oro, 1=crema, 2=viola
        };

        // Paletta petali Dark Luxury
        const PETAL_COLORS = [
            { r: 201, g: 168, b: 76 }, // gold
            { r: 237, g: 217, b: 128 }, // gold-br
            { r: 240, g: 235, b: 224 }, // white/crema
            { r: 155, g: 116, b: 224 }, // alchimista viola (raro)
        ];

        const makePetal = (startFromTop = false): Petal => ({
            x: Math.random() * canvas.width,
            y: startFromTop ? -20 : Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: Math.random() * 0.8 + 0.3,
            size: Math.random() * 7 + 4,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.04,
            swing: Math.random() * 40 + 20,
            swingSpeed: Math.random() * 0.012 + 0.006,
            swingPhase: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.55 + 0.15,
            fadeSpeed: Math.random() * 0.001 + 0.0003,
            hue: Math.floor(Math.random() * 4),
        });

        const petals: Petal[] = Array.from({ length: PETAL_COUNT }, () => makePetal(false));

        // Disegna un petalo di sakura (ellisse ruotata)
        const drawPetal = (p: Petal) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            const c = PETAL_COLORS[p.hue];
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
            // Gradiente interno per effetto translucente
            const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
            grd.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.9)`);
            grd.addColorStop(0.6, `rgba(${c.r},${c.g},${c.b},0.55)`);
            grd.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0.0)`);
            ctx.fillStyle = grd;
            ctx.fill();
            ctx.restore();
            ctx.globalAlpha = 1;
        };

        // ── ORB AMBIENTALI ────────────────────────────────────────────────────────
        const orbs = [
            { x: 0.82, y: 0.08, r: 300, color: 'rgba(201,168,76,0.05)' },
            { x: 0.12, y: 0.82, r: 240, color: 'rgba(155,116,224,0.05)' },
            { x: 0.5, y: 0.45, r: 200, color: 'rgba(201,168,76,0.025)' },
        ];

        let frame = 0;
        let animId: number;

        const draw = () => {
            // Sfondo void
            ctx.fillStyle = '#06060F';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Orb ambientali
            orbs.forEach(orb => {
                const grd = ctx.createRadialGradient(
                    orb.x * canvas.width, orb.y * canvas.height, 0,
                    orb.x * canvas.width, orb.y * canvas.height, orb.r
                );
                grd.addColorStop(0, orb.color);
                grd.addColorStop(1, 'transparent');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(orb.x * canvas.width, orb.y * canvas.height, orb.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Stelle
            stars.forEach(s => {
                const op = s.o * (0.55 + 0.45 * Math.sin(frame * s.speed + s.phase));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(240,235,224,${op})`;
                ctx.fill();
            });

            // Petali
            petals.forEach((p, i) => {
                drawPetal(p);

                // Fisica
                p.x += p.vx + Math.sin(frame * p.swingSpeed + p.swingPhase) * 0.4;
                p.y += p.vy;
                p.rotation += p.rotSpeed;

                // Respawn quando escono dal basso
                if (p.y > canvas.height + 30) {
                    petals[i] = makePetal(true);
                    petals[i].x = Math.random() * canvas.width;
                }
                // Respawn quando escono dai lati
                if (p.x < -30) p.x = canvas.width + 20;
                if (p.x > canvas.width + 30) p.x = -20;
            });

            // Aggiungi nuovo petalo ogni 80 frame per mantenere densità
            if (frame % 80 === 0 && petals.length < PETAL_COUNT + 20) {
                petals.push(makePetal(true));
            }

            frame++;
            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
};

export default CosmosBackground;