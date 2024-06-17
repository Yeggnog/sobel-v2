import React, {useState, useEffect} from "react";
import styles from './Modifiers.module.css';

// handle window resizing for the slider display
function useWindowSize(){
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        addEventListener("resize", handleResize);
    }, []);

    const handleResize = () => {
        setWindowSize(window.innerWidth, window.innerHeight);
    }
    return windowSize;
}

function LineWidthChip({id, lineColor, BGColor, value, onUpdate}){
    const windowSize = useWindowSize();
    useEffect(() => {
        // hot-resize the slider display parameters to match the slider input
        let sliderRect = document.getElementById('lineWidthSlider').getBoundingClientRect();
        document.getElementById('lineWidthDisplay').style=`border-top: ${sliderRect.height}px solid ${BGColor}; border-right: ${sliderRect.width}px solid ${lineColor}`
    }, [lineColor, BGColor, windowSize]);

    return (
        <div id={id} className={styles.chipBody}>
            <div className={styles.chipRow}>
                <div className={styles.lineWidthSlider}>
                    <input className={styles.dualSliderOverlay} type='range' id='lineWidthSlider' onChange={onUpdate} value={value} />
                    <label for='lineWidthSlider' alt="Slider to control the line width of the final image">
                        <span className={styles.dualSliderUnderlay} id='lineWidthDisplay'></span>
                    </label><br />
                </div>
            </div>
        </div>
    );
}
export default LineWidthChip;