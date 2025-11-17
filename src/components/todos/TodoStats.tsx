import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react'
import Card from '../ui/Card'

interface TodoStatsProps {
  stats: {
    total: number
    completed: number
    pending: number
    inProgress: number
    overdue: number
  }
}

export default function TodoStats({ stats }: TodoStatsProps) {
  const statCards = [
    {
      title: 'کل کارها',
      value: stats.total,
      icon: ListTodo,
      color: 'blue',
    },
    {
      title: 'انجام شده',
      value: stats.completed,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'در حال انجام',
      value: stats.inProgress,
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'معوقه',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'red',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <Icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}