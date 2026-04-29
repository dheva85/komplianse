// Mock Supabase client for demo purposes
export const createMockClient = () => {
  const isServer = typeof window === 'undefined'
  
  const getStorage = (key: string) => {
    if (isServer) return []
    try {
      const val = localStorage.getItem(key)
      if (!val) return []
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('Mock DB Read Error:', e)
      return []
    }
  }

  const setStorage = (key: string, data: any) => {
    if (isServer) return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error('Mock DB Write Error:', e)
    }
  }

  const setDemoCookie = (user: any) => {
    if (isServer) return
    try {
      const encodedUser = encodeURIComponent(JSON.stringify(user))
      document.cookie = `demo-user=${encodedUser}; path=/; max-age=3600; SameSite=Lax`
    } catch (e) {
      console.error('Mock Cookie Error:', e)
    }
  }

  return {
    auth: {
      signUp: async ({ email, password, options }: any) => {
        const users = getStorage('mock_users')
        if (users.find((u: any) => u.email === email)) {
          return { data: { user: null }, error: { message: 'User already exists', code: '23505' } }
        }
        const newUser = { 
          id: 'u-' + Math.random().toString(36).substring(2, 9), 
          email, 
          user_metadata: options?.data || {},
          ...options?.data 
        }
        users.push(newUser)
        setStorage('mock_users', users)
        setStorage('mock_session', { user: newUser })
        setDemoCookie(newUser)

        // Auto-create company for new user in demo mode
        const companies = getStorage('mock_companies')
        companies.push({
          id: 'c-' + Math.random().toString(36).substring(2, 9),
          owner_user_id: newUser.id,
          company_name: options?.data?.company_name || 'Demo Corp',
          owner_name: options?.data?.owner_name || 'Demo Owner',
          created_at: new Date().toISOString()
        })
        setStorage('mock_companies', companies)

        return { data: { user: newUser }, error: null }
      },
      signInWithPassword: async ({ email, password }: any) => {
        const users = getStorage('mock_users')
        const user = users.find((u: any) => u.email === email)
        if (user) {
          setStorage('mock_session', { user })
          setDemoCookie(user)
          return { data: { user }, error: null }
        }
        return { data: { user: null }, error: { message: 'Invalid credentials' } }
      },
      getUser: async () => {
        if (isServer) return { data: { user: null }, error: null }
        try {
          const session = JSON.parse(localStorage.getItem('mock_session') || 'null')
          return { data: { user: session?.user || null }, error: null }
        } catch {
          return { data: { user: null }, error: null }
        }
      },
      signOut: async () => {
        if (!isServer) {
          localStorage.removeItem('mock_session')
          document.cookie = "demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        return { error: null }
      }
    },
    from: (table: string) => {
      return {
        select: (query: string = '*') => ({
          eq: (column: string, value: any) => ({
            single: async () => {
              const data = getStorage(`mock_${table}`)
              let item = data.find((i: any) => i[column] === value)
              
              // Self-healing: if company is missing for a user, create it on the fly
              if (!item && table === 'companies' && column === 'owner_user_id') {
                const newItem = {
                  id: 'c-' + Math.random().toString(36).substring(2, 9),
                  owner_user_id: value,
                  company_name: 'Demo Corp',
                  created_at: new Date().toISOString()
                }
                data.push(newItem)
                setStorage(`mock_companies`, data)
                item = newItem
              }
              
              return { data: item || null, error: null }
            },
            order: (col: string, { ascending }: any = {}) => ({
              async then(resolve: any) {
                const data = getStorage(`mock_${table}`).filter((i: any) => i[column] === value)
                resolve({ data, error: null })
              }
            }),
            async then(resolve: any) {
              const data = getStorage(`mock_${table}`).filter((i: any) => i[column] === value)
              resolve({ data, error: null })
            }
          }),
          async then(resolve: any) {
            const data = getStorage(`mock_${table}`)
            resolve({ data, error: null })
          }
        }),
        insert: (item: any) => {
          return {
            select: () => ({
              single: async () => {
                const items = Array.isArray(item) ? item : [item]
                const data = getStorage(`mock_${table}`)
                const createdItems = items.map(i => ({
                  id: 'id-' + Math.random().toString(36).substring(2, 9),
                  ...i,
                  created_at: new Date().toISOString()
                }))
                data.push(...createdItems)
                setStorage(`mock_${table}`, data)
                return { data: createdItems[0], error: null }
              }
            }),
            async then(resolve: any) {
              const items = Array.isArray(item) ? item : [item]
              const data = getStorage(`mock_${table}`)
              const createdItems = items.map(i => ({
                id: 'id-' + Math.random().toString(36).substring(2, 9),
                ...i,
                created_at: new Date().toISOString()
              }))
              data.push(...createdItems)
              setStorage(`mock_${table}`, data)
              resolve({ data: Array.isArray(item) ? createdItems : createdItems[0], error: null })
            }
          }
        },
        update: (item: any) => ({
          eq: (column: string, value: any) => ({
            async then(resolve: any) {
              const data = getStorage(`mock_${table}`)
              const idx = data.findIndex((i: any) => i[column] === value)
              if (idx !== -1) {
                data[idx] = { ...data[idx], ...item }
                setStorage(`mock_${table}`, data)
              }
              resolve({ error: null })
            }
          })
        })
      }
    }
  } as any
}
