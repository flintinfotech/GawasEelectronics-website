// .env ki values yahi se import karo (project me kahi aur import.meta.env mat likho)
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? ''

// JNPV jaisa: baaki code me `config.baseURL` use hota hai
const config = {
  baseURL: API_BASE_URL,
}

export default config
