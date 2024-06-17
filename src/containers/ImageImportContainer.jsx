import React, {useState} from 'react';
import closeIcon from '../assets/cancelIcon.png';
import importIcon from '../assets/uploadIcon.png';
import pasteIcon from '../assets/pasteIcon.png';
import confirmIcon from '../assets/confirmIcon.png';
import styles from './ImportContainer.module.css';

function ImageImportContainer({image, onImport}) {
    const [importedImage, setImportedImage] = useState(image);
    const handleImport = () => {
        getFileFromUser();
    }
    const handlePaste = () => {
        getFileFromClipboard();
    }
    const handleClose = () => {
        document.getElementById('importModal').close();
    }
    const handleConfirm = () => {
        // send the relevant data to the top level here
        onImport(importedImage);
    }

    async function getFileFromUser(){
        const filePickerOptions = {
            types: [{
                description: "Images",
                accept: {"image/*": [".png", ".gif", ".jpeg", ".jpg"]},
            }],
            excludeAcceptAllOption: true,
            multiple: false,
        };
        [chosenFileHandle] = await window.showOpenFilePicker(filePickerOptions);
        if(verifyFilePermission(chosenFileHandle, false)){
            const fileData = await chosenFileHandle.getFile();
            setImportedImage(fileData);
        }
    }
    async function verifyFilePermission(fileHandle, requestWrite){
        const options = {mode: 'read'};
        if(requestWrite){
            options.mode = 'readwrite';
        }

        if((await fileHandle.queryPermission(opts)) === "granted"){
            return true;
        }else if((await fileHandle.requestPermission(opts)) === "granted"){
            return true;
        }
        return false;
    }
    async function getFileFromClipboard(){
        const clipboardContents = await navigator.clipboard.read();
        for (const item of clipboardContents) {
            if (item.types.includes("image/png")) {
                const blob = await item.getType("image/png");
                setImportedImage(URL.createObjectURL(blob));
                return;
            }
        }
    }

    return (
        <dialog id='importModal'>
            <div className={styles.panelRowLeft}>
                <button id='import' onClick={handleImport}>
                    <img src={importIcon} className={styles.icon} alt='Button to import an image from your computer' />
                </button>
                <button id='paste' onClick={handlePaste}>
                    <img src={pasteIcon} className={styles.icon} alt='Button to paste an image from the clipboard' />
                </button>
                <button id='cancel' onClick={handleClose}>
                    <img src={closeIcon} className={styles.icon} alt='Button to cancel the import' />
                </button>
            </div>

            <img className={styles.previewImg} src={importedImage} alt='A preview of the imported image' />

            <div className={styles.panelRowRight}>
                <button id='confirm' onClick={handleConfirm}>
                    <img src={confirmIcon} className={styles.icon} alt='Button to confirm the import' />
                </button>
            </div>
        </dialog>
    );
}
export default ImageImportContainer;