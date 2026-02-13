// Em: lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../types/database.types' // Ajuste o caminho se necessário

// Crie e exporte uma única instância do cliente Supabase para ser usada em todo o lado do cliente.
// Isso resolve o aviso "Multiple GoTrueClient instances".
export const supabase = createClientComponentClient<Database>()