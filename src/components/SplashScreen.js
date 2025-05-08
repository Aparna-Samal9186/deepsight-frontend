import { useEffect, useState } from 'react';

const SplashScreen = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Initializing facial recognition systems...');

    useEffect(() => {
        document.title = "DeepSight | Loading...";
        const texts = [
            'Loading neural networks...',
            'Preparing age progression models...',
            'Initializing clothing recognition...',
            'Optimizing search algorithms...'
        ];

        const timer = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev + 2;

                if (newProgress === 20) setStatusText(texts[0]);
                if (newProgress === 45) setStatusText(texts[1]);
                if (newProgress === 70) setStatusText(texts[2]);
                if (newProgress === 90) setStatusText(texts[3]);

                if (newProgress >= 100) {
                    clearInterval(timer);
                    setTimeout(() => onLoadingComplete(), 500);
                    return 100;
                }
                return newProgress;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [onLoadingComplete]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-800 to-gray-900 flex items-center justify-center z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white opacity-5"
                        style={{
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `pulse ${Math.random() * 3 + 2}s infinite alternate`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 text-center px-6 py-8 max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                    Deep<span className="text-gray-400">Sight</span>
                </h1>
                <p className="text-lg text-gray-300 opacity-90">
                    AI-Powered Facial Recognition for Missing Person Identification
                </p>

                <div className="relative w-48 h-48 mx-auto mb-8 rounded-full border-2 border-gray-500 border-opacity-30 overflow-hidden">
                    <div
                        className="absolute left-0 w-full h-0.5 bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.2)]"
                        style={{ top: `${progress}%` }}
                    />
                </div>

                <div className="w-full max-w-xs mx-auto mb-2">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>System Initialization</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-gray-200 to-white rounded-full transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <p className="text-gray-400 text-sm mt-4 italic">
                    {statusText}
                </p>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.05; transform: scale(0.95); }
                    100% { opacity: 0.2; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
