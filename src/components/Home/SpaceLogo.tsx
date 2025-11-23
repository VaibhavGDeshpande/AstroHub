import React from 'react';
import Image from 'next/image';

interface SpaceLogoProps {
    scrollY: number;
}

const SpaceLogo: React.FC<SpaceLogoProps> = ({ scrollY }) => {
    return (
        <div className={`relative transition-all duration-300 ${scrollY > 50 ? 'w-32' : 'w-40'}`}>
            <Image
                src="/assets/AstroHub.avif"
                alt="AstroHub Logo"
                width={160}
                height={40}
                className="object-contain w-full h-auto"
                priority
                sizes="(max-width: 768px) 128px, 160px"
            />
        </div>
    );
};

export default SpaceLogo;
