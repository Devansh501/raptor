import React from 'react';
import { motion } from 'framer-motion';

export const LabLoader = () => {
    const DURATION = 4;

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div className="relative w-80 h-40">
                <motion.svg
                    viewBox="0 0 240 120"
                    className="w-full h-full drop-shadow-xl overflow-visible"
                    initial="hidden"
                    animate="visible"
                >
                    <defs>
                        <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="white" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="white" stopOpacity="0.3" />
                        </linearGradient>
                        <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>

                        <clipPath id="flaskInnerClip">
                            <path d="M-9 0 L-9 35 L-34 90 Q-39 99 0 99 Q39 99 34 90 L9 35 L9 0 Z" />
                        </clipPath>
                    </defs>

                    {/* --- DECK --- */}
                    <line x1="10" y1="110" x2="230" y2="110" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />

                    {/* --- FLASK (Erlenmeyer) at x=50 --- */}
                    <g transform="translate(50, 10)">
                        <g clipPath="url(#flaskInnerClip)">
                            <motion.rect
                                x="-50" y="0" width="100" height="110"
                                fill="url(#liquidGradient)"
                                opacity="0.8"
                                animate={{
                                    y: [50, 80, 80, 50]
                                }}
                                transition={{
                                    duration: DURATION,
                                    times: [0, 0.3, 0.8, 1],
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </g>

                        <path
                            d="M-10 0 L-10 35 L-35 90 Q-40 100 0 100 Q40 100 35 90 L10 35 L10 0 Z"
                            fill="url(#glassGradient)"
                            stroke="#94a3b8"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                        />
                        <path d="M-10 0 L-10 10 L10 10 L10 0 Z" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" />
                        <rect x="-12" y="-2" width="24" height="4" rx="1" fill="#cbd5e1" />
                        <line x1="-10" y1="60" x2="10" y2="60" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" />
                        <line x1="-15" y1="80" x2="15" y2="80" stroke="#cbd5e1" strokeWidth="1" opacity="0.5" />
                    </g>

                    {/* --- MICROPLATE (96-Well Side View) at x=160 --- */}
                    <g transform="translate(160, 10)">
                        {/* Plate Skirt/Base - Top at y=85, Bottom at y=100 (Global 95-110) */}
                        <path
                            d="M-40 85 L-40 100 L40 100 L40 85 L-40 85 Z"
                            fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5"
                        />
                        {/* Plate Top Block - DEEPENED: Top at y=70 (Global 80) */}
                        <path
                            d="M-42 85 L42 85 L42 70 L-42 70 Z"
                            fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"
                        />
                        {/* Wells Detail (Ridges) - y=72 to 85 (Global 82-95) matches block bottom */}
                        {[-30, -15, 0, 15, 30].map(x => (
                            <rect key={x} x={x - 5} y="72" width="10" height="13" rx="1" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
                        ))}

                        {/* Liquid Filling ENTIRE Plate Width */}
                        <motion.rect
                            x="-40" y="85" width="80" height="0"
                            fill="#3b82f6"
                            opacity="0.9"
                            animate={{
                                y: [15, 15, 5, 15],
                                height: [0, 0, 10, 0]
                            }}
                            transition={{
                                duration: DURATION,
                                times: [0, 0.6, 0.8, 1],
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </g>

                    {/* --- PIPETTE (Single Channel) --- */}
                    <motion.g
                        initial={{ x: 50, y: 0 }}
                        animate={{
                            x: [50, 50, 160, 160, 50],
                            y: [0, 50, 10, 15, 0]
                        }}
                        transition={{
                            duration: DURATION,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.25, 0.5, 0.75, 1]
                        }}
                    >
                        {/* Pipette Handle/Body */}
                        <path
                            d="M-5 -20 L5 -20 L5 20 L2 40 L-2 40 L-5 20 Z"
                            fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5"
                        />
                        <rect x="-3" y="-28" width="6" height="8" rx="1" fill="#94a3b8" />
                        <path d="M5 0 L8 10 L5 10 Z" fill="#94a3b8" />

                        {/* Disposable Tip */}
                        <path
                            d="M-2.5 40 L2.5 40 L0.5 60 L-0.5 60 Z"
                            fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="0.5"
                        />

                        {/* Liquid in Tip */}
                        <motion.path
                            d="M-2 42 L2 42 L0 58 Z"
                            fill="#3b82f6"
                            opacity="0"
                            animate={{
                                opacity: [0, 1, 1, 0, 0]
                            }}
                            transition={{
                                duration: DURATION,
                                times: [0, 0.25, 0.5, 0.75, 1],
                                repeat: Infinity,
                            }}
                        />

                        {/* Droplets */}
                        {/* 
                            Recalibrated Global Analysis:
                            - Pipette Group Y = 15.
                            - Plate Y = 10.
                            - New Well Bottom = 85 (Local) -> 95 (Global).
                            - Droplet Target Local = 95 - 15 = 80.
                        */}
                        <motion.circle
                            cx="0" cy="62" r="2" fill="#3b82f6"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 0, 1, 0],
                                cy: [62, 62, 80, 82]
                            }}
                            transition={{
                                duration: DURATION,
                                times: [0, 0.65, 0.75, 0.8],
                                repeat: Infinity
                            }}
                        />
                    </motion.g>

                </motion.svg>
            </div>

            <div className="mt-2 text-center">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">
                    Simulating Process...
                </p>
            </div>
        </div>
    );
};
