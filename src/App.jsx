import React, {useState} from 'react';
import logotype from './assets/sobelLogotype.svg';
import demoImg from '/DemoImage.png';
import ModifierList from './containers/ModifierListContainer';
import ImageImportContainer from './containers/ImageImportContainer';
import ResultPreview from './containers/ResultPreviewContainer';
import './App.css';

function App() {
    const [image, setImage] = useState(demoImg);
    const [modifiers, setModifiers] = useState([0.5, 0.5, 0.5, 0.5, 0.5]);
    const [limits, setLimits] = useState([0.4, 1.0]);
    const [colors, setColors] = useState([[0.0, 0.0, 0.0], [1.0, 1.0, 1.0]]);

    const openImportModal = () => {
        document.getElementById('importModal').showModal();
    }
    const handleImport = (imported) => {
        setImage(imported);
        document.getElementById('importModal').close();
    }
    const handleModifierUpdate = (index, value) => {
        var newMods = modifiers.map((item, id) => {
            if(id === index){
                return (value / 100.0);
            }else{
                return item;
            }
        });
        setModifiers(newMods);
    }
    const handleLimitUpdate = (index, value) => {
        var newLimits = limits.map((item, id) => {
            if(id === index){
                return (value / 100.0);
            }else{
                return item;
            }
        });
        setLimits(newLimits);
    }
    const handleColorUpdate = (index, value) => {
        var newColors= colors.map((item, id) => {
            if(id === index){
                return value;
            }else{
                return item;
            }
        });
        setColors(newColors);
    }
    
    return (
        <>
            <ModifierList onSetModifier={handleModifierUpdate} onSetLimit={handleLimitUpdate} onSetColor={handleColorUpdate} />
            <ImageImportContainer image={image} onImport={handleImport} />

            <section className='topBanner'>
                <img id='LogoType' src={logotype} alt='Sobel, a webapp for converting found images to a lineart style' />
            </section>

            <ResultPreview imgToPreview={image} modifiers={modifiers} lineWidthLimits={limits} colors={colors} onOpenImportModal={openImportModal} />

            <section className='bottomBanner'>
                Webapp by Yeggnog on [<a href='https://github.com/Yeggnog'>Github</a>]
            </section>
        </>
    );
}
export default App;