// src/components/CodeBlock.jsx
import { useState } from 'react';
import { T } from '../theme';

export function CodeBlock({ code, title }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: 'hidden', marginBottom: 16 }}>
      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${T.border}`, background: T.bgCard }}>
          <span style={{ fontFamily: T.mono, fontSize: 12, color: T.textDim }}>{title}</span>
          <button onClick={handleCopy} style={{ background: copied ? T.accentBg : 'none', border: `1px solid ${copied ? T.accent + '44' : 'transparent'}`, color: copied ? T.accent : T.textDim, cursor: 'pointer', fontFamily: T.mono, fontSize: 11, padding: '3px 8px', borderRadius: T.radiusSm, transition: T.transition }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre style={{ padding: '16px 20px', margin: 0, fontFamily: T.mono, fontSize: 13, lineHeight: 1.7, color: T.textMuted, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{code}</pre>
    </div>
  );
}