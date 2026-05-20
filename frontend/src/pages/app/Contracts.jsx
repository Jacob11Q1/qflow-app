import { FileSignature } from 'lucide-react'
import Placeholder from '@/components/Placeholder'

export default function Contracts() {
  return (
    <Placeholder
      icon={FileSignature}
      eyebrow="Legal"
      title="Contracts"
      description="Generate contracts from your proposals and collect signatures without leaving QFLOW."
    />
  )
}
