import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { supabase } from '../supabaseClient';


export default function Profile() {
    // const [fileUploadError, setFileUploadError] = useState(false);
    // const [fileURL, setFileURL] = useState("")


    const fileRef = useRef(null);
    const { currentUser } = useSelector((state) => state.user);
    const [filePerc, setFilePerc] = useState(0);


    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({});


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
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
            const filePath = `${fileName}`


            // 1. UPLOAD TO SUPABASE
            // Change "property-images" to your actual bucket name!
            let { error: uploadError } = await supabase.storage
                .from("property-images")
                .upload(filePath, selectedFile);

            if (uploadError) throw uploadError;
            setFilePerc(50);

            // 2. GET PUBLIC URL
            const { data } = supabase.storage
                .from("property-images")
                .getPublicUrl(filePath);

            setFilePerc(100);
            setFormData({ ...formData, avatar: data.publicUrl });
            alert("Image uploaded and preview updated!");


            // if (!file) {
            //     alert("Please select a file to upload.")
            //     return;
            // }


            // let { data, error } = await supabase.storage.from("property-images").upload(filePath, file)

            // if (error) {
            //     throw error;
            // }

            // const { data: url } = await supabase.storage.from("property-images").getPublicUrl(filePath)

            // console.log(url.publicUrl);

            // setFileURL(url.publicUrl)

            // alert("File uploaded successfully.")

        } catch (error) {
            alert("Error uploading file:", error.message)
        } finally {
            setUploading(false)
        }
    }


    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4'>
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

                <input type='text' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg' />
                <input type='email' defaultValue={currentUser.email} id='email' className='border p-3 rounded-lg' />
                <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>
                    Update Profile
                </button>
            </form>
        </div>
    );
}