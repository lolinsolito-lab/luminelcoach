import React from 'react';
import SakuraEffect from './SakuraEffect';

const CosmosBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#F5EFE6]">
            {/* Premium Pastel Gradient Background */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-[#F5EFE6] via-[#FFF0F5] to-[#FFE4E1] transition-opacity duration-1000"
            />

            {/* Soft Glow - Subtle warmth */}
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    background: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 228, 225, 0.4) 40%, transparent 80%)'
                }}
            />

            {/* Falling Petals Effect - High Density for "Rain" effect */}
            <div className="absolute inset-0 z-[2]">
                <SakuraEffect petalCount={150} />
            </div>
        </div>
    );
};

export default CosmosBackground;
