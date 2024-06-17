import {useEffect} from 'react';
import addIcon from '../assets/addIcon.png';
import exportIcon from '../assets/downloadIcon.png';
import copyIcon from '../assets/copyIcon.png';
import { initPreview } from '../components/webGLHandler';
import styles from './ImportContainer.module.css';
import '../App.css';

function ResultPreview({imgToPreview, onOpenImportModal, modifiers, lineWidthLimits, colors}) {
    useEffect(() => {
        initPreview(modifiers, lineWidthLimits, colors);
    }, [imgToPreview, modifiers, lineWidthLimits, colors]);

    const handleExport = () => {
        // run draw code before blobbing to avoid blank-copy issue
        initPreview(modifiers, lineWidthLimits, colors);

        const blobPromise = getCanvasBlob().then((blob) => {
            saveToFile(blob);
        });
    }
    async function handleCopy() {
        // run draw code before blobbing to avoid blank-copy issue
        initPreview(modifiers, lineWidthLimits, colors);

        const blobPromise = getCanvasBlob().then((blob) => {
            let data = [new ClipboardItem({ [blob.type]: blob })];
            navigator.clipboard.write(data).then(
                () => {},
                (err) => {
                    // error state
                    console.log('threw error '+err);
                },
            );
        });
    }
    function getCanvasBlob(){
        return new Promise((resolve) => {
            document.getElementById('GLCanvas').toBlob((newBlob) => {
                resolve(newBlob);
            });
        });
    }
    async function saveToFile(blob){
        const fileHandle = await window.showSaveFilePicker();
        const fStream = await fileHandle.createWritable();
        await fStream.write(blob);
        await fStream.close();
    }

    return (
        <section className='mainContent'>
            <div className={styles.panelRowLeft}>
                <button id='import' onClick={onOpenImportModal}>
                    <img src={addIcon} className={styles.icon} alt='Button to open the image import menu' />
                </button>
                <button id='export' onClick={handleExport}>
                    <img src={exportIcon} className={styles.icon} alt='Button to export the result to your computer' />
                </button>
                <button id='copy' onClick={handleCopy}>
                    <img src={copyIcon} className={styles.icon} alt='Button to copy the result to the clipboard' />
                </button>
            </div>

            <canvas id='GLCanvas' width='600' height='600'></canvas>
            <img id='PreviewImg' src={imgToPreview} />
        </section>
    );
}
export default ResultPreview;