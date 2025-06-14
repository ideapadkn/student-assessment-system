import { db } from '@/firebase/config'
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore"

export function listenToChat(userId, callback) {
  const q = query(collection(db, 'chats', userId, 'messages'), orderBy('createdAt'))
  return onSnapshot(q, (querySnapshot) => {
    const messages = []
    querySnapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }))
    callback(messages)
  })
}

export async function sendMessageToFirestore(userId, message) {
  await addDoc(collection(db, 'chats', userId, 'messages'), {
    ...message,
    createdAt: new Date()
  })
}
