import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: 'linear-gradient(135deg, #0c4a6e, #0284c7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Open book — two pages meeting at a center spine */}
        <path d="M12 6.5C10.2 5.2 7.6 4.6 5 5v12.5c2.6-0.4 5.2 0.2 7 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M12 6.5C13.8 5.2 16.4 4.6 19 5v12.5c-2.6-0.4-5.2 0.2-7 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M12 6.5V19" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
      </svg>
    </div>
  )
}
