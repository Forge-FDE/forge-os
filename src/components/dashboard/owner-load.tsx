"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface OwnerLoadProps {
  data: Array<{
    id: string
    name: string | null
    email: string
    _count: {
      accounts: number
    }
  }>
}

export function OwnerLoad({ data }: OwnerLoadProps) {
  const chartData = data.map(owner => ({
    name: owner.name || owner.email.split('@')[0],
    load: owner._count.accounts * 10, // Load points calculation
    accounts: owner._count.accounts,
  }))
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Load by Owner</CardTitle>
        <CardDescription>
          Active account load distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  return (
                    <div className="bg-background border rounded p-2">
                      <p className="font-semibold">{payload[0].payload.name}</p>
                      <p className="text-sm">Load: {payload[0].value} pts</p>
                      <p className="text-sm">Accounts: {payload[0].payload.accounts}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="load" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
