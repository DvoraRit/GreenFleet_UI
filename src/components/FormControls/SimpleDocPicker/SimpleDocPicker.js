import React, { useState, useEffect } from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import './SimpleDocPicker.scss';
import Dropzone from 'react-dropzone';

import DocumentsService from 'services/DocumentsService';

import Spinner from '../../Spinner/Spinner';

function SimpleDocPicker({ value, onChange }) {
	const [error, setError] = useState('');
	const [tempFile, setTempFile] = useState({});
	const [file, setFile] = useState({});
	const [loading, setLoading] = useState(false);

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
		setLoading(true);
		try {
			const doc_id = await DocumentsService.uploadDocument({
				doc: tempFile,
				entity_name: 'orders',
			});
			if (doc_id) {
				onChange([doc_id]);
			}
			setLoading(false);

			return doc_id;
		} catch (e) {
			console.error(e);
			setError('שגיאה בהעלאת הקובץ');
			setLoading(false);
		}
	};

	const getFile = async (docId) => {
		if (docId) {
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
		}
	};

	const initDocAndFile = async () => {
		let docId = await uploadDoc();
		await getFile(docId);
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

	useEffect(() => {
		//tempFile is changing on Drop so then we will give the new doc an id
		if (!!Object.keys(tempFile)?.length) {
			initDocAndFile();
			// onChange(tempfile);
		}
	}, [tempFile]);

	useEffect(() => {
		if (!!value) {
			getFile(value);
		}
	}, [value]);

	useEffect(() => {}, [file]);

	const handleAddNewDoc = () => {};

	return loading ? (
		<Spinner />
	) : (
		<div className='image-picker-container'>
			<Dropzone
				// validator={validate}
				onDrop={(acceptedFiles) => validate(acceptedFiles[0])}
			>
				{({ getRootProps, getInputProps }) => {
					return (
						<div>
							{!!value?.length || Object.keys(file)?.length ? (
								<div className='doc-picker-wrapper'>
									<div
										className='add-new-doc-container'
										// onClick={handleAddNewDoc}
									>
										{!Object.keys(file)?.length ? (
											<div className='icon-container'>
												<AttachFileIcon sx={{ color: '#2EC4B6' }} size={14} />
											</div>
										) : (
											<div
												className='delete-container'
												// onClick={() => setFile({})}
												onClick={handleDeleteFile}
											>
												<DeleteOutlinedIcon />
											</div>
										)}
										<div className='text-container'>{`${file?.file_origin_name} (${file?.file_size_mb})mb`}</div>
									</div>
								</div>
							) : (
								<div {...getRootProps()}>
									<input
										{...{
											...getInputProps(),
											// disable: true,
											multiple: false,
											accept: 'application/pdf',
										}}
										// accept='application/pdf'
										// maxFiles: 1,
									/>
									<div className='doc-picker-wrapper'>
										<div
											className='add-new-doc-container'
											// onClick={handleAddNewDoc}
										>
											<div className='icon-container'>
												<AttachFileIcon sx={{ color: '#2EC4B6' }} size={14} />
											</div>
											<div className='text-container'>צרף אסמכתא</div>
										</div>
									</div>
								</div>
							)}
						</div>
					);
				}}

				{/* {!!error?.length && <p style={{ color: 'red' }}> {error} </p>} */}
			</Dropzone>
		</div>
	);
}

export default SimpleDocPicker;
