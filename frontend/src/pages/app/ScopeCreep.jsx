import { AlertTriangle } from 'lucide-react'
import Placeholder from '@/components/Placeholder'

export default function ScopeCreep() {
  return (
    <Placeholder
      icon={AlertTriangle}
      eyebrow="AI"
      title="Scope Creep"
      description="Detect out-of-scope requests against the signed proposal before they erode your margin."
    />
  )
}
