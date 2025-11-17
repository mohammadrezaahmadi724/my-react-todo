import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'

const todoSchema = z.object({
  title: z.string().min(1, 'عنوان کار الزامی است'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  estimatedTime: z.number().min(0).optional(),
  tags: z.string().optional(),
})

type TodoFormData = z.infer<typeof todoSchema>

interface TodoFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TodoFormData) => void
  isLoading?: boolean
  initialData?: Partial<TodoFormData>
}

export default function TodoForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  initialData 
}: TodoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialData || {
      priority: 'medium',
    }
  })

  const handleFormSubmit = (data: TodoFormData) => {
    onSubmit(data)
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? 'ویرایش کار' : 'ایجاد کار جدید'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="عنوان کار"
          error={errors.title?.message}
          {...register('title')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            توضیحات
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اولویت
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register('priority')}
            >
              <option value="low">پایین</option>
              <option value="medium">متوسط</option>
              <option value="high">بالا</option>
            </select>
          </div>

          <Input
            label="تاریخ مهلت"
            type="date"
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="زمان تخمینی (دقیقه)"
            type="number"
            error={errors.estimatedTime?.message}
            {...register('estimatedTime', { valueAsNumber: true })}
          />

          <Input
            label="تگ‌ها (با کاما جدا کنید)"
            placeholder="کار,فوری,پروژه"
            error={errors.tags?.message}
            {...register('tags')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose}>
            انصراف
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'بروزرسانی کار' : 'ایجاد کار'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}