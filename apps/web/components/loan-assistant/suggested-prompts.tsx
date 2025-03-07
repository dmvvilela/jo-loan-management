'use client'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { ArrowRightIcon, Briefcase, Calculator, Car, GraduationCap, Home } from 'lucide-react'

const suggestions = [
  {
    title: 'Mortgage Calculation',
    description: 'Calculate monthly payments for a home loan',
    icon: Home,
    prompts: [
      'Calculate monthly payments for a $300,000 home loan with 20% down payment and 4.5% interest rate over 30 years',
      "What's the difference in total interest paid between a 15-year and 30-year mortgage?",
      'How much house can I afford with a $5,000 monthly income?',
    ],
  },
  {
    title: 'Auto Loans',
    description: 'Explore car financing options',
    icon: Car,
    prompts: [
      'Compare 48-month vs 60-month auto loan for a $25,000 car',
      'Should I lease or buy a new car?',
      "What's a good interest rate for an auto loan with a 720 credit score?",
    ],
  },
  {
    title: 'Student Loans',
    description: 'Understand education financing',
    icon: GraduationCap,
    prompts: [
      'Explain the difference between subsidized and unsubsidized student loans',
      'What are my options for student loan forgiveness?',
      'How can I refinance my student loans to get a better rate?',
    ],
  },
  {
    title: 'Business Loans',
    description: 'Financing for your business',
    icon: Briefcase,
    prompts: [
      'What types of SBA loans are available for small businesses?',
      'How to prepare a loan application for a startup business',
      'Compare business line of credit vs term loan for inventory purchases',
    ],
  },
  {
    title: 'Loan Calculators',
    description: 'Run different loan scenarios',
    icon: Calculator,
    prompts: [
      'Help me calculate the amortization schedule for a $50,000 loan at 6% for 5 years',
      'What would my payments be if I consolidated my credit card debt into a personal loan?',
      'Calculate how much I could save by making extra payments on my loan',
    ],
  },
]

type SuggestedPromptsProps = {
  setActiveTab: (tab: string) => void
}

export const SuggestedPrompts = ({ setActiveTab }: SuggestedPromptsProps) => {
  const handlePromptClick = (prompt: string) => {
    // Store the selected prompt in localStorage to use it in the chat component
    localStorage.setItem('selectedPrompt', prompt)
    setActiveTab('chat')
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {suggestions.map((category, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full p-2">
                <category.icon className="text-primary h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{category.title}</CardTitle>
            </div>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              {category.prompts.map((prompt, promptIndex) => (
                <li key={promptIndex}>
                  <Button
                    variant="ghost"
                    className="hover:bg-muted h-auto w-full justify-start p-2 text-left text-sm"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <ArrowRightIcon className="mr-2 h-3 w-3 flex-shrink-0" />
                    <span>{prompt}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
