import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

let app;

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const docRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(docRef);

    if (userSnap.exists()) {
      const role = userSnap.data().role;
      localStorage.setItem('role', role); // временно храним в localStorage
    }
  }

  if (!app) {
    app = createApp(App).use(router).mount('#app');
  }
});
