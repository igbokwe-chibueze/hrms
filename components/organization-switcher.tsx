"use client"

import { useState } from "react"
import {
  getCurrentUser,
  getUserOrganizations,
  getCurrentOrganization,
} from "@/lib/dummy-data"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { ChevronsUpDown, PlusCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export const OrganizationSwitcher = () => {
  const [open, setOpen] = useState(false)
  const [currentOrganization, setCurrentOrganization] = useState(
    getCurrentOrganization(),
  )

  const currentUser = getCurrentUser()
  const userOrganizations = getUserOrganizations(currentUser.id)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <div className="flex items-center">
            {currentOrganization.logo ? (
              <Avatar>
                <AvatarImage src={currentOrganization.logo} />
                <AvatarFallback>
                  {currentOrganization.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            <span className="truncate ml-2">
              {currentOrganization.name}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandInput placeholder="Search organization..." />
              <CommandEmpty>No organization found.</CommandEmpty>
              {userOrganizations.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={() => {
                    setCurrentOrganization(org)
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  <div className="flex items-center">
                    {org.logo ? (
                      <Avatar>
                        <AvatarImage src={org.logo} />
                        <AvatarFallback>
                          {org.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    )}
                    {org.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentOrganization.id === org.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create new organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}