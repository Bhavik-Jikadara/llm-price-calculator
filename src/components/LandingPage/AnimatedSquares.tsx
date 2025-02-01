import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSquares = () => {
    const lines = Array.from({ length: 20 });

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {lines.map((_, index) => (
                    <motion.line
                        key={index}
                        x1={Math.random() * 100 + '%'}
                        y1={Math.random() * 100 + '%'}
                        x2={Math.random() * 100 + '%'}
                        y2={Math.random() * 100 + '%'}
                        stroke="rgba(230, 215, 215, 0.1)"
                        strokeWidth="2"
                        animate={{
                            opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};

export default AnimatedSquares; 