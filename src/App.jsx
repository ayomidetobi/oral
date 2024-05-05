import  { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const ImageUploader = () => {
  const [predictedClass, setPredictedClass] = useState(null);
  const [isLoading,setIsLoading]=useState(false)
  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append('image', acceptedFiles[0]);

    try {
      setIsLoading(true)
      const response = await axios.post('https://nwfdzs2t-8000.uks1.devtunnels.ms/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPredictedClass(response.data.predicted_class);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      const errorMessage=error.response.data.error
      toast.error(`error: ${errorMessage}`)
      console.log(error)
      
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className='container mt-5'>
      {isLoading && (
        <div style={overlayStyle}>
          <i className='bi bi-robot text-secondary' style={{ fontSize: "100px", color: 'rgba(0, 0, 0, 0.5)' }} ></i>
          <p style={{ color: 'rgba(0, 0, 0, 0.5)' }}>Analysing...</p>
        </div>
      )}
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the image here ...</p> :
            <p>Drag 'n' drop an image here, or <span style={{ color: 'blue' }}>click to select an image</span></p>
        }
      </div>
      {predictedClass && <div className='text-center mt-5'><p> Oral Condintion base on analyses <span className='text-danger fw-bold'>{predictedClass} </span> </p>
      <button className='btn btn-primary btn-lg rounded rounded-3 mt-4'>
        Book a doctor now
      </button>
      </div>
      }
    </div>
  );
};

export default ImageUploader;

const dropzoneStyle = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent white background
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};
