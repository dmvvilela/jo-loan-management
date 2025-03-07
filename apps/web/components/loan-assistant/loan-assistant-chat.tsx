'use client'

import { sendMessage } from '@/app/loan-assistant/actions'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import { Card } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { cn } from '@workspace/ui/lib/utils'
import { Loader2, SendIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useSelectedPrompt } from './use-selected-prompt'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export const LoanAssistantChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your loan assistant. I can help you with loan information, calculations, and advice. What would you like to know about loans today?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendMessage(input)
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ])
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
      }, 100)
    }
  }

  useSelectedPrompt(setInput, handleSend)

  return (
    <Card className="flex h-[calc(100vh-250px)] flex-col border">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 rounded-lg p-4',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                  : 'bg-muted mr-auto max-w-[80%]'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://www.shutterstock.com/image-vector/chat-bot-icon-ai-artificial-600nw-2278580345.jpg"
                    alt="AI"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className="text-sm">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    {line}
                  </p>
                ))}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-muted-foreground ml-12 flex items-center gap-2 text-sm">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSend} className="flex gap-2 border-t p-4">
        <Input
          placeholder="Ask about loans, rates, or payment options..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}
