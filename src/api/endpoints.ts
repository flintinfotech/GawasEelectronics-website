// Saari API ke URLs yahi hain. Nayi API aaye to yaha add karo.
export const ENDPOINTS = {
  banner: {
    getAll: (page = 0, size = 10, sort = 'bannerId,desc') =>
      `/flint/banner/getAllBanners?page=${page}&size=${size}&sort=${sort}`,
  },
}