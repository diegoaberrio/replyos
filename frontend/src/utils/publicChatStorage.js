const PUBLIC_CHAT_STORAGE_KEY = 'replyos_public_chat_session';

export function savePublicChatSession(session) {
  localStorage.setItem(PUBLIC_CHAT_STORAGE_KEY, JSON.stringify(session));
}

export function getPublicChatSession() {
  const raw = localStorage.getItem(PUBLIC_CHAT_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(PUBLIC_CHAT_STORAGE_KEY);
    return null;
  }
}

export function clearPublicChatSession() {
  localStorage.removeItem(PUBLIC_CHAT_STORAGE_KEY);
}