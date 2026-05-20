import { LayoutDashboard } from 'lucide-react'
import Placeholder from '@/components/Placeholder'

export default function Dashboard() {
  return (
    <Placeholder
      icon={LayoutDashboard}
      eyebrow="Overview"
      title="Dashboard"
      description="Your business at a glance — active projects, pending invoices, and what needs attention today."
    />
  )
}
