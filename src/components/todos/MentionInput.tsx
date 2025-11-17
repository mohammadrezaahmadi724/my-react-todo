import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { collaborationService } from '../../services/collaborationService'
import { User } from 'lucide-react'

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  placeholder?: string
}

export default function MentionInput({ value, onChange, onKeyDown, placeholder }: MentionInputProps) {
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionPosition, setMentionPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', mentionQuery],
    queryFn: () => collaborationService.searchUsers(mentionQuery),
    enabled: mentionQuery.length > 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // تشخیص mention
    const cursorPosition = e.target.selectionStart
    const textBeforeCursor = newValue.substring(0, cursorPosition)
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@')

    if (lastAtSymbol !== -1) {
      const query = textBeforeCursor.substring(lastAtSymbol + 1)
      setMentionQuery(query)
      setMentionPosition(lastAtSymbol)
      setShowMentions(true)
    } else {
      setShowMentions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault()
        // مدیریت navigation در لیست mentionها
      } else if (e.key === 'Escape') {
        setShowMentions(false)
      }
    }
    
    onKeyDown?.(e)
  }

  const insertMention = (userEmail: string) => {
    const beforeMention = value.substring(0, mentionPosition)
    const afterMention = value.substring(mentionPosition + mentionQuery.length + 1) // +1 برای @
    
    const newValue = beforeMention + `@${userEmail} ` + afterMention
    onChange(newValue)
    setShowMentions(false)
    setMentionQuery('')
    
    // فوکوس به انتهای متن
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const newCursorPos = beforeMention.length + userEmail.length + 2 // @ و space
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
      />
      
      {showMentions && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">
              در حال جستجو...
            </div>
          ) : users?.length === 0 ? (
            <div className="p-3 text-center text-gray-500">
              کاربری یافت نشد
            </div>
          ) : (
            users?.map((user) => (
              <button
                key={user.id}
                onClick={() => insertMention(user.email)}
                className="flex items-center w-full px-3 py-2 text-right hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4 text-gray-400 ml-2" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                  {user.displayName && (
                    <div className="text-xs text-gray-500">{user.displayName}</div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}