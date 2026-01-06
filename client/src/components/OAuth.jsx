import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            })

            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/')
            console.log(data);

        } catch (error) {
            console.log("Couldn't sign in", error);

        }
    }

    return (
        <button className="p-3 rounded-lg uppercase hover:opacity-95 text-white bg-red-700"
            type="button"
            onClick={handleGoogleClick}
        >
            Continue with google
        </button>
    )
}

export default OAuth
