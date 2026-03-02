function RiskProfile({ profile, onChange, profiles }) {
    const profileList = Object.values(profiles);

    const handleSliderChange = (e) => {
        const level = parseInt(e.target.value);
        const matchingProfile = profileList.find(p => p.level === level) ||
            profileList.reduce((prev, curr) =>
                Math.abs(curr.level - level) < Math.abs(prev.level - level) ? curr : prev
            );
        onChange(matchingProfile);
    };

    return (
        <div className="glass-card">
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                ⚖️ Risk Profile
            </h3>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-muted)'
                }}>
                    <span>Conservative</span>
                    <span>Aggressive</span>
                </div>

                <input
                    type="range"
                    min="1"
                    max="10"
                    value={profile.level}
                    onChange={handleSliderChange}
                    style={{ width: '100%' }}
                />

                <div style={{
                    textAlign: 'center',
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <div style={{
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 600,
                        color: profile.level <= 3 ? 'var(--color-buy)' : profile.level <= 6 ? 'var(--color-hold)' : 'var(--color-sell)'
                    }}>
                        {profile.name}
                    </div>
                    <div style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-secondary)',
                        marginTop: 'var(--spacing-xs)'
                    }}>
                        Level {profile.level}/10
                    </div>
                </div>
            </div>

            <div style={{ fontSize: 'var(--font-size-sm)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                    {profile.description}
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--spacing-sm)'
                }}>
                    <div style={{
                        padding: 'var(--spacing-sm)',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>Stop Loss</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-sell)' }}>{profile.stopLossPercent}%</div>
                    </div>
                    <div style={{
                        padding: 'var(--spacing-sm)',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>Target Mult.</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-buy)' }}>{profile.targetMultiplier}x</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RiskProfile;
