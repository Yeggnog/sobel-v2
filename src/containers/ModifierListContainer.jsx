import React, {useState} from 'react';
import ModifierChip from '../components/ModifierChip';
import LineWidthChip from '../components/LineWidthChip';
import ColorPickerChip from '../components/ColorPickerChip';
import hueIcon from '../assets/hueIcon.png';
import satIcon from '../assets/satIcon.png';
import valueIcon from '../assets/valueIcon.png';
import chromaIcon from '../assets/chromaIcon.png';
import greyIcon from '../assets/greyIcon.png';
import '../App.css';

function ModifierList({onSetModifier, onSetLimit, onSetColor}) {
    const [hueMod, setHueMod] = useState(20);
    const handleHueUpdate = (event) => {
        setHueMod(event.target.value);
        onSetModifier(0, event.target.value);
    }
    const [satMod, setSatMod] = useState(70);
    const handleSatUpdate = (event) => {
        setSatMod(event.target.value);
        onSetModifier(1, event.target.value);
    }
    const [valueMod, setValueMod] = useState(20);
    const handleValueUpdate = (event) => {
        setValueMod(event.target.value);
        onSetModifier(2, event.target.value);
    }
    const [chromaMod, setChromaMod] = useState(70);
    const handleChromaUpdate = (event) => {
        setChromaMod(event.target.value);
        onSetModifier(3, event.target.value);
    }
    const [greyMod, setGreyMod] = useState(100);
    const handleGreyUpdate = (event) => {
        setGreyMod(event.target.value);
        onSetModifier(4, event.target.value);
    }

    const [lowerLimit, setLowerLimit] = useState(0.0);
    const [upperLimit, setUpperLimit] = useState(0.0);
    const handleLowLimitChange = (event) => {
        setLowerLimit(event.target.value);
        onSetLimit(0, event.target.value);
    }
    const handleHighLimitChange = (event) => {
        setUpperLimit(event.target.value);
        onSetLimit(1, event.target.value);
    }

    const [lineColor, setLineColor] = useState('#000000');
    const [BGColor, setBGColor] = useState('#ffffff');
    const handleLineColorChange = (event) => {
        setLineColor(event.target.value);
        var rgb = hexToRgb(event.target.value);
        console.log('set the line color to '+rgb);
        onSetColor(0, rgb);
    }
    const handleBGColorChange = (event) => {
        setBGColor(event.target.value);
        var rgb = hexToRgb(event.target.value);
        console.log('set the bg color to '+rgb);
        onSetColor(1, rgb);
    }
    function hexToRgb(hex){
        // parse with a regex
        var parsedHex = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
        return [parseInt(parsedHex[1], 16)/100.0, parseInt(parsedHex[2], 16)/100.0, parseInt(parsedHex[3], 16)/100.0];
    }

    return (
        <div className='modifierList'>
            <ModifierChip id='hue' value={hueMod} icon={hueIcon} onUpdate={handleHueUpdate} />
            <ModifierChip id='saturation' value={satMod} icon={valueIcon} onUpdate={handleSatUpdate} />
            <ModifierChip id='value' value={valueMod} icon={satIcon} onUpdate={handleValueUpdate} />
            <ModifierChip id='color' value={chromaMod} icon={chromaIcon} onUpdate={handleChromaUpdate} />
            <ModifierChip id='greyscale' value={greyMod} icon={greyIcon} onUpdate={handleGreyUpdate} />
            <LineWidthChip id='lineWidth' lineColor={lineColor} BGColor={BGColor} onUpdate={handleLowLimitChange} />
            <br />
            <br />
            <ColorPickerChip id='colorPicker' lineColor={lineColor} onLineColorChanged={handleLineColorChange} BGColor={BGColor} onBGColorChanged={handleBGColorChange} />
        </div>
    );
}
export default ModifierList;