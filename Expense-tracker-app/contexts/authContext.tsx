import { auth, fireStore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserType | null>(null);
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    // subscribe once to auth state changes
    useEffect (()=>{
        const unsub = onAuthStateChanged(auth, (firebaseUSer)=>{
            console.log('firebase user:', firebaseUSer);
            
            if(firebaseUSer){
                setUser({
                    uid: firebaseUSer?.uid,
                    email: firebaseUSer?.email,
                    name: firebaseUSer?.displayName
                });
                updateUserData(firebaseUSer?.uid);
            }else{
                setUser(null);
            }
            
            // Mark as ready after first auth check
            setIsReady(true);
        });

        return () => unsub();
    }, [])

    const updateUserData = async (uid: string) =>{
        try{
           const docRef = doc(fireStore,"users" , uid);
           const docSnap = await getDoc(docRef);
           const firebaseUser = auth.currentUser;

           if (docSnap.exists()){
            const data = docSnap.data();
            const userData : UserType = {
                uid: data?.uid,
                name : data?.name || firebaseUser?.displayName || null,
                email: data?.email || null,
                image: data?.image || null
            };
            setUser({...userData});
           }
        }catch(error : any){
            console.log("error:", error);
        }
    };

    const login = async (email: string , password:string) =>{
        try{
            await signInWithEmailAndPassword(auth, email, password);
            return {success:true};
        }catch(error : any){
            let msg = error.message;
            console.log("error  message", msg);
            if(msg.includes("auth/invalid-credential")){
                msg = "Invalid credentials. Please check your email and password.";
            }
            return {success:false, msg};
        }
    }

    const register = async (email: string , password:string , name:string) =>{
        try{
            let response = await createUserWithEmailAndPassword(auth, email, password);
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
        throw new Error("useAuth must be used within an AuthProvider");  
    }
    return context;
}
