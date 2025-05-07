import React, { useState, useCallback, useEffect, useRef } from 'react';
import Cropper from 'react-easy-crop';
import html2canvas from 'html2canvas';
import * as fabric from 'fabric';


const SnippingTool = () => {
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  // Capture the screenshot
  const captureScreen = async () => {
    const canvas = await html2canvas(document.body);
    const dataUrl = canvas.toDataURL();
    setImage(dataUrl);
    setShowCropper(true);
  };

  // Handle crop complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Get the cropped image
  const getCroppedImage = async () => {
    if (!croppedAreaPixels || !image) return;

    const imageElement = new Image();
    imageElement.src = image;
    imageElement.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedImage = canvas.toDataURL();
      setImage(croppedImage);
      setShowCropper(false);
      initFabricCanvas(croppedImage);
    };
  };

  // Initialize the Fabric.js canvas for drawing
  const initFabricCanvas = (croppedImage) => {
    const canvasEl = canvasRef.current;
    const fabricCanvas = new fabric.Canvas(canvasEl, {
      isDrawingMode: false,
    });
    fabricCanvasRef.current = fabricCanvas;

    const img = new Image();
    img.src = croppedImage;
    img.onload = () => {
      fabric.Image.fromURL(img.src, (imgInstance) => {
        fabricCanvas.setWidth(imgInstance.width);
        fabricCanvas.setHeight(imgInstance.height);
        fabricCanvas.setBackgroundImage(imgInstance, fabricCanvas.renderAll.bind(fabricCanvas));
      });
    };
  };

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = !fabricCanvas.isDrawingMode;
      setIsDrawing(fabricCanvas.isDrawingMode);
    }
  };

  // Clear all drawings
  const clearCanvas = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.setBackgroundImage(image, fabricCanvas.renderAll.bind(fabricCanvas));
    }
  };

  return (
    <div>
      <button onClick={captureScreen}>Take Screenshot</button>

      {showCropper && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <button onClick={getCroppedImage}>Crop</button>
        </div>
      )}

      {image && !showCropper && (
        <div>
          <h3>Cropped Image:</h3>
          <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
          <div>
            <button onClick={toggleDrawingMode}>
              {isDrawing ? 'Disable Draw Lines' : 'Enable Draw Lines'}
            </button>
            <button onClick={clearCanvas}>Clear</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippingTool;
