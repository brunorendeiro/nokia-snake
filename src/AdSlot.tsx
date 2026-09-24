import { useEffect, useState } from 'react'
import { getStoredConsent } from './analytics'

const AD_CLIENT = 'ca-pub-4561414438757131'
const AD_SLOT = '7367572247'

/**
 * Manual, responsive ad unit. Unlike auto ads (disabled in analytics.ts), this
 * component must only be used on screens with substantial real content — never on
 * the live/interactive game screen, which has little to no publisher content and
 * was the root cause of the AdSense "low value content" policy violation.
 */
export default function AdSlot() {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    setGranted(getStoredConsent() === 'granted')
  }, [])

  useEffect(() => {
    if (!granted) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      /* script not loaded yet, or blocked by an ad blocker */
    }
  }, [granted])

  if (!granted) return null

  return (
    <div className="ad-slot">
      <span className="ad-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
