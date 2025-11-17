import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collaborationService } from '../../services/collaborationService'
import { todoService } from '../../services/todoService'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { 
  ArrowRight, 
  Send, 
  User, 
  Clock, 
  MoreVertical,
  Edit2,
  Trash2,
  Share2,
  Users,
  Activity
} from 'lucide-react'

export default function TodoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [mentionQuery, setMentionQuery] = useState('')
  const [showMentions, setShowMentions] = useState(false)

  // دریافت اطلاعات کار
  const { data: todo, isLoading: todoLoading } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => todoService.getTodoById(id!),
    enabled: !!id
  })

  // دریافت کامنت‌ها
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => collaborationService.getTodoComments(id!),
    enabled: !!id
  })

  // دریافت فعالیت‌ها
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities', id],
    queryFn: () => collaborationService.getTodoActivities(id!),
    enabled: !!id
  })

  // دریافت همکاران
  const { data: collaborators, isLoading: collaboratorsLoading } = useQuery({
    queryKey: ['collaborators', id],
    queryFn: () => collaborationService.getTodoCollaborators(id!),
    enabled: !!id
  })

  // موتیشن‌ها
  const addCommentMutation = useMutation({
    mutationFn: collaborationService.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      setNewComment('')
    }
  })

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      collaborationService.updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
      setEditingComment(null)
      setEditContent('')
    }
  })

  const deleteCommentMutation = useMutation({
    mutationFn: collaborationService.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
    }
  })

  const addCollaboratorMutation = useMutation({
    mutationFn: collaborationService.addCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators', id] })
    }
  })

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !id) return

    await addCommentMutation.mutateAsync({
      todoId: id,
      userId: user.uid,
      userEmail: user.email,
      content: newComment,
      mentions: extractMentions(newComment)
    })
  }

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return

    await updateCommentMutation.mutateAsync({
      commentId,
      content: editContent
    })
  }

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('آیا از حذف این کامنت مطمئن هستید؟')) {
      await deleteCommentMutation.mutateAsync(commentId)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddComment()
    }
    
    if (e.key === '@') {
      setShowMentions(true)
    }
  }

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const matches = text.match(mentionRegex)
    return matches ? matches.map(m => m.substring(1)) : []
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('fa-IR')
  }

  const isCommentAuthor = (commentUserId: string) => {
    return user?.uid === commentUserId
  }

  if (todoLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!todo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">کار یافت نشد</h2>
        <Button onClick={() => navigate('/todos')} className="mt-4">
          بازگشت به لیست کارها
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* هدر کار */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/todos')}>
            <ArrowRight className="h-4 w-4 ml-2 rotate-180" />
            بازگشت
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 mr-4">{todo.title}</h1>
        </div>
        <Button variant="outline">
          <Share2 className="h-4 w-4 ml-2" />
          اشتراک‌گذاری
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* محتوای اصلی و کامنت‌ها */}
        <div className="lg:col-span-2 space-y-6">
          {/* اطلاعات کار */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{todo.title}</h2>
                <p className="text-gray-600 mt-2">{todo.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                  todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {todo.priority === 'high' ? 'بالا' :
                   todo.priority === 'medium' ? 'متوسط' : 'پایین'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  todo.status === 'completed' ? 'bg-green-100 text-green-800' :
                  todo.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {todo.status === 'completed' ? 'انجام شده' :
                   todo.status === 'in-progress' ? 'در حال انجام' : 'در انتظار'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <User className="h-4 w-4 ml-1" />
                <span>{todo.userEmail}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 ml-1" />
                <span>{formatDate(todo.createdAt)}</span>
              </div>
            </div>
          </Card>

          {/* فرم کامنت جدید */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">افزودن کامنت</h3>
            <div className="space-y-3">
              <div>
                <textarea
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="نظر خود را بنویسید... (برای ارسال از Ctrl+Enter استفاده کنید)"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    از @ برای mention کردن کاربران استفاده کنید
                  </span>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || addCommentMutation.isPending}
                    isLoading={addCommentMutation.isPending}
                  >
                    <Send className="h-4 w-4 ml-2" />
                    ارسال
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* لیست کامنت‌ها */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">کامنت‌ها ({comments?.length || 0})</h3>
            
            {commentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              </div>
            ) : comments?.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">💬</div>
                <p className="text-gray-500">هنوز کامنتی وجود ندارد</p>
                <p className="text-sm text-gray-400 mt-2">اولین نفری باشید که نظر می‌دهد</p>
              </Card>
            ) : (
              comments?.map((comment) => (
                <Card key={comment.id} className="p-4">
                  {editingComment === comment.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingComment(null)}
                        >
                          انصراف
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateComment(comment.id)}
                          isLoading={updateCommentMutation.isPending}
                        >
                          ذخیره
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">
                                {comment.userEmail}
                              </h4>
                              {isCommentAuthor(comment.userId) && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  شما
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                              {comment.content}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{formatDate(comment.createdAt)}</span>
                              {comment.updatedAt !== comment.createdAt && (
                                <span>ویرایش شده</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isCommentAuthor(comment.userId) && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingComment(comment.id)
                                setEditContent(comment.content)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* پاسخ‌ها */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mr-12 mt-4 space-y-3 border-t border-gray-200 pt-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="h-3 w-3 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {reply.userEmail}
                                  </span>
                                  {isCommentAuthor(reply.userId) && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                      شما
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                  {reply.content}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

        {/* سایدبار - اطلاعات جانبی */}
        <div className="space-y-6">
          {/* همکاران */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">همکاران</h3>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center ml-2">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">مالک کار</p>
                    <p className="text-xs text-gray-500">{todo.userEmail}</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  مالک
                </span>
              </div>

              {collaboratorsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                </div>
              ) : collaborators?.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ml-2">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{collaborator.userEmail}</p>
                      <p className="text-xs text-gray-500">{collaborator.role}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {collaborator.role === 'editor' ? 'ویرایشگر' : 'بیننده'}
                  </span>
                </div>
              ))}

              <Button variant="outline" size="sm" className="w-full">
                افزودن همکار
              </Button>
            </div>
          </Card>

          {/* فعالیت‌های اخیر */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">فعالیت‌ها</h3>
              <Activity className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activitiesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                </div>
              ) : activities?.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">هیچ فعالیتی ثبت نشده</p>
              ) : (
                activities?.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-2 text-sm">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.action === 'commented' ? 'bg-blue-500' :
                      activity.action === 'created' ? 'bg-green-500' :
                      activity.action === 'updated' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-gray-700">
                        <span className="font-medium">{activity.userEmail}</span>
                        {' '}{activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* اطلاعات فنی */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">اطلاعات فنی</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">شناسه:</span>
                <span className="font-medium">{todo.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ایجاد شده:</span>
                <span className="font-medium">{formatDate(todo.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">آخرین ویرایش:</span>
                <span className="font-medium">{formatDate(todo.updatedAt)}</span>
              </div>
              {todo.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">تکمیل شده:</span>
                  <span className="font-medium">{formatDate(todo.completedAt)}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}