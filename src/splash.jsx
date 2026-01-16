import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import DarkVeil from './components/ui/DarkVeil'
import './index.css' // Import CSS for Tailwind

const Splash = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            fontFamily: 'sans-serif',
            userSelect: 'none',
            color: 'white',
            backgroundColor: '#000'
        }}>

            {/* Background */}
            <DarkVeil />

            {/* Foreground Content */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20
            }}>

                {/* Logo Animation */}
                <div style={{ marginBottom: '1.5rem', animation: 'fadeInDown 1s ease-out' }}>
                    <img src="/logo.png" alt="Microlit" style={{ width: '8rem', filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }} />
                </div>

                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.2em',
                    color: '#3b82f6', // blue-500
                    marginBottom: '0.5rem',
                    margin: 0
                }}>
                    MICROLIT
                </h1>
                <h2 style={{
                    fontSize: '1.25rem',
                    color: '#9ca3af', // gray-400
                    letterSpacing: '0.1em',
                    fontWeight: 300,
                    textTransform: 'uppercase',
                    marginTop: '10px'
                }}>
                    Automated Pipetting Station
                </h2>

                {/* Loading Bar */}
                <div style={{
                    marginTop: '3rem',
                    width: '12rem',
                    height: '4px',
                    backgroundColor: '#1f2937', // gray-800
                    borderRadius: '9999px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        backgroundColor: '#3b82f6', // blue-500
                        boxShadow: '0 0 10px #3b82f6',
                        animation: 'loading-bar 2s infinite linear'
                    }}></div>
                </div>
            </div>

            <style>{`
        @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
        }
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}

export default Splash;
