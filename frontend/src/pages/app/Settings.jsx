import { Settings as SettingsIcon } from 'lucide-react'
import Placeholder from '@/components/Placeholder'

export default function Settings() {
  return (
    <Placeholder
      icon={SettingsIcon}
      eyebrow="Workspace"
      title="Settings"
      description="Manage your profile, branding, billing details, and integrations."
    />
  )
}
