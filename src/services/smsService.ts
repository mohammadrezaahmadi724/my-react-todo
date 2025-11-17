const SMS_API_BASE_URL = 'https://api.ippanel.com/api/v1'
const SMS_API_TOKEN = 'YTA1YTg3NTEtNzI5NS00NWQwLTkyYjEtOTAyY2VkODAyYmZkMmQ1ZDM0NjM5NjExMGQ5MGE5NjAxMjhhNDFkNjAwNjg='

export const smsService = {
  async sendVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const response = await fetch(`${SMS_API_BASE_URL}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SMS_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sending_type: "webservice",
          from_number: "+983000505",
          message: `کد تایید شما: ${code}`,
          params: {
            recipients: [phoneNumber]
          }
        })
      })

      const result = await response.json()
      return result.meta?.status === true
    } catch (error) {
      console.error('SMS sending error:', error)
      return false
    }
  },

  async sendLoginNotification(phoneNumber: string): Promise<boolean> {
    try {
      const response = await fetch(`${SMS_API_BASE_URL}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SMS_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sending_type: "webservice",
          from_number: "+983000505",
          message: "ورود جدید به حساب کاربری شما ثبت شد",
          params: {
            recipients: [phoneNumber]
          }
        })
      })

      const result = await response.json()
      return result.meta?.status === true
    } catch (error) {
      console.error('SMS sending error:', error)
      return false
    }
  }
}