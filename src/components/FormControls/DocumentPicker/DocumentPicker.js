import React, { useState, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useTranslation } from 'react-i18next';
import ReactFileReader from 'react-file-reader';

// import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';

// import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Button from '../Submit/SubmitButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AttachFileSharpIcon from '@mui/icons-material/AttachFileSharp';
import './DocumentPicker.scss';

import DocumentsService from 'services/DocumentsService';

export default function DocumentPicker({
	disabled,
	label,
	name,
	table_name,
	value = '',
	onChange,
	IdInEntity,
}) {
	let fileTypes = ['pdf'];
	const [error, setError] = useState('');
	const [tempFile, setTempFile] = useState({});
	const [file, setFile] = useState({});
	const [loading, setLoading] = useState(false);
	const { t } = useTranslation();


	const validate = (file) => {
		if (file.size > 5 * 1000000) {
			setError('הקובץ חייב להיות מתחת ל5 מגה בייט');
		} else if (file.type !== 'application/pdf') {
			setError('הקובץ חייב להיות בפורמט PDF');
		} else {
			setError('');
			// onChange(file);
			setTempFile(file);
		}
	};
	const uploadDoc = async () => {
		const doc_id = await DocumentsService.uploadDocumentForEntity({
			doc: tempFile,
			entity_name: table_name,
			id_in_entity:IdInEntity,
		});
		if (doc_id) {
			onChange([doc_id]);
		}
		return doc_id;
	};

	const getFile = async (docId) => {
		setLoading(true);
		try {
			const doc = await DocumentsService.getDocumentById(docId);

			if (doc?.[0]) {
				setFile(doc[0]);
			}
		} catch (e) {
			console.error(e);
			setError('שגיאה בהעלאת הקובץ');
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteFile = () => {
		setLoading(true);
		DocumentsService.removeDocument(file.key, file.id)
			.then((res) => {
				setFile({});
				onChange([]);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.error(err);
			});
	};
	const initDocAndFile = async () => {
		let docId = await uploadDoc();
		await getFile(docId);
	};

	useEffect(() => {
		//tempFile is changing on Drop so then we will give the new doc an id
		if (!!Object.keys(tempFile)?.length) {
			initDocAndFile();
		}
	}, [tempFile]);

	useEffect(() => {
		if (!!value) {
			getFile(value);
		}
	}, [value]);

	return (
		<div className='image-picker-container'>
			<Dropzone
				// validator={validate}
				onDrop={(acceptedFiles) => validate(acceptedFiles[0])}
			>
				{({ getRootProps, getInputProps }) => {
					return (
						<div className='picker-drop-area'>
							{!!value || Object.keys(file)?.length ? (
								<div>
									<div
										className='reset-input-container'
										onClick={handleDeleteFile}

									>
										<DeleteOutlinedIcon
											sx={{ height: 20, width: 16, color: 'rgba(0,0,0,0.6)' }}
										/>
									</div>
									<div>
										<PictureAsPdfIcon style={{ height: 50, width: 50 }} />
										<p>{file?.file_name}</p>
									</div>
								</div>
							) : (
								<div {...getRootProps()}>
									<div>
										<AttachFileSharpIcon
											sx={{ height: 23, width: 23, color: 'rgba(0,0,0,0.6)' }}
										/>
									</div>
									<div style={{ marginBottom: 10 }}>
										<p>
											{t(
												`entity_form.form_controls.document_picker.upload_file`,
											)}{' '}
											{/* {`${[...fileTypes].toString()}`} */}
										</p>
										{/* <p>
									{t(`entity_form.form_controls.file_picker.size`)}
									{` 200 * 200 `}
								</p> */}
									</div>
									<div>
										<input
											{...{
												...getInputProps(),
												disable: true,
												multiple: false,
												accept: 'application/pdf',
											}}
											// accept='application/pdf'
											// maxFiles: 1,
										/>
										<Button
											variant='outlined'
											label='בחר מסמך'
											labelStyle={{
												fontSize: 14,
												color: '#2EC4B6',
												fontWeight: 500,
											}}
											buttonStyle={{ height: 28, width: 101 }}
										/>
									</div>
								</div>
							)}
							{!!error?.length && <p style={{ color: 'red' }}> {error} </p>}
						</div>
					);
				}}
			</Dropzone>
			{/* <p>{file ? `File name: ${file[0].name}` : 'no files uploaded yet'}</p> */}
		</div>
	);
}
