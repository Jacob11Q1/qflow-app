import { FileText } from 'lucide-react'
import Placeholder from '@/components/Placeholder'

export default function Proposals() {
  return (
    <Placeholder
      icon={FileText}
      eyebrow="AI"
      title="Proposals"
      description="Generate scoped, priced proposals from a short brief and send them to clients in minutes."
    />
  )
}
