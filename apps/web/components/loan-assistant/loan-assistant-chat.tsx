'use client'

import { sendMessage } from '@/app/(dashboard)/loan-assistant/actions'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import { Card } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { cn } from '@workspace/ui/lib/utils'
import { Loader2, SendIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
    <Card className="flex flex-col border">
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
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="/ai-assistant.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className={cn('flex-1 text-sm', message.role === 'user' ? 'order-first' : '')}>
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        ul: ({ node, ...props }) => <ul className="list-disc space-y-1 pl-4" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal space-y-1 pl-4" {...props} />,
                        li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="mb-1 mt-3 text-base font-semibold" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="mb-1 mt-2 text-sm font-semibold" {...props} />,
                        code: ({ className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '')
                          const isInline = !className || !match

                          return isInline ? (
                            <code className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-800" {...props}>
                              {children}
                            </code>
                          ) : (
                            <code
                              className="my-2 block overflow-x-auto rounded bg-gray-200 p-2 text-xs dark:bg-gray-800"
                              {...props}
                            >
                              {children}
                            </code>
                          )
                        },
                        table: ({ node, ...props }) => (
                          <div className="my-2 w-full overflow-x-auto rounded border">
                            <table className="min-w-full table-auto border-collapse text-xs" {...props} />
                          </div>
                        ),
                        thead: ({ node, ...props }) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
                        tbody: ({ node, ...props }) => (
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props} />
                        ),
                        tr: ({ node, ...props }) => (
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-800" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th
                            className="border-b border-gray-200 px-3 py-2 text-left font-medium tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400"
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td
                            className="whitespace-normal border-b border-gray-200 px-3 py-2 dark:border-gray-700"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  message.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="order-last h-8 w-8 flex-shrink-0">
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
