import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";



export default function PlacePages() {
    const { action } = useParams()
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [photoLink, setPhotoLink] = useState('')
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState()
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4 text-left">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm text-left">{text}</p>
        )
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    async function addPhotoByLink(e) {
        e.preventDefault();
        const { data:filename } = await axios.post('/upload-by-link', { link: photoLink })
        setAddedPhotos(prev => {
            console.log('tai anh',prev)
            return [...prev,filename]
        })
        setPhotoLink('')
    }


    async function uploadPhoto(e) {
        e.preventDefault()
        const files = e.target.files
        const data = new FormData()
        for (let i = 0; i < files.length; i++){
            data.append('photos',files[i])
        }
        axios.post('/upload', data, {
            headers: {'Content-type':'multipart/form-data'}
        }).then(response => {
            const { data:filenames } = response
            setAddedPhotos(prev => {
                console.log('upload anh',prev)
                return [...prev,filenames]
            })
        })
    }

    return (
    <div>
        { action !== 'new' && (
        <div className="text-center">
            <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
                Add new place
            </Link>
        </div>
            )}
            {action === 'new' && (
                <div>
                    <form>
                        {preInput('Tiêu đề','Tiêu đề cho điểm đến')}
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề" />
                        {preInput('Địa chỉ','Địa chỉ điểm đến')}
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Địa chỉ" />
                        {preInput('Ảnh','Nên để nhiều ảnh')}
                        <div className="flex gap-2">
                            <input type="text" value={photoLink} onChange={e => setPhotoLink(e.target.value)} placeholder={'Sử dụng link.......'} />
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Thêm&nbsp;ảnh</button>
                        </div>
                        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {addedPhotos.length > 0 && addedPhotos.map(link => (
                            <div key={link}>
                                <img className="rounded-2xl w-full object-cover" src={`http://localhost:8080/uploads/${link}`} alt='Uploaded Image' />
                            </div>
                        ))}
                        
                            <label className="cursor-pointer flex items-center justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                            <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                                Upload
                            </label>
                        </div>
                        {preInput('Mô tả','Mô tả điểm đến')}
                        <textarea value={description} onChange={e => setDescription(e.target.value)}/>
                        {preInput('Đặc quyền','Chọn đặc quyền ưa thích')} 
                        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                            <Perks selected = {perks} onChange={setPerks}/>

                        </div>
                        {preInput('Thêm thông tin','Ví dụ như luật của phòng..')}
                        <p className="text-gray-500 text-sm"></p>
                        <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)}/>
                        {preInput('Giờ vào và giờ ra','Thêm giờ check in và giờ check out')}
                        <p className="text-gray-500 text-sm"></p>
                        <div className="grid sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1">Giờ check in</h3>
                                <input className="" type="text" value={checkIn} onChange={e => setCheckIn(e.target.value)} placeholder="14:00 a.m" />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Giờ check out</h3>
                                <input className="" type="text" value={checkOut} onChange={e => setCheckOut(e.target.value)} placeholder="11:00 p.m"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Số lượng khách</h3>
                                <input className="" type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} />
                            </div>
                        </div>
                            <button className="primary my-4">Save</button>
                    </form>
                </div>
        )}
    </div> 
    )
}