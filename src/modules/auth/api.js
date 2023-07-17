import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "/firebase.config";
import router from "@/router";
import add from "date-fns/fp/add";

const auth = getAuth();
const usersRef = collection(db, "users");

export const signUp = async ({ email, password, name, phone, role }) => {
  try {
    //criar o usuario para o authentication
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // atualizando com nome completo e numero de telefone
    await updateProfile(user, {
      displayName: name,
      phoneNumber: phone,
    });
    // criar um usuário no firestore na coleção users usando email e role
    await userRole({ email, name, role });
    return user;
  } catch (err) {
    console.error(err);
    return;
  }
};

async function userRole(payload) {
  //pegar o ususario primeiro e depois adicionar a role
  const q = query(usersRef, where("email", "==", payload, email));
  const qSnapshot = await getDocs(q);
  const dataPrevious = qSnapshot.doc[0].data();

  const docRef = await addDoc(collection(db, "users"), {
    ...dataPrevious,
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef;
}

export async function addRole() {
  const payload = {
    Role: this.role,
    email: this.email,
    name: this.displayName,
  };
  await userRole(payload);
}

export const signIn = async (email, password) => {
  try {
    // fazendo login com authentication
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // pega o email do user e procura o usuario la no firestore
    const q = query(usersRef, where("email", "==", email));
    const qSnapshot = await getDocs(q);

    if (qSnapshot.docs.length > 1) {
      throw new Error("Problema com essa conta");
    }

    let myUserData = qSnapshot.docs[0].data();
    return { ...user, ...myUserData };
  } catch (error) {
    return;
  }
};
export const logout = async () =>
  signOut(auth)
    .then(() => {
      // LogOut com sucesso
      router.push("/");
    })
    .catch((error) => {
      alert("Ocorreu um erro!");
    });

export const isLogged = async () => {
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
      //console.log(user);
      //role == 'dificl' ? router.puhs('rearedsad') : router.push('dsadsa')

      return user;
    } else {
      alert("Faça seu login");
      router.push("/");
      return false;
    }
  });
};
