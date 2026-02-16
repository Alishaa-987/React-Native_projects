import { auth, fireStore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter, usePathname } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserType | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // subscribe once to auth state changes
    useEffect (()=>{
        const unsub = onAuthStateChanged(auth, (firebaseUSer)=>{
            console.log('firebase user:', firebaseUSer);
            console.log('firebase user displayName:', firebaseUSer?.displayName, 'uid:', firebaseUSer?.uid);
            if(firebaseUSer){
                setUser({
                uid: firebaseUSer?.uid,
                email: firebaseUSer?.email,
                name: firebaseUSer?.displayName
            });
                updateUserData(firebaseUSer?.uid);
                // only navigate to tabs if app is at root or on auth screens
                if(pathname === '/' || pathname?.startsWith('/(auth)')){
                    router.replace("/(tabs)")
                }
            }else{
                setUser(null);
                // on sign out, always send user to welcome/login flow
                router.replace("/(auth)/welcome");
            }
        });

        return () => unsub();
    }, [router, pathname])

    const login = async (email: string , password:string) =>{
        try{
            await signInWithEmailAndPassword(auth, email, password);
            return {success:true};
        }catch(error : any){
            let msg = error.message;
            console.log("error  message", msg);
            if(msg.includes("auth/invalid-credential")){
                msg = "Invalid crdentials. Please check your email and password.";
            }
            return {success:false, msg};
        }
    }


       const  register = async (email: string , password:string , name:string) =>{
        try{
            let response = await createUserWithEmailAndPassword(auth, email, password);
            // set the displayName on the Firebase Auth user so firebaseUser.displayName is available
            try{
                await updateProfile(response.user, { displayName: name });
            }catch(err){
                console.log('Failed to update auth displayName:', err);
            }
            await setDoc(doc(fireStore, "users", response?.user?.uid),{
                name,
                email,
                uid: response?.user?.uid
            })
            return {success:true};
        }catch(error : any){
            let msg = error.message;
            console.log("error  message", msg);
              if(msg.includes("auth/email-already-in-use")){
                msg = "Email is already in use.";
            } else if(msg.includes("auth/invalid-email")){
                msg = "Invalid email address.";
            } else if(msg.includes("auth/weak-password")){
                msg = "Password is too weak.";
            }
            return {success:false, msg};
        }
    };

    const updateUserData = async (uid: string) =>{
        try{
           const docRef = doc(fireStore,"users" , uid);
           const docSnap = await getDoc(docRef);
           const firebaseUser = auth.currentUser;

           if (docSnap.exists()){
            const data = docSnap.data();
            console.log('Firestore user document data for', uid, ':', data);
            const userData : UserType = {
                uid: data?.uid,
                name : data?.name || firebaseUser?.displayName || null,
                email: data?.email || null,
                image: data?.image || null
            };
            setUser({...userData});
            console.log('Auth context setUser ->', userData);
           }
        }catch(error : any){
            let msg = error.message;
            console.log("error:", msg);
            // return {success:false, msg};
        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAth must be used within an AuthProvider");  
    }
    return context;
}

