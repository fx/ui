import { Check, Copy, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button, type ButtonProps } from './button'

type CopyButtonProps = Omit<ButtonProps, 'children' | 'onClick' | 'aria-label'> & {
  text: string
}

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Try the selection-based fallback when clipboard access is denied.
  }

  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const area = document.createElement('textarea')
  area.value = text
  area.readOnly = true
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.append(area)
  try {
    area.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    area.remove()
    active?.focus()
  }
}

function CopyButton({ text, variant = 'ghost', size = 'icon', ...props }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const attempt = useRef(0)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      attempt.current++
      clearTimeout(timer.current)
    }
  }, [])

  async function copy() {
    const current = ++attempt.current
    clearTimeout(timer.current)
    setStatus('idle')
    const success = await writeToClipboard(text)
    if (!mounted.current || current !== attempt.current) return
    setStatus(success ? 'copied' : 'failed')
    timer.current = setTimeout(() => setStatus('idle'), 1500)
  }

  const label =
    status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy to clipboard'
  return (
    <>
      <Button {...props} variant={variant} size={size} aria-label={label} onClick={copy}>
        {status === 'copied' ? <Check /> : status === 'failed' ? <X /> : <Copy />}
      </Button>
      <output className="sr-only">{status === 'idle' ? '' : label}</output>
    </>
  )
}

export { CopyButton }
export type { CopyButtonProps }
