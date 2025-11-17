import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../ui/Button'
import Input from '../ui/Input'

const profileSchema = z.object({
  displayName: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email: z.string().email('ایمیل معتبر نیست'),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500, 'بیوگرافی نباید بیشتر از ۵۰۰ کاراکتر باشد').optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void
  isLoading?: boolean
  initialData?: ProfileFormData
}

export default function ProfileForm({ onSubmit, isLoading, initialData }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="نام نمایشی"
          error={errors.displayName?.message}
          {...register('displayName')}
        />
        
        <Input
          label="ایمیل"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <Input
        label="شماره تلفن"
        type="tel"
        error={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          بیوگرافی
        </label>
        <textarea
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          {...register('bio')}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      <Button type="submit" isLoading={isLoading}>
        ذخیره تغییرات
      </Button>
    </form>
  )
}