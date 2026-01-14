import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice.js';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';


export default function Profile() {

    const fileRef = useRef(null);
    const dispatch = useDispatch()

    const { currentUser, loading, error } = useSelector((state) => state.user);

    const [filePerc, setFilePerc] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);



    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile || uploading) return;

        // ✅ Validate image
        if (!selectedFile.type.startsWith('image/')) {
            alert('Only image files are allowed');
            return;
        }

        // ✅ 2MB limit
        if (selectedFile.size > 2 * 1024 * 1024) {
            alert('Image must be under 2MB');
            return;
        }


        // Automatically trigger upload when file is picked
        if (selectedFile) {
            handleUpload(selectedFile);
        }
    }


    const handleUpload = async (selectedFile) => {
        try {
            setUploading(true)
            setFilePerc(10)

            const fileExt = selectedFile.name.split(".").pop()
            const fileName = `${currentUser._id}-${Math.random()}.${fileExt}`


            // 1. UPLOAD TO SUPABASE
            let { error: uploadError } = await supabase.storage
                .from("property-images")
                .upload(fileName, selectedFile, {
                    upsert: true,
                    contentType: selectedFile.type,
                });

            if (uploadError) throw uploadError;

            setFilePerc(50);

            // 2. GET PUBLIC URL
            const { data } = supabase.storage
                .from("property-images")
                .getPublicUrl(fileName);


            setFilePerc(100);

            // Safe state update
            setFormData(prev => ({
                ...prev,
                avatar: data.publicUrl
            }));

            // setFormData({ ...formData, avatar: data.publicUrl });

        } catch (error) {
            alert(`Error uploading file: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));

        // setFormData({ ...formData, [e.target.id]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(updateUserStart())

            const payload = { ...formData };

            // Password update handling
            if (!payload.password || payload.password.trim() === "") {
                delete payload.password;
            }

            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            })

            const data = await res.json()
            if (data.success === false) {
                dispatch(updateUserFailure(data.message))
                return;
            }

            dispatch(updateUserSuccess(data))
            setUpdateSuccess(true)
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const data = await res.json()
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message))
                return;
            }

            dispatch(deleteUserSuccess(data))
            // setUpdateSuccess(true)
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignOut = async () => {
        dispatch(signOutUserStart())

        try {
            const res = await fetch('/api/auth/signout')
            const data = await res.json()

            if (data.success === false) {
                dispatch(signOutUserFailure(data.message))
                return;
            }

            dispatch(signOutUserSuccess(data))
        } catch (error) {
            dispatch(signOutUserFailure(error.message))
        }
    }


    const handleShowListings = async () => {
        try {
            setShowListingsError(false)

            const res = await fetch(`/api/user/listing/${currentUser._id}`, {
                method: 'GET',
                credentials: 'include'
            })

            const data = await res.json()
            if (data.success === false) {
                setShowListingsError(true)
                return;
            }

            setUserListings(data)
        } catch (error) {
            setShowListingsError(true)
        }
    }


    const handleListingDelete = async (listingID) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingID}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const data = await res.json()
            if (data.success === false) {
                console.log(data.message);
                return;
            }

            setUserListings((prev) => prev.filter((listing) => listing._id !== listingID))

        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
                <input
                    onChange={handleFileChange}
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/*'
                />

                {/* Clicking image triggers the hidden file input */}
                <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt='profile'
                    className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
                />

                {/* Progress Messages */}
                <p className='text-sm self-center'>
                    {uploading ? (
                        <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className='text-green-700'>Image successfully uploaded!</span>
                    ) : null}
                </p>

                <input
                    type='text'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    id='username'
                    className='border p-3 rounded-lg' />

                <input
                    type='email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    id='email'
                    className='border p-3 rounded-lg' />

                <input
                    type='password'
                    placeholder='password'
                    onChange={handleChange}
                    id='password'
                    className='border p-3 rounded-lg'
                />
                <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>
                    {loading ? 'Loading...' : 'Update'}
                </button>

                <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
                    Create Listing
                </Link>

            </form>
            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete account</span>
                <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
            </div>

            <p className='text-red-700 mt-5'>{error ? error : ''}</p>
            <p className='text-green-700 mt-5'>
                {updateSuccess ? 'User is updated successfully!' : ''}
            </p>

            <button onClick={handleShowListings} className='text-green-700 w-full'>
                Show Listings
            </button>
            <p className='text-red-700 mt-5'>
                {showListingsError ? 'Error showing listings' : ''}
            </p>


            {userListings &&
                userListings.length > 0 &&
                <div className="flex flex-col gap-4">
                    <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
                    {userListings.map((listing) => (
                        <div
                            key={listing._id}
                            className='border rounded-lg p-3 flex justify-between items-center gap-4'
                        >
                            <Link to={`/listing/${listing._id}`}>
                                <img
                                    src={listing.imageURLs[0]}
                                    alt='listing cover'
                                    className='h-16 w-16 object-contain'
                                />
                            </Link>
                            <Link
                                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                                to={`/listing/${listing._id}`}
                            >
                                <p>{listing.name}</p>
                            </Link>

                            <div className='flex flex-col item-center'>
                                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                                <Link to={`/update-listing/${listing._id}`}>
                                <button className='text-green-700 uppercase'>Edit</button>
                                </Link>

                            </div>
                        </div>
                    ))}
                </div>}


        </div>
    );
}