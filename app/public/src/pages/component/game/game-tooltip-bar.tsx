import React from 'react';

interface GameTooltipBarProps {
    value: number;
    maxValue: number;
    type: 'HP' | 'PP';
    graduationStep?: number;
}

const BAR_COLORS = {
    HP: '#e74c3c',
    PP: '#3498db',
};

export const GameTooltipBar: React.FC<GameTooltipBarProps> = ({
    value,
    maxValue,
    type,
    graduationStep = 10,
}) => {
    const percent = Math.max(0, Math.min(1, value / maxValue));
    const graduations: number[] = [];
    for (let i = graduationStep; i < maxValue; i += graduationStep) {
        graduations.push(i);
    }

    return (
        <div style={{ width: 200, padding: 4 }}>
            <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 'bold' }}>
                {type}: {value} / {maxValue}
            </div>
            <div
                style={{
                    position: 'relative',
                    height: 18,
                    background: '#222',
                    borderRadius: 6,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: `${percent * 100}%`,
                        height: '100%',
                        background: BAR_COLORS[type],
                        transition: 'width 0.3s',
                    }}
                />
                {graduations.map((g) => (
                    <div
                        key={g}
                        style={{
                            position: 'absolute',
                            left: `${(g / maxValue) * 100}%`,
                            top: 0,
                            bottom: 0,
                            width: 1,
                            background: '#fff4',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameTooltipBar;