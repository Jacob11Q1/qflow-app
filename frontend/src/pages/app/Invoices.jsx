import { Receipt } from 'lucide-react'
import Placeholder from '@/components/Placeholder'

export default function Invoices() {
  return (
    <Placeholder
      icon={Receipt}
      eyebrow="Billing"
      title="Invoices"
      description="Create, send, and track invoices — and know exactly who owes you what."
    />
  )
}
