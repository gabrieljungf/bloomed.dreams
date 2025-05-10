// FILE: @/lib/mocks/auth-mocks.ts
import type { User, Session, UserAppMetadata, UserMetadata, UserIdentity, Factor } from '@supabase/supabase-js';

// Definições mockadas para os tipos aninhados, se necessário.
// Você pode simplificá-los ou torná-los mais complexos conforme a necessidade do seu app.
const mockUserAppMetadata: UserAppMetadata = {
  provider: 'email',
  providers: ['email'],
  // Outros campos que você possa ter em app_metadata
};

const mockUserMetadata: UserMetadata = {
  name: 'Mock User Name', // Exemplo, conforme seu uso
  avatar_url: 'https://example.com/avatar.png', // Exemplo
  // Adicione quaisquer outros campos que você espera em user_metadata
  // Esses geralmente são os que você passa em options: { data: { ... } } no signUp
};

const mockUserIdentities: UserIdentity[] = [
  {
    identity_id: 'mock-identity-id-123',
    id: 'mock-user-id-12345', // DEVE ser o mesmo que o user.id principal
    user_id: 'mock-user-id-12345', // DEVE ser o mesmo que o user.id principal
    identity_data: {
      email: 'mock.user@example.com', // Email está AQUI, dentro de identity_data
      sub: 'mock-identity-sub-string', // Exemplo
      // Outros campos que podem vir aqui dependendo do provider
      // name: 'Mock User Name', // Se o provider retornar nome aqui também
    },
    provider: 'email',
    last_sign_in_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // A linha abaixo estava causando o erro e foi REMOVIDA:
    // email: 'mock.user@example.com'
  },
  // Você pode adicionar mais identidades mockadas aqui se o usuário tiver múltiplas (ex: logou com Google e Email)
];

// Mock para Factor, se o seu tipo User ou lógica depender dele.
// Se você não usa autenticação multi-fator nos mocks, pode ser um array vazio ou omitido se 'factors' for opcional.
const mockFactors: Factor[] = [
  // Exemplo de um fator, se necessário:
  // {
  //   id: 'mock-factor-id',
  //   created_at: new Date().toISOString(),
  //   updated_at: new Date().toISOString(),
  //   status: 'verified',
  //   friendly_name: 'Authenticator App',
  //   factor_type: 'totp'
  // }
];


export const mockAuthResponse = {
  data: {
    user: {
      // --- Propriedades Obrigatórias (baseado na sua interface) ---
      id: 'mock-user-id-12345', // Escolha um ID mock
      app_metadata: mockUserAppMetadata,
      user_metadata: mockUserMetadata,
      aud: 'authenticated', // Valor padrão para usuários autenticados
      created_at: new Date().toISOString(),

      // --- Propriedades Opcionais Comuns (preencha conforme necessário) ---
      email: 'mock.user@example.com',
      phone: '', // Deixe vazio ou coloque um número mock se usar
      confirmed_at: new Date().toISOString(), // Assume que o usuário mockado está confirmado
      email_confirmed_at: new Date().toISOString(), // Assume que o email está confirmado
      // phone_confirmed_at: new Date().toISOString(), // Se usar confirmação de telefone
      last_sign_in_at: new Date().toISOString(),
      role: 'authenticated', // Papel comum
      updated_at: new Date().toISOString(),
      identities: mockUserIdentities,
      is_anonymous: false, // Geralmente false para usuários logados
      is_sso_user: false, // Se não for um mock de SSO

      // --- Outras Propriedades Opcionais (adicione se seu app as utiliza ou espera) ---
      // confirmation_sent_at?: string
      // recovery_sent_at?: string
      // email_change_sent_at?: string
      // new_email?: string
      // new_phone?: string
      // invited_at?: string
      // action_link?: string
      factors: mockFactors, // Ou um array vazio [] se não usar MFA no mock
    } as User, // Mantenha 'as User' para checagem de tipos neste arquivo

    session: {
      access_token: 'mock-access-token-string',
      refresh_token: 'mock-refresh-token-string',
      expires_in: 3600,
      token_type: 'bearer',
      user: {} // Será preenchido abaixo
    } as Session,
  },
  error: null,
};

// Atribui o usuário mockado à sessão mockada
// Use @ts-ignore se o TypeScript reclamar da atribuição direta aqui,
// pois é uma referência circular intencional para o mock.
// @ts-ignore
mockAuthResponse.data.session.user = mockAuthResponse.data.user;