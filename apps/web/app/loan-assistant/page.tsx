'use client'

import { LoanAssistantChat } from '@/components/loan-assistant/loan-assistant-chat'
import { SuggestedPrompts } from '@/components/loan-assistant/suggested-prompts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { useState } from 'react'

export default () => {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Loan Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about loans, get personalized advice, and explore loan options with our AI assistant.
        </p>
      </div>

      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-4">
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <LoanAssistantChat />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="suggestions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Topics</CardTitle>
              <CardDescription>Click on any suggestion to start a conversation about that topic.</CardDescription>
            </CardHeader>
            <CardContent>
              <SuggestedPrompts setActiveTab={setActiveTab} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
