export type BannerItem = {
  bannerId: number
  src: string // base64
  title: string
  redirectUrl: string
  fileType: string
  description: string
  size: number
  width: number
  height: number
  aspectRatio: string
  startDate: string
  endDate: string
  status: 'Y' | 'N'
  totalCount: number
  section: string | null
}
