import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useTranslation } from 'react-i18next';
import ReactFileReader from 'react-file-reader';

import Button from '../Submit/SubmitButton';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DocumentsService from 'services/DocumentsService';

import './FileUploader.scss';

export default function FilePicker({ disabled, label, name, value, onChange }) {
	let fileTypes = ['JPEG', 'PNG', 'GIF', 'SVG' , 'JPG'];
	// const [file, setFile] = useState(null);

	// const [value, setImg] = useState({});

	const { t } = useTranslation();
	// const handleChange = (file) => {
	// 	setFile(file);
	// };

	// const handleDrop = (e, v, d) => {
	// 	setImg(e);

	// };
	// const handleChange = (e, v, d) => {
	// };

	return (
		<div className='image-picker-container'>
			{/* <h1>Hello To Drag & Drop Files</h1> */}
			{/* <FileUploader
				multiple={false}
				handleChange={handleChange}
				name='file'
				label='im a label here'
				types={fileTypes}
				disabled={false}
				hoverTitle={'שחרר קובץ כאן'}
				value={img}
				classes={'custom-upload-class'}
				// maxSize={}//the maximum size of the file (number in mb)
				// onSizeError={}//function that will be called only of error occurred related to size min or max
				onDrop={handleDrop} //function that will be called when the user drops file(s) on the drop area only
				// onSelect={}//function that will be called when the user selects file(s) on click the file area only
			></FileUploader> */}
			{/* TODO: add error msg for wrong files */}
			<ReactFileReader handleFiles={onChange} base64={true}>
				<div className='picker-drop-area'>
					{!!Object.keys(value)?.length ? (
						<>
							<div
								className='reset-input-container'
								onClick={() => onChange({})}
							>
								<DeleteOutlinedIcon
									sx={{ height: 20, width: 16, color: 'rgba(0,0,0,0.6)' }}
								/>
							</div>
							<div>
								<img
									src={value.base64}
									alt=''
									style={{ maxHeight: 75 }}
								/>
							</div>
						</>
					) : (
						<>
							<div>
								<AddPhotoAlternateIcon
									sx={{ height: 23, width: 23, color: 'rgba(0,0,0,0.6)' }}
								/>
							</div>
							<div style={{ marginBottom: 10 }}>
								<p>
									{t(`entity_form.form_controls.file_picker.upload_file`)}{' '}
									{`${[...fileTypes].toString()}`}
								</p>
								<p>
									{t(`entity_form.form_controls.file_picker.size`)}
									{` 200 * 200 `}
								</p>
							</div>
							<div>
								<Button
									variant='outlined'
									label='בחר קובץ'
									labelStyle={{
										fontSize: 14,
										color: '#2EC4B6',
										fontWeight: 500,
									}}
									buttonStyle={{ height: 28, width: 101 }}
								/>
							</div>
						</>
					)}
				</div>
			</ReactFileReader>

			{/* <p>{file ? `File name: ${file[0].name}` : 'no files uploaded yet'}</p> */}
		</div>
	);
}
