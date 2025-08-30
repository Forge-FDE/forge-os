"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StatusChip } from "@/components/ui/status-chip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface StakeholdersProps {
  stakeholders: Array<{
    id: string
    name: string
    role: string
    contact: string | null
    sentiments: Array<{
      sentiment: string
      notes: string | null
      date: Date
    }>
  }>
  accountId: string
}

export function AccountStakeholders({ stakeholders }: StakeholdersProps) {
  const [isAddingStakeholder, setIsAddingStakeholder] = useState(false)
  const [isAddingSentiment, setIsAddingSentiment] = useState<string | null>(null)
  
  const roleLabels = {
    sponsor: "Sponsor",
    champion: "Champion",
    security: "Security",
    ops: "Operations",
    it: "IT",
    procurement: "Procurement",
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stakeholders</h3>
        <Dialog open={isAddingStakeholder} onOpenChange={setIsAddingStakeholder}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Stakeholder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Stakeholder</DialogTitle>
              <DialogDescription>
                Add a new stakeholder to this account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Name" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Contact (optional)" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingStakeholder(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddingStakeholder(false)}>
                Add Stakeholder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {stakeholders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            No stakeholders added yet
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {stakeholders.map((stakeholder) => (
            <Card key={stakeholder.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{stakeholder.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {roleLabels[stakeholder.role as keyof typeof roleLabels]}
                      </p>
                    </div>
                  </div>
                  {stakeholder.sentiments[0] && (
                    <StatusChip sentiment={stakeholder.sentiments[0].sentiment} size="sm" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {stakeholder.contact && (
                  <p className="text-sm text-muted-foreground">{stakeholder.contact}</p>
                )}
                
                {stakeholder.sentiments[0] && (
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      Last update: {formatDistanceToNow(new Date(stakeholder.sentiments[0].date), { addSuffix: true })}
                    </p>
                    {stakeholder.sentiments[0].notes && (
                      <p className="italic">{stakeholder.sentiments[0].notes}</p>
                    )}
                  </div>
                )}
                
                <Dialog 
                  open={isAddingSentiment === stakeholder.id} 
                  onOpenChange={(open) => setIsAddingSentiment(open ? stakeholder.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="w-full">
                      Update Sentiment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Sentiment</DialogTitle>
                      <DialogDescription>
                        Record sentiment for {stakeholder.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sentiment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="G">Green - Positive</SelectItem>
                          <SelectItem value="Y">Yellow - Neutral</SelectItem>
                          <SelectItem value="R">Red - Negative</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea placeholder="Notes (optional)" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingSentiment(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddingSentiment(null)}>
                        Save Sentiment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}