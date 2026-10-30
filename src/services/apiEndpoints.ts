// PURI WEBSITE KI SAARI API YAHI HAIN. Nayi API aaye to sirf yaha add karo.
// (JNPV project jaisa: ek flat object `apiEndpoints`, har API ka ek function)
export const apiEndpoints = {
  // ---------- Banner ----------
  getAllBanners: (page = 0, size = 10, sort = 'bannerId,desc') =>
    `/flint/banner/getAllBanners?page=${page}&size=${size}&sort=${sort}`,

  // ---------- Product ----------
  getAllProducts: (page = 0, size = 12, sort = 'productInfoId,desc') =>
    `/flint/product/getAllProducts?page=${page}&size=${size}&sort=${sort}`,
  getProductById: (id: number | string) => `/flint/product/getProductById/${id}`,

  // ---------- Static Data (dropdowns: Brand Name, Model, Label, Section ...) ----------
  getStaticDataDD: () => `/flint/staticData/getStaticDataDD`,
}