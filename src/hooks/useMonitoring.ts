import { useQuery, useQueryClient } from '@tanstack/react-query'
import { monitoringService } from '../services/monitoringService'
import { useEffect } from 'react'

export function useMonitoring(autoRefresh: boolean = true) {
  const queryClient = useQueryClient()

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: monitoringService.getSystemMetrics,
    refetchInterval: autoRefresh ? 5000 : false,
  })

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['serviceStatus'],
    queryFn: monitoringService.checkServiceStatus,
    refetchInterval: autoRefresh ? 10000 : false,
  })

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['liveActivities'],
    queryFn: monitoringService.getLiveActivities,
    refetchInterval: autoRefresh ? 3000 : false,
  })

  // Real-time subscription برای events
  useEffect(() => {
    if (!autoRefresh) return

    const unsubscribe = monitoringService.subscribeToEvents((events) => {
      queryClient.setQueryData(['systemEvents'], events)
    })

    return () => unsubscribe()
  }, [autoRefresh, queryClient])

  return {
    metrics: metrics || {},
    services: services || [],
    activities: activities || [],
    isLoading: metricsLoading || servicesLoading || activitiesLoading,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['systemMetrics'] })
      queryClient.invalidateQueries({ queryKey: ['serviceStatus'] })
      queryClient.invalidateQueries({ queryKey: ['liveActivities'] })
    }
  }
}