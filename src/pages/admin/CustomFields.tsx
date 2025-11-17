import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  List,
  Text,
  Calendar,
  Hash,
  Link,
  Eye,
  EyeOff
} from 'lucide-react'

// تایپ‌های فیلدهای سفارشی
interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'url'
  label: string
  description?: string
  required: boolean
  options?: string[] // برای type='select'
  defaultValue?: any
  visible: boolean
  createdAt: Date
  updatedAt: Date
}

const fieldSchema = z.object({
  name: z.string().min(1, 'نام فیلد الزامی است'),
  type: z.enum(['text', 'number', 'date', 'select', 'boolean', 'url']),
  label: z.string().min(1, 'برچسب الزامی است'),
  description: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  defaultValue: z.any().optional(),
  visible: z.boolean().default(true)
})

type FieldFormData = z.infer<typeof fieldSchema>

export default function CustomFields() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingField, setEditingField] = useState<CustomField | null>(null)
  
  const queryClient = useQueryClient()

  // شبیه‌سازی داده‌های فیلدهای سفارشی
  const { data: fields, isLoading } = useQuery<CustomField[]>({
    queryKey: ['customFields'],
    queryFn: async () => {
      return [
        {
          id: '1',
          name: 'estimated_hours',
          type: 'number',
          label: 'زمان تخمینی (ساعت)',
          description: 'زمان تخمینی برای تکمیل کار',
          required: false,
          visible: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          id: '2',
          name: 'client_name',
          type: 'text',
          label: 'نام مشتری',
          description: 'نام مشتری مربوط به کار',
          required: true,
          visible: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          id: '3',
          name: 'project_type',
          type: 'select',
          label: 'نوع پروژه',
          description: 'دسته‌بندی نوع پروژه',
          required: false,
          options: ['تجاری', 'شخصی', 'داخلی', 'فوری'],
          visible: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          id: '4',
          name: 'is_billable',
          type: 'boolean',
          label: 'قابل صورتحساب',
          description: 'آیا این کار قابل صورتحساب است؟',
          required: false,
          defaultValue: true,
          visible: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      ]
    }
  })

  const form = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      type: 'text',
      required: false,
      visible: true
    }
  })

  const createMutation = useMutation({
    mutationFn: async (fieldData: FieldFormData) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id: Math.random().toString(36).substr(2, 9), ...fieldData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] })
      setShowCreateModal(false)
      form.reset()
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CustomField>) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] })
      setEditingField(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (fieldId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] })
    }
  })

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ fieldId, currentVisibility }: { fieldId: string; currentVisibility: boolean }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] })
    }
  })

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Text className="h-4 w-4" />
      case 'number': return <Hash className="h-4 w-4" />
      case 'date': return <Calendar className="h-4 w-4" />
      case 'select': return <List className="h-4 w-4" />
      case 'boolean': return <ToggleLeft className="h-4 w-4" />
      case 'url': return <Link className="h-4 w-4" />
      default: return <Text className="h-4 w-4" />
    }
  }

  const getFieldTypeText = (type: string) => {
    switch (type) {
      case 'text': return 'متنی'
      case 'number': return 'عددی'
      case 'date': return 'تاریخ'
      case 'select': return 'انتخابی'
      case 'boolean': return 'صحیح/غلط'
      case 'url': return 'لینک'
      default: return type
    }
  }

  const onSubmit = async (data: FieldFormData) => {
    if (editingField) {
      await updateMutation.mutateAsync({ id: editingField.id, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const handleToggleVisibility = async (fieldId: string, currentVisibility: boolean) => {
    await toggleVisibilityMutation.mutateAsync({ fieldId, currentVisibility })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">فیلدهای سفارشی</h1>
          <p className="text-gray-600 mt-1">مدیریت فیلدهای اضافی برای کارها</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 ml-2" />
          فیلد جدید
        </Button>
      </div>

      {/* آمار */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Text className="h-8 w-8 text-blue-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">کل فیلدها</p>
              <p className="text-2xl font-bold text-gray-900">{fields?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">فعال</p>
              <p className="text-2xl font-bold text-gray-900">
                {fields?.filter(f => f.visible).length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <EyeOff className="h-8 w-8 text-gray-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">غیرفعال</p>
              <p className="text-2xl font-bold text-gray-900">
                {fields?.filter(f => !f.visible).length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Hash className="h-8 w-8 text-purple-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">الزامی</p>
              <p className="text-2xl font-bold text-gray-900">
                {fields?.filter(f => f.required).length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* لیست فیلدها */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">فیلد</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">نوع</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">وضعیت</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الزامی</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : fields?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    هیچ فیلد سفارشی تعریف نشده است
                  </td>
                </tr>
              ) : (
                fields?.map((field) => (
                  <tr key={field.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center">
                          {getFieldTypeIcon(field.type)}
                          <div className="mr-3">
                            <p className="font-medium text-gray-900">{field.label}</p>
                            <p className="text-sm text-gray-500">{field.name}</p>
                            {field.description && (
                              <p className="text-xs text-gray-400 mt-1">{field.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{getFieldTypeText(field.type)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(field.id, field.visible)}
                        className={field.visible ? 'text-green-600' : 'text-gray-400'}
                      >
                        {field.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        <span className="mr-2 text-xs">
                          {field.visible ? 'فعال' : 'غیرفعال'}
                        </span>
                      </Button>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        field.required 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {field.required ? 'بله' : 'خیر'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingField(field)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(field.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* مودال ایجاد/ویرایش فیلد */}
      <Modal
        isOpen={showCreateModal || !!editingField}
        onClose={() => {
          setShowCreateModal(false)
          setEditingField(null)
          form.reset()
        }}
        title={editingField ? 'ویرایش فیلد' : 'ایجاد فیلد جدید'}
        size="lg"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="نام فیلد (انگلیسی)"
              placeholder="example: client_name"
              error={form.formState.errors.name?.message}
              {...form.register('name')}
            />
            
            <Input
              label="برچسب (فارسی)"
              placeholder="مثال: نام مشتری"
              error={form.formState.errors.label?.message}
              {...form.register('label')}
            />
          </div>

          <Input
            label="توضیحات"
            placeholder="توضیحاتی درباره این فیلد"
            error={form.formState.errors.description?.message}
            {...form.register('description')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع فیلد
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...form.register('type')}
            >
              <option value="text">متنی</option>
              <option value="number">عددی</option>
              <option value="date">تاریخ</option>
              <option value="select">انتخابی</option>
              <option value="boolean">صحیح/غلط</option>
              <option value="url">لینک</option>
            </select>
          </div>

          {form.watch('type') === 'select' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                گزینه‌ها (هر خط یک گزینه)
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="گزینه اول&#10;گزینه دوم&#10;گزینه سوم"
                {...form.register('options', {
                  setValueAs: (value: string) => value.split('\n').filter(opt => opt.trim())
                })}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                {...form.register('required')}
              />
              <span className="text-sm text-gray-700">فیلد اجباری</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                {...form.register('visible')}
              />
              <span className="text-sm text-gray-700">نمایش در فرم</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false)
                setEditingField(null)
              }}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingField ? 'بروزرسانی فیلد' : 'ایجاد فیلد'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}