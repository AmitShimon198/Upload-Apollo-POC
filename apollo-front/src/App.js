import logo from './logo.svg';
import './App.css';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { gql, useMutation } from '@apollo/client';
const uploadFileMutation = gql`
  mutation UploadImage($file: Upload!) {
    singleUpload(file: $file)
  }
`;

function App() {
  const [upload] = useMutation(uploadFileMutation);
  const onDrop = useCallback(acceptedFiles => {
    upload({
      variables: {
        file: acceptedFiles[0]
      },
      skip: !acceptedFiles?.length
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}{...getRootProps()}>
      <input {...getInputProps()} />
      <div style={{
        background: !isDragActive ? '#ffffff' : '#ffffc2',
        width: '50%',
        height: '50%',
        textAlign: 'center',
        verticalAlign: 'center',
        border: '1px solid #000000'
      }}>{isDragActive ? 'Drop the files here ...' : 'Drag and drop some files here, or click to select files'}</div> :
    </div>
  )
}

export default App;
