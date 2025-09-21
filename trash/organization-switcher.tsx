// trash/organization-switcher.tsx
"use client"

import { useState } from "react"
import { getCurrentUser } from "@/lib/dummy-data"

export function OrganizationSwitcher() {
  const [open, setOpen] = useState(false)
  const currentUser = getCurrentUser()
  const user
