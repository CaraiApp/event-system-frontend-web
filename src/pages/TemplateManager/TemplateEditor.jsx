import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio, 
  Select, 
  MenuItem, 
  InputLabel, 
  Slider, 
  Divider, 
  Chip,
  Tooltip,
  Switch,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  CircularProgress,
  Container
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { 
  ZoomIn, 
  ZoomOut, 
  Save, 
  Delete, 
  Edit, 
  PanTool, 
  GridOn, 
  GridOff, 
  AddBox, 
  TextFields, 
  FormatColorFill, 
  BorderAll,
  Settings,
  ViewColumn,
  CropSquare,
  Title,
  Dashboard,
  LabelImportant,
  Chair,
  EventSeat,
  Weekend,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Search,
  ContentCopy
} from '@mui/icons-material';
import { SketchPicker } from 'react-color';

// Estilos y temas propios
const styles = {
  editorContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden'
  },
  toolbar: {
    padding: '8px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px'
  },
  toolbarGroup: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  canvasContainer: {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
    backgroundColor: '#e0e0e0'
  },
  canvas: {
    position: 'relative',
    margin: '20px auto',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    transformOrigin: 'top left'
  },
  statusBar: {
    padding: '4px 16px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  },
  colorPickerPopover: {
    position: 'absolute',
    zIndex: 1000
  },
  seat: {
    position: 'absolute',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    userSelect: 'none',
    transition: 'transform 0.1s ease-in-out'
  },
  selectedSeat: {
    border: '2px solid blue',
    zIndex: 10
  },
  sectionBox: {
    position: 'absolute',
    border: '2px solid #333',
    backgroundColor: 'rgba(200, 200, 200, 0.2)',
    padding: '4px',
    cursor: 'move',
    userSelect: 'none'
  },
  textElement: {
    position: 'absolute',
    padding: '4px',
    cursor: 'move',
    userSelect: 'none',
    whiteSpace: 'nowrap'
  },
  editTools: {
    position: 'absolute',
    right: '20px',
    top: '100px',
    backgroundColor: 'white',
    padding: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 100
  },
  tool: {
    margin: '5px 0'
  },
  properties: {
    padding: '16px',
    width: '300px'
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    backgroundSize: '20px 20px',
    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)'
  }
};

const TemplateEditor = () => {
  // Estado principal
  const [seats, setSeats] = useState([]);
  const [sections, setSections] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [editMode, setEditMode] = useState('add');
  const [addMode, setAddMode] = useState('seat');
  const [seatType, setSeatType] = useState('standard');

  // Estado para propiedades de asientos
  const [seatWidth, setSeatWidth] = useState(30);
  const [seatHeight, setSeatHeight] = useState(30);
  const [seatColor, setSeatColor] = useState('#A7C7E7');
  const [seatBorderColor, setSeatBorderColor] = useState('#333333');
  const [seatBorderWidth, setSeatBorderWidth] = useState(1);
  const [seatLabelSize, setSeatLabelSize] = useState(10);
  const [seatLabelColor, setSeatLabelColor] = useState('#000000');
  const [seatLabelVisible, setSeatLabelVisible] = useState(true);
  const [seatPrice, setSeatPrice] = useState(0);
  const [seatCategory, setSeatCategory] = useState('General');
  
  // Estado para diálogos
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [openTextDialog, setOpenTextDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState(null);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });

  // Estado para bulk add (añadir en masa)
  const [bulkConfig, setBulkConfig] = useState({
    section: '',
    startRow: 'A',
    rows: 5,
    seatsPerRow: 10,
    rowSpacing: 40,
    seatSpacing: 35,
    type: 'standard',
    curvature: 0,
    customRowLabels: false,
    useNumberPadding: true,
    prefix: '',
    startingNumber: 1,
    rowSuffix: ' - ',
    seatPrefix: '',
    useOnlyEven: false,
    useOnlyOdd: false,
    fixedWidth: false
  });
  
  // Estado para texto
  const [textContent, setTextContent] = useState('');
  const [textSize, setTextSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');
  const [textIsBold, setTextIsBold] = useState(false);
  
  // Estado para secciones
  const [sectionName, setSectionName] = useState('');
  const [sectionColor, setSectionColor] = useState('#d3d3d3');
  const [sectionOpacity, setSectionOpacity] = useState(0.2);
  const [sectionWidth, setSectionWidth] = useState(200);
  const [sectionHeight, setSectionHeight] = useState(150);

  // Estado para arrastrar
  const [draggingSeat, setDraggingSeat] = useState(null);
  const [draggingSectionId, setDraggingSectionId] = useState(null);
  const [draggingText, setDraggingText] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [sectionDragOffset, setSectionDragOffset] = useState({ x: 0, y: 0 });
  const [textDragOffset, setTextDragOffset] = useState({ x: 0, y: 0 });
  const [movingMultipleSeats, setMovingMultipleSeats] = useState(false);
  
  // Estado para snackbar (notificaciones)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Tamaño del editor
  const [canvasWidth, setCanvasWidth] = useState(1000);
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [canvasBackground, setCanvasBackground] = useState('#ffffff');
  const [canvasBackgroundImage, setCanvasBackgroundImage] = useState('');
  const [stageImageFile, setStageImageFile] = useState(null);
  const [stageImageSrc, setStageImageSrc] = useState('');
  const [stageImageWidth, setStageImageWidth] = useState(500);
  const [stageImageHeight, setStageImageHeight] = useState(100);
  const [stageImageX, setStageImageX] = useState(250);
  const [stageImageY, setStageImageY] = useState(50);
  
  // Pestañas para edición
  const [currentTab, setCurrentTab] = useState(0);
  
  // Referencias a elementos del DOM
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Inicialización
  useEffect(() => {
    // Código de inicialización aquí
    console.log("Template Editor initialized");
  }, []);
  
  // Función para redondear posiciones a la cuadrícula
  const GRID_SIZE = 5;
  
  const roundToGrid = (value) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };
  
  // Manejar inicio de arrastre de un asiento
  const handleSeatDragStart = (e, seat) => {
    e.stopPropagation();
    
    if (editMode !== 'select' && editMode !== 'move') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) - seat.x;
    const offsetY = (e.clientY - rect.top) - seat.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
    
    // Si el asiento está en la selección actual, mover todos los asientos seleccionados
    if (selectedSeats.some(s => s.id === seat.id)) {
      setMovingMultipleSeats(true);
    } else {
      // Si no está en la selección y no se presiona Shift, seleccionar solo este asiento
      if (!e.shiftKey) {
        setSelectedSeats([seat]);
      }
      setMovingMultipleSeats(false);
    }
    
    setDraggingSeat(seat);
  };
  
  // Manejar inicio de arrastre de una sección
  const handleSectionDragStart = (e, sectionId) => {
    e.stopPropagation();
    
    if (editMode !== 'select' && editMode !== 'move') return;
    
    const section = sections.find(s => s.id === sectionId);
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) - section.x;
    const offsetY = (e.clientY - rect.top) - section.y;
    
    setSectionDragOffset({ x: offsetX, y: offsetY });
    setDraggingSectionId(sectionId);
    setSelectedSection(section);
  };
  
  // Manejar inicio de arrastre de un texto
  const handleTextDragStart = (e, textId) => {
    e.stopPropagation();
    
    if (editMode !== 'select' && editMode !== 'move') return;
    
    const text = texts.find(t => t.id === textId);
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) - text.x;
    const offsetY = (e.clientY - rect.top) - text.y;
    
    setTextDragOffset({ x: offsetX, y: offsetY });
    setDraggingText(textId);
    setSelectedText(text);
  };
  
  // Manejar arrastre (para todos los elementos)
  const handleDrag = (e) => {
    if (!draggingSeat && !draggingSectionId && !draggingText) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Manejar arrastre de sección
    if (draggingSectionId) {
      const x = roundToGrid(e.clientX - rect.left - sectionDragOffset.x);
      const y = roundToGrid(e.clientY - rect.top - sectionDragOffset.y);
      
      // Actualizar la posición de la sección
      setSections(sections.map(section => 
        section.id === draggingSectionId 
          ? { ...section, x, y } 
          : section
      ));
      
      e.preventDefault();
      return;
    }
    
    // Manejar arrastre de texto
    if (draggingText) {
      const x = roundToGrid(e.clientX - rect.left - textDragOffset.x);
      const y = roundToGrid(e.clientY - rect.top - textDragOffset.y);
      
      // Actualizar la posición del texto
      setTexts(texts.map(text => 
        text.id === draggingText 
          ? { ...text, x, y } 
          : text
      ));
      
      e.preventDefault();
      return;
    }
    
    // Manejar arrastre de asientos
    if (draggingSeat) {
      const x = roundToGrid(e.clientX - rect.left - dragOffset.x);
      const y = roundToGrid(e.clientY - rect.top - dragOffset.y);
      
      if (movingMultipleSeats) {
        // Calcular el desplazamiento desde la posición original
        const deltaX = x - draggingSeat.x;
        const deltaY = y - draggingSeat.y;
        
        // Mover todos los asientos seleccionados manteniendo sus posiciones relativas
        setSeats(seats.map(seat => {
          if (selectedSeats.some(s => s.id === seat.id)) {
            return { ...seat, x: seat.x + deltaX, y: seat.y + deltaY };
          }
          return seat;
        }));
        
        // Actualizar también los asientos seleccionados para mantenerlos sincronizados
        setSelectedSeats(selectedSeats.map(seat => ({
          ...seat, 
          x: seat.x + deltaX, 
          y: seat.y + deltaY
        })));
        
        // Actualizar el asiento de referencia para el próximo movimiento
        setDraggingSeat({...draggingSeat, x, y});
      } else {
        // Mover solo el asiento arrastrado
        setSeats(seats.map(seat => 
          seat.id === draggingSeat.id 
            ? { ...seat, x, y } 
            : seat
        ));
      }
    }
    
    e.preventDefault();
  };
  
  // Manejar fin de arrastre
  const handleDragEnd = (e) => {
    // Finalizar arrastre de secciones
    setDraggingSectionId(null);
    
    // Finalizar arrastre de textos
    setDraggingText(null);
    
    // Finalizar arrastre de asientos
    setDraggingSeat(null);
    setMovingMultipleSeats(false);
  };
  
  // Manejar clic en asiento (editar, seleccionar o eliminar según el modo)
  const handleSeatClick = (e, seat) => {
    e.stopPropagation();
    
    if (editMode === 'delete') {
      // Eliminar asiento único o todos los seleccionados
      if (selectedSeats.some(s => s.id === seat.id) && selectedSeats.length > 1) {
        // Eliminar todos los asientos seleccionados
        const idsToRemove = new Set(selectedSeats.map(s => s.id));
        setSeats(seats.filter(s => !idsToRemove.has(s.id)));
        setSelectedSeats([]);
      } else {
        // Eliminar solo el asiento clickeado
        setSeats(seats.filter(s => s.id !== seat.id));
      }
    } else if (editMode === 'edit') {
      setSelectedSeat(seat);
      setOpenEditDialog(true);
    } else if (editMode === 'select') {
      // Añadir o quitar de la selección con Shift
      if (e.shiftKey) {
        // Si ya está seleccionado, lo quitamos
        if (selectedSeats.some(s => s.id === seat.id)) {
          setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
          // Si no está seleccionado, lo añadimos
          setSelectedSeats([...selectedSeats, seat]);
        }
      } else {
        // Sin Shift, reemplazamos toda la selección
        setSelectedSeats([seat]);
      }
    }
  };
  
  // Actualizar un asiento después de editar
  const handleUpdateSeat = () => {
    if (!selectedSeat) return;
    
    setSeats(seats.map(s => 
      s.id === selectedSeat.id ? selectedSeat : s
    ));
    setOpenEditDialog(false);
    
    setSnackbar({
      open: true,
      message: 'Asiento actualizado correctamente',
      severity: 'success'
    });
  };
  
  // Formato de etiquetas con padding
  const formatSeatNumber = (num, usePadding = true, digits = 2) => {
    if (!usePadding) return num.toString();
    return num.toString().padStart(digits, '0');
  };
  
  // Generar etiqueta para fila y asiento según el formato especificado
  const generateSeatLabel = (rowIndex, seatIndex, config) => {
    const { 
      customRowLabels = false, 
      useNumberPadding = true,
      prefix = '',
      startRow = 'A',
      startingNumber = 1,
      rowSuffix = ' - ',
      seatPrefix = 'Asiento ',
      useOnlyEven = false,
      useOnlyOdd = false
    } = config;
    
    // Generar etiqueta de fila (letra A,B,C... o número 1,2,3...)
    let rowLabel;
    if (customRowLabels) {
      // Usar números para las filas (1, 2, 3...)
      rowLabel = prefix + (rowIndex + 1) + rowSuffix;
    } else {
      // Usar letras para las filas (A, B, C...)
      const rowCharCode = startRow.charCodeAt(0);
      rowLabel = prefix + String.fromCharCode(rowCharCode + rowIndex) + rowSuffix;
    }
    
    // Calcular el número de asiento según las opciones seleccionadas
    let seatNumber;
    if (useOnlyEven) {
      // Usar solo números pares (2,4,6...)
      seatNumber = startingNumber + (seatIndex * 2);
    } else if (useOnlyOdd) {
      // Usar solo números impares (1,3,5...)
      seatNumber = startingNumber + (seatIndex * 2);
      if (seatNumber % 2 === 0) {
        seatNumber++;
      }
    } else {
      // Numeración normal
      seatNumber = seatIndex + startingNumber;
    }
    
    // Formatear el número con o sin padding
    const formattedSeatNumber = useNumberPadding 
      ? formatSeatNumber(seatNumber, true, 2) 
      : seatNumber.toString();
    
    return `${rowLabel}${seatPrefix}${formattedSeatNumber}`;
  };
  
  // Añadir asientos en masa (filas de asientos)
  const handleBulkAdd = () => {
    const { 
      section, 
      startRow, 
      rows, 
      seatsPerRow, 
      type, 
      curvature, 
      rowSpacing, 
      seatSpacing,
      fixedWidth
    } = bulkConfig;
    
    const newSeats = [];
    
    // Calcular el centro para la curvatura
    const centerX = canvasWidth / 2;
    
    // Offset inicial (para centrar las filas)
    const rowWidth = fixedWidth 
      ? canvasWidth * 0.8 
      : seatsPerRow * seatSpacing;
      
    const startX = (canvasWidth - rowWidth) / 2;
    const startY = canvasHeight / 3;
    
    // Generar asientos para cada fila
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      // Determinar el ancho basado en la curvatura y el índice de fila
      const rowOffset = rowIndex * rowSpacing;
      
      // Para un efecto de curva, podemos cambiar el espacio entre asientos basado en la fila
      // Un factor más alto para filas más alejadas del escenario
      const curveFactor = 1 + (curvature * rowIndex / 50);
      const effectiveSeatSpacing = fixedWidth 
        ? rowWidth / (seatsPerRow - 1) 
        : seatSpacing * curveFactor;
      
      for (let seatIndex = 0; seatIndex < seatsPerRow; seatIndex++) {
        // Calcular posición con efecto de curva si es necesario
        let seatXPos;
        
        if (curvature === 0 || fixedWidth) {
          // Sin curvatura o con ancho fijo, distribución uniforme
          seatXPos = startX + (seatIndex * effectiveSeatSpacing);
        } else {
          // Con curvatura, calculamos una distribución en arco
          const ratio = (seatIndex / (seatsPerRow - 1)) - 0.5;
          const angle = ratio * curvature * (Math.PI / 180);
          
          // Radio del arco (aumenta con las filas para crear perspectiva)
          const radius = 400 + (rowIndex * 50);
          
          seatXPos = centerX + Math.sin(angle) * radius - (seatWidth / 2);
        }
        
        // Calcular posición Y (filas más alejadas tienen Y mayor)
        const seatYPos = startY + rowOffset;
        
        // Generar etiqueta única para este asiento
        const label = generateSeatLabel(rowIndex, seatIndex, bulkConfig);
        
        // Crear nuevo asiento
        const newSeat = {
          id: uuidv4(),
          x: roundToGrid(seatXPos),
          y: roundToGrid(seatYPos),
          width: seatWidth,
          height: seatHeight,
          type,
          color: seatColor,
          borderColor: seatBorderColor,
          borderWidth: seatBorderWidth,
          label,
          labelSize: seatLabelSize,
          labelColor: seatLabelColor,
          labelVisible: seatLabelVisible,
          price: seatPrice,
          section: section || 'General',
          status: 'available',
          row: rowIndex,
          seatNumber: seatIndex + 1
        };
        
        newSeats.push(newSeat);
      }
    }
    
    // Añadir los nuevos asientos al estado actual
    setSeats([...seats, ...newSeats]);
    
    // Cerrar diálogo y mostrar notificación
    setOpenBulkDialog(false);
    setSnackbar({
      open: true,
      message: `Se han añadido ${newSeats.length} asientos`,
      severity: 'success'
    });
  };
  
  // Crear una nueva sección
  const handleAddSection = () => {
    const newSection = {
      id: uuidv4(),
      name: sectionName || `Sección ${sections.length + 1}`,
      x: roundToGrid((canvasWidth - sectionWidth) / 2),
      y: roundToGrid(canvasHeight / 3),
      width: sectionWidth,
      height: sectionHeight,
      color: sectionColor,
      opacity: sectionOpacity
    };
    
    setSections([...sections, newSection]);
    setOpenSectionDialog(false);
    setSnackbar({
      open: true,
      message: 'Sección añadida correctamente',
      severity: 'success'
    });
  };
  
  // Manejar cambios en el zoom
  const handleZoomChange = (newZoom) => {
    setZoom(Math.max(0.2, Math.min(3, newZoom)));
  };
  
  // Añadir un nuevo texto
  const handleAddText = () => {
    if (!textContent) return;
    
    const newText = {
      id: uuidv4(),
      content: textContent,
      x: roundToGrid((canvasWidth - 100) / 2),
      y: roundToGrid(canvasHeight / 2),
      size: textSize,
      color: textColor,
      bold: textIsBold
    };
    
    setTexts([...texts, newText]);
    setOpenTextDialog(false);
    setSnackbar({
      open: true,
      message: 'Texto añadido correctamente',
      severity: 'success'
    });
  };
  
  // Manejar clic en el canvas
  const handleCanvasClick = (e) => {
    if (editMode !== 'add') {
      // Deseleccionar si hacemos clic en el canvas con modo diferente a "añadir"
      setSelectedSeats([]);
      setSelectedSection(null);
      setSelectedText(null);
      return;
    }
    
    // Obtener la posición relativa al canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const x = roundToGrid(e.clientX - rect.left);
    const y = roundToGrid(e.clientY - rect.top);
    
    if (addMode === 'seat') {
      // Añadir un nuevo asiento donde se hizo clic
      const newSeat = {
        id: uuidv4(),
        x,
        y,
        width: seatWidth,
        height: seatHeight,
        type: seatType,
        color: seatColor,
        borderColor: seatBorderColor,
        borderWidth: seatBorderWidth,
        label: `Asiento ${seats.length + 1}`,
        labelSize: seatLabelSize,
        labelColor: seatLabelColor,
        labelVisible: seatLabelVisible,
        price: seatPrice,
        section: seatCategory,
        status: 'available'
      };
      
      setSeats([...seats, newSeat]);
    }
  };
  
  // Cerrar el snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Abrir y posicionar el selector de color
  const handleOpenColorPicker = (target, position) => {
    setColorPickerTarget(target);
    setColorPickerPosition(position);
    setOpenColorPicker(true);
  };
  
  // Cerrar el selector de color
  const handleCloseColorPicker = () => {
    setOpenColorPicker(false);
    setColorPickerTarget(null);
  };
  
  // Cambiar el color según el objetivo seleccionado
  const handleColorChange = (color) => {
    const { hex } = color;
    
    switch (colorPickerTarget) {
      case 'seat':
        setSeatColor(hex);
        break;
      case 'border':
        setSeatBorderColor(hex);
        break;
      case 'label':
        setSeatLabelColor(hex);
        break;
      case 'section':
        setSectionColor(hex);
        break;
      case 'text':
        setTextColor(hex);
        break;
      case 'canvas':
        setCanvasBackground(hex);
        break;
      default:
        break;
    }
  };
  
  // Eliminar todos los elementos seleccionados
  const handleDeleteSelected = () => {
    if (selectedSeats.length > 0) {
      const idsToRemove = new Set(selectedSeats.map(s => s.id));
      setSeats(seats.filter(s => !idsToRemove.has(s.id)));
      setSelectedSeats([]);
      
      setSnackbar({
        open: true,
        message: `${selectedSeats.length} asientos eliminados`,
        severity: 'success'
      });
    }
    
    if (selectedSection) {
      setSections(sections.filter(s => s.id !== selectedSection.id));
      setSelectedSection(null);
      
      setSnackbar({
        open: true,
        message: 'Sección eliminada',
        severity: 'success'
      });
    }
    
    if (selectedText) {
      setTexts(texts.filter(t => t.id !== selectedText.id));
      setSelectedText(null);
      
      setSnackbar({
        open: true,
        message: 'Texto eliminado',
        severity: 'success'
      });
    }
  };
  
  // Exportar el diseño como JSON
  const handleExportTemplate = () => {
    const template = {
      id: uuidv4(),
      name: "Template de ejemplo",
      canvasWidth,
      canvasHeight,
      canvasBackground,
      stageImage: stageImageSrc ? {
        src: stageImageSrc,
        x: stageImageX,
        y: stageImageY,
        width: stageImageWidth,
        height: stageImageHeight
      } : null,
      sections,
      seats,
      texts
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "template.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    setSnackbar({
      open: true,
      message: 'Plantilla exportada correctamente',
      severity: 'success'
    });
  };
  
  // Cambiar entre pestañas de propiedades
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Manejar cargar imagen del escenario
  const handleStageImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setStageImageSrc(e.target.result);
      setStageImageFile(file);
    };
    reader.readAsDataURL(file);
  };
  
  // Renderizar asientos
  const renderSeats = () => {
    return seats.map(seat => {
      const isSelected = selectedSeats.some(s => s.id === seat.id);
      
      // Estilo básico del asiento
      const seatStyle = {
        left: `${seat.x}px`,
        top: `${seat.y}px`,
        width: `${seat.width}px`,
        height: `${seat.height}px`,
        backgroundColor: seat.color || seatColor,
        border: `${seat.borderWidth || seatBorderWidth}px solid ${seat.borderColor || seatBorderColor}`,
        borderRadius: seat.type === 'rounded' ? '50%' : '4px',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)'
      };
      
      return (
        <div
          key={seat.id}
          style={{
            ...styles.seat,
            ...seatStyle,
            ...(isSelected ? styles.selectedSeat : {})
          }}
          onMouseDown={(e) => handleSeatDragStart(e, seat)}
          onClick={(e) => handleSeatClick(e, seat)}
        >
          {seat.labelVisible !== false && (
            <span style={{ 
              fontSize: `${seat.labelSize || seatLabelSize}px`,
              color: seat.labelColor || seatLabelColor,
              fontWeight: 'bold',
              textShadow: '0px 0px 2px rgba(255,255,255,0.5)',
              display: 'block',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}>
              {seat.label}
            </span>
          )}
        </div>
      );
    });
  };
  
  // Renderizar secciones
  const renderSections = () => {
    return sections.map(section => {
      const isSelected = selectedSection && selectedSection.id === section.id;
      
      return (
        <div
          key={section.id}
          style={{
            ...styles.sectionBox,
            left: `${section.x}px`,
            top: `${section.y}px`,
            width: `${section.width}px`,
            height: `${section.height}px`,
            backgroundColor: `${section.color}${Math.round(section.opacity * 255).toString(16).padStart(2, '0')}`,
            border: isSelected ? '2px dashed blue' : '2px solid #333'
          }}
          onMouseDown={(e) => handleSectionDragStart(e, section.id)}
        >
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            marginBottom: '5px',
            color: '#000',
            textShadow: '0px 0px 2px rgba(255,255,255,0.8)'
          }}>
            {section.name}
          </div>
        </div>
      );
    });
  };
  
  // Renderizar textos
  const renderTexts = () => {
    return texts.map(text => {
      const isSelected = selectedText && selectedText.id === text.id;
      
      return (
        <div
          key={text.id}
          style={{
            ...styles.textElement,
            left: `${text.x}px`,
            top: `${text.y}px`,
            fontSize: `${text.size}px`,
            color: text.color,
            fontWeight: text.bold ? 'bold' : 'normal',
            border: isSelected ? '1px dashed blue' : 'none'
          }}
          onMouseDown={(e) => handleTextDragStart(e, text.id)}
        >
          {text.content}
        </div>
      );
    });
  };
  
  // Renderizar diálogo de edición de asiento
  const renderSeatEditDialog = () => {
    if (!selectedSeat) return null;
    
    return (
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Asiento</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Etiqueta"
                fullWidth
                value={selectedSeat.label || ''}
                onChange={(e) => setSelectedSeat({...selectedSeat, label: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Precio"
                type="number"
                fullWidth
                value={selectedSeat.price || 0}
                onChange={(e) => setSelectedSeat({...selectedSeat, price: parseFloat(e.target.value)})}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Categoría"
                fullWidth
                value={selectedSeat.section || 'General'}
                onChange={(e) => setSelectedSeat({...selectedSeat, section: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="seat-type-label">Tipo</InputLabel>
                <Select
                  labelId="seat-type-label"
                  value={selectedSeat.type || 'standard'}
                  onChange={(e) => setSelectedSeat({...selectedSeat, type: e.target.value})}
                >
                  <MenuItem value="standard">Estándar</MenuItem>
                  <MenuItem value="rounded">Redondeado</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Estado"
                fullWidth
                select
                value={selectedSeat.status || 'available'}
                onChange={(e) => setSelectedSeat({...selectedSeat, status: e.target.value})}
              >
                <MenuItem value="available">Disponible</MenuItem>
                <MenuItem value="reserved">Reservado</MenuItem>
                <MenuItem value="sold">Vendido</MenuItem>
                <MenuItem value="disabled">Deshabilitado</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Ancho"
                type="number"
                fullWidth
                value={selectedSeat.width || seatWidth}
                onChange={(e) => setSelectedSeat({...selectedSeat, width: parseInt(e.target.value)})}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Alto"
                type="number"
                fullWidth
                value={selectedSeat.height || seatHeight}
                onChange={(e) => setSelectedSeat({...selectedSeat, height: parseInt(e.target.value)})}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography gutterBottom>Color del asiento</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: selectedSeat.color || seatColor,
                    border: '1px solid gray',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleOpenColorPicker('seat', { x: e.clientX, y: e.clientY })}
                />
                <TextField
                  size="small"
                  value={selectedSeat.color || seatColor}
                  onChange={(e) => setSelectedSeat({...selectedSeat, color: e.target.value})}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography gutterBottom>Color del borde</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: selectedSeat.borderColor || seatBorderColor,
                    border: '1px solid gray',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleOpenColorPicker('border', { x: e.clientX, y: e.clientY })}
                />
                <TextField
                  size="small"
                  value={selectedSeat.borderColor || seatBorderColor}
                  onChange={(e) => setSelectedSeat({...selectedSeat, borderColor: e.target.value})}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Typography gutterBottom>Grosor del borde</Typography>
              <Slider
                value={selectedSeat.borderWidth || seatBorderWidth}
                onChange={(e, newValue) => setSelectedSeat({...selectedSeat, borderWidth: newValue})}
                min={0}
                max={5}
                step={1}
                valueLabelDisplay="auto"
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedSeat.labelVisible !== false}
                    onChange={(e) => setSelectedSeat({...selectedSeat, labelVisible: e.target.checked})}
                  />
                }
                label="Mostrar etiqueta"
              />
            </Grid>
            
            <Grid item xs={6}>
              <Typography gutterBottom>Tamaño de etiqueta</Typography>
              <Slider
                value={selectedSeat.labelSize || seatLabelSize}
                onChange={(e, newValue) => setSelectedSeat({...selectedSeat, labelSize: newValue})}
                min={8}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                disabled={selectedSeat.labelVisible === false}
              />
            </Grid>
            
            <Grid item xs={6}>
              <Typography gutterBottom>Color de etiqueta</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: selectedSeat.labelColor || seatLabelColor,
                    border: '1px solid gray',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleOpenColorPicker('label', { x: e.clientX, y: e.clientY })}
                />
                <TextField
                  size="small"
                  value={selectedSeat.labelColor || seatLabelColor}
                  onChange={(e) => setSelectedSeat({...selectedSeat, labelColor: e.target.value})}
                  sx={{ flexGrow: 1 }}
                  disabled={selectedSeat.labelVisible === false}
                />
              </Box>
            </Grid>
            
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateSeat} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  return (
    <Box sx={styles.editorContainer}>
      {/* Barra de herramientas superior */}
      <Box sx={styles.toolbar}>
        <Box sx={styles.toolbarGroup}>
          <Tooltip title="Volver">
            <IconButton>
              <ArrowBack />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Guardar plantilla">
            <IconButton onClick={handleExportTemplate}>
              <Save />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem />
          
          <Box sx={{ marginRight: 2 }}>
            <Tooltip title="Aumentar zoom">
              <IconButton onClick={() => handleZoomChange(zoom + 0.1)}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Reducir zoom">
              <IconButton onClick={() => handleZoomChange(zoom - 0.1)}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
            
            <Typography component="span" sx={{ mx: 1 }}>
              {Math.round(zoom * 100)}%
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem />
          
          <Tooltip title="Mostrar/ocultar cuadrícula">
            <IconButton onClick={() => setShowGrid(!showGrid)}>
              {showGrid ? <GridOn /> : <GridOff />}
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={styles.toolbarGroup}>
          <Chip
            icon={<AddBox />}
            label="Añadir"
            color={editMode === 'add' ? 'primary' : 'default'}
            onClick={() => setEditMode('add')}
            sx={{ mx: 0.5 }}
          />
          
          <Chip
            icon={<Edit />}
            label="Editar"
            color={editMode === 'edit' ? 'primary' : 'default'}
            onClick={() => setEditMode('edit')}
            sx={{ mx: 0.5 }}
          />
          
          <Chip
            icon={<Delete />}
            label="Eliminar"
            color={editMode === 'delete' ? 'primary' : 'default'}
            onClick={() => setEditMode('delete')}
            sx={{ mx: 0.5 }}
          />
          
          <Chip
            icon={<PanTool />}
            label="Mover"
            color={editMode === 'move' ? 'primary' : 'default'}
            onClick={() => setEditMode('move')}
            sx={{ mx: 0.5 }}
          />
          
          <Chip
            icon={<Search />}
            label="Seleccionar"
            color={editMode === 'select' ? 'primary' : 'default'}
            onClick={() => setEditMode('select')}
            sx={{ mx: 0.5 }}
          />
        </Box>
        
        <Box sx={styles.toolbarGroup}>
          {editMode === 'add' && (
            <>
              <ToggleButtonGroup
                value={addMode}
                exclusive
                onChange={(e, newMode) => newMode && setAddMode(newMode)}
                aria-label="add mode"
                size="small"
              >
                <Button variant={addMode === 'seat' ? 'contained' : 'outlined'} onClick={() => setAddMode('seat')}>
                  <EventSeat fontSize="small" sx={{ mr: 1 }} />
                  Asiento
                </Button>
                
                <Button variant={addMode === 'section' ? 'contained' : 'outlined'} onClick={() => setOpenSectionDialog(true)}>
                  <ViewColumn fontSize="small" sx={{ mr: 1 }} />
                  Sección
                </Button>
                
                <Button variant={addMode === 'text' ? 'contained' : 'outlined'} onClick={() => setOpenTextDialog(true)}>
                  <TextFields fontSize="small" sx={{ mr: 1 }} />
                  Texto
                </Button>
                
                <Button color="secondary" variant="outlined" onClick={() => setOpenBulkDialog(true)}>
                  <Dashboard fontSize="small" sx={{ mr: 1 }} />
                  Filas
                </Button>
              </ToggleButtonGroup>
            </>
          )}
          
          {selectedSeats.length > 0 && editMode !== 'add' && (
            <Tooltip title="Eliminar seleccionados">
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleDeleteSelected}
                startIcon={<Delete />}
              >
                Eliminar ({selectedSeats.length})
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      {/* Contenedor principal */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Área principal del canvas */}
        <Box 
          sx={styles.canvasContainer}
          ref={containerRef}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <Box
            ref={canvasRef}
            sx={{
              ...styles.canvas,
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              transform: `scale(${zoom})`,
              backgroundColor: canvasBackground,
              backgroundImage: stageImageSrc ? 'none' : undefined
            }}
            onClick={handleCanvasClick}
          >
            {/* Mostrar cuadrícula si está activada */}
            {showGrid && <Box sx={styles.grid} />}
            
            {/* Mostrar imagen del escenario si existe */}
            {stageImageSrc && (
              <Box 
                component="img"
                src={stageImageSrc}
                sx={{
                  position: 'absolute',
                  left: `${stageImageX}px`,
                  top: `${stageImageY}px`,
                  width: `${stageImageWidth}px`,
                  height: `${stageImageHeight}px`,
                  objectFit: 'contain'
                }}
              />
            )}
            
            {/* Renderizar secciones */}
            {renderSections()}
            
            {/* Renderizar asientos */}
            {renderSeats()}
            
            {/* Renderizar textos */}
            {renderTexts()}
          </Box>
        </Box>
        
        {/* Panel de propiedades */}
        <Paper sx={styles.properties} elevation={3}>
          <Typography variant="h6" gutterBottom>Propiedades</Typography>
          
          <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="General" />
            <Tab label="Asientos" />
            <Tab label="Apariencia" />
          </Tabs>
          
          {currentTab === 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>Propiedades generales</Typography>
              
              <TextField
                label="Ancho del canvas"
                type="number"
                fullWidth
                margin="normal"
                value={canvasWidth}
                onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
              />
              
              <TextField
                label="Alto del canvas"
                type="number"
                fullWidth
                margin="normal"
                value={canvasHeight}
                onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
              />
              
              <Typography gutterBottom sx={{ mt: 2 }}>Color de fondo</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: canvasBackground,
                    border: '1px solid gray',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleOpenColorPicker('canvas', { x: e.clientX, y: e.clientY })}
                />
                <TextField
                  size="small"
                  value={canvasBackground}
                  onChange={(e) => setCanvasBackground(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>Imagen del escenario</Typography>
              
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Subir imagen
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleStageImageUpload}
                />
              </Button>
              
              {stageImageSrc && (
                <>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <TextField
                      label="X"
                      type="number"
                      size="small"
                      value={stageImageX}
                      onChange={(e) => setStageImageX(parseInt(e.target.value))}
                    />
                    
                    <TextField
                      label="Y"
                      type="number"
                      size="small"
                      value={stageImageY}
                      onChange={(e) => setStageImageY(parseInt(e.target.value))}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      label="Ancho"
                      type="number"
                      size="small"
                      value={stageImageWidth}
                      onChange={(e) => setStageImageWidth(parseInt(e.target.value))}
                    />
                    
                    <TextField
                      label="Alto"
                      type="number"
                      size="small"
                      value={stageImageHeight}
                      onChange={(e) => setStageImageHeight(parseInt(e.target.value))}
                    />
                  </Box>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setStageImageSrc('')}
                    sx={{ mb: 2 }}
                  >
                    Eliminar imagen
                  </Button>
                </>
              )}
            </Box>
          )}
          
          {currentTab === 1 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>Propiedades de asientos</Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Ancho"
                  type="number"
                  size="small"
                  value={seatWidth}
                  onChange={(e) => setSeatWidth(parseInt(e.target.value))}
                />
                
                <TextField
                  label="Alto"
                  type="number"
                  size="small"
                  value={seatHeight}
                  onChange={(e) => setSeatHeight(parseInt(e.target.value))}
                />
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="seat-type-global-label">Tipo de asiento</InputLabel>
                <Select
                  labelId="seat-type-global-label"
                  value={seatType}
                  onChange={(e) => setSeatType(e.target.value)}
                >
                  <MenuItem value="standard">Estándar</MenuItem>
                  <MenuItem value="rounded">Redondeado</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Precio por defecto"
                type="number"
                fullWidth
                margin="normal"
                value={seatPrice}
                onChange={(e) => setSeatPrice(parseFloat(e.target.value))}
              />
              
              <TextField
                label="Categoría por defecto"
                fullWidth
                margin="normal"
                value={seatCategory}
                onChange={(e) => setSeatCategory(e.target.value)}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography gutterBottom>Estadísticas</Typography>
              <Typography variant="body2">Total de asientos: {seats.length}</Typography>
              <Typography variant="body2">Categorías: {
                Array.from(new Set(seats.map(s => s.section))).join(', ')
              }</Typography>
            </Box>
          )}
          
          {currentTab === 2 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>Apariencia de asientos</Typography>
              
              <Typography gutterBottom>Color del asiento</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: seatColor,
                    border: '1px solid gray',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleOpenColorPicker('seat', { x: e.clientX, y: e.clientY })}
                />
                <TextField
                  size="small"
                  value={seatColor}
                  onChange={(e) => setSeatColor(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              
              <Typography gutterBottom>Color del borde</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: seatBorderColor,
                    border: '1px solid gray',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleOpenColorPicker('border', { x: e.clientX, y: e.clientY })}
                />
                <TextField
                  size="small"
                  value={seatBorderColor}
                  onChange={(e) => setSeatBorderColor(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              
              <Typography gutterBottom>Grosor del borde</Typography>
              <Slider
                value={seatBorderWidth}
                onChange={(e, newValue) => setSeatBorderWidth(newValue)}
                min={0}
                max={5}
                step={1}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={seatLabelVisible}
                    onChange={(e) => setSeatLabelVisible(e.target.checked)}
                  />
                }
                label="Mostrar etiquetas"
                sx={{ mb: 1 }}
              />
              
              <Typography gutterBottom>Tamaño de etiqueta</Typography>
              <Slider
                value={seatLabelSize}
                onChange={(e, newValue) => setSeatLabelSize(newValue)}
                min={8}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                disabled={!seatLabelVisible}
                sx={{ mb: 2 }}
              />
              
              <Typography gutterBottom>Color de etiqueta</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: seatLabelColor,
                    border: '1px solid gray',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleOpenColorPicker('label', { x: e.clientX, y: e.clientY })}
                />
                <TextField
                  size="small"
                  value={seatLabelColor}
                  onChange={(e) => setSeatLabelColor(e.target.value)}
                  sx={{ flexGrow: 1 }}
                  disabled={!seatLabelVisible}
                />
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
      
      {/* Barra de estado */}
      <Box sx={styles.statusBar}>
        <span>Modo: {editMode.charAt(0).toUpperCase() + editMode.slice(1)}</span>
        <span>Asientos: {seats.length}</span>
      </Box>
      
      {/* Diálogo para editar asiento */}
      {renderSeatEditDialog()}
      
      {/* Diálogo para añadir sección */}
      <Dialog open={openSectionDialog} onClose={() => setOpenSectionDialog(false)}>
        <DialogTitle>Añadir nueva sección</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la sección"
            fullWidth
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Ancho"
              type="number"
              value={sectionWidth}
              onChange={(e) => setSectionWidth(parseInt(e.target.value))}
            />
            
            <TextField
              label="Alto"
              type="number"
              value={sectionHeight}
              onChange={(e) => setSectionHeight(parseInt(e.target.value))}
            />
          </Box>
          
          <Typography gutterBottom sx={{ mt: 2 }}>Color de la sección</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: 24, 
                height: 24, 
                bgcolor: sectionColor,
                border: '1px solid gray',
                cursor: 'pointer'
              }}
              onClick={(e) => handleOpenColorPicker('section', { x: e.clientX, y: e.clientY })}
            />
            <TextField
              size="small"
              value={sectionColor}
              onChange={(e) => setSectionColor(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          </Box>
          
          <Typography gutterBottom sx={{ mt: 2 }}>Opacidad</Typography>
          <Slider
            value={sectionOpacity}
            onChange={(e, newValue) => setSectionOpacity(newValue)}
            min={0}
            max={1}
            step={0.1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSectionDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddSection} variant="contained" color="primary">Añadir</Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para añadir texto */}
      <Dialog open={openTextDialog} onClose={() => setOpenTextDialog(false)}>
        <DialogTitle>Añadir texto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Contenido del texto"
            fullWidth
            multiline
            rows={3}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          
          <Typography gutterBottom sx={{ mt: 2 }}>Tamaño del texto</Typography>
          <Slider
            value={textSize}
            onChange={(e, newValue) => setTextSize(newValue)}
            min={10}
            max={48}
            step={1}
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />
          
          <Typography gutterBottom>Color del texto</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: 24, 
                height: 24, 
                bgcolor: textColor,
                border: '1px solid gray',
                cursor: 'pointer'
              }}
              onClick={(e) => handleOpenColorPicker('text', { x: e.clientX, y: e.clientY })}
            />
            <TextField
              size="small"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={textIsBold}
                onChange={(e) => setTextIsBold(e.target.checked)}
              />
            }
            label="Texto en negrita"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTextDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddText} variant="contained" color="primary">Añadir</Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para añadir asientos en masa */}
      <Dialog
        open={openBulkDialog}
        onClose={() => setOpenBulkDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Añadir filas de asientos</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sección"
                fullWidth
                value={bulkConfig.section}
                onChange={(e) => setBulkConfig({...bulkConfig, section: e.target.value})}
                helperText="Dejar en blanco para usar la categoría por defecto"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de asiento</InputLabel>
                <Select
                  value={bulkConfig.type}
                  onChange={(e) => setBulkConfig({...bulkConfig, type: e.target.value})}
                >
                  <MenuItem value="standard">Estándar</MenuItem>
                  <MenuItem value="rounded">Redondeado</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Número de filas"
                type="number"
                fullWidth
                value={bulkConfig.rows}
                onChange={(e) => setBulkConfig({...bulkConfig, rows: parseInt(e.target.value)})}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Asientos por fila"
                type="number"
                fullWidth
                value={bulkConfig.seatsPerRow}
                onChange={(e) => setBulkConfig({...bulkConfig, seatsPerRow: parseInt(e.target.value)})}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Espacio entre filas"
                type="number"
                fullWidth
                value={bulkConfig.rowSpacing}
                onChange={(e) => setBulkConfig({...bulkConfig, rowSpacing: parseInt(e.target.value)})}
                InputProps={{ inputProps: { min: 20 } }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Espacio entre asientos"
                type="number"
                fullWidth
                value={bulkConfig.seatSpacing}
                onChange={(e) => setBulkConfig({...bulkConfig, seatSpacing: parseInt(e.target.value)})}
                InputProps={{ inputProps: { min: 20 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Curvatura (grados)</Typography>
              <Slider
                value={bulkConfig.curvature}
                onChange={(e, newValue) => setBulkConfig({...bulkConfig, curvature: newValue})}
                min={0}
                max={120}
                step={5}
                valueLabelDisplay="auto"
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={bulkConfig.fixedWidth}
                    onChange={(e) => setBulkConfig({...bulkConfig, fixedWidth: e.target.checked})}
                  />
                }
                label="Ancho fijo"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>Etiquetas</Divider>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Fila inicial"
                fullWidth
                value={bulkConfig.startRow}
                onChange={(e) => setBulkConfig({...bulkConfig, startRow: e.target.value})}
                helperText="Letra (A-Z) o número"
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Prefijo"
                fullWidth
                value={bulkConfig.prefix}
                onChange={(e) => setBulkConfig({...bulkConfig, prefix: e.target.value})}
                helperText="Ej: 'Zona VIP '"
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Sufijo de fila"
                fullWidth
                value={bulkConfig.rowSuffix}
                onChange={(e) => setBulkConfig({...bulkConfig, rowSuffix: e.target.value})}
                helperText="Ej: ' - ' o 'F'"
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Prefijo de asiento"
                fullWidth
                value={bulkConfig.seatPrefix}
                onChange={(e) => setBulkConfig({...bulkConfig, seatPrefix: e.target.value})}
                helperText="Ej: 'S' o 'Asiento '"
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Número inicial"
                type="number"
                fullWidth
                value={bulkConfig.startingNumber}
                onChange={(e) => setBulkConfig({...bulkConfig, startingNumber: parseInt(e.target.value)})}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={9}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={bulkConfig.customRowLabels}
                      onChange={(e) => setBulkConfig({...bulkConfig, customRowLabels: e.target.checked})}
                    />
                  }
                  label="Usar números en lugar de letras para filas"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={bulkConfig.useNumberPadding}
                      onChange={(e) => setBulkConfig({...bulkConfig, useNumberPadding: e.target.checked})}
                    />
                  }
                  label="Padding en números (01, 02...)"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={bulkConfig.useOnlyEven}
                      onChange={(e) => setBulkConfig({
                        ...bulkConfig, 
                        useOnlyEven: e.target.checked,
                        useOnlyOdd: e.target.checked ? false : bulkConfig.useOnlyOdd
                      })}
                    />
                  }
                  label="Usar solo números pares"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={bulkConfig.useOnlyOdd}
                      onChange={(e) => setBulkConfig({
                        ...bulkConfig, 
                        useOnlyOdd: e.target.checked,
                        useOnlyEven: e.target.checked ? false : bulkConfig.useOnlyEven
                      })}
                    />
                  }
                  label="Usar solo números impares"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Formato de ejemplo:</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {generateSeatLabel(0, 0, bulkConfig)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDialog(false)}>Cancelar</Button>
          <Button onClick={handleBulkAdd} variant="contained" color="primary">Añadir</Button>
        </DialogActions>
      </Dialog>
      
      {/* Selector de color */}
      {openColorPicker && (
        <Box 
          sx={{
            ...styles.colorPickerPopover,
            top: colorPickerPosition.y,
            left: colorPickerPosition.x
          }}
        >
          <Box 
            sx={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 999
            }}
            onClick={handleCloseColorPicker}
          />
          <Box sx={{ position: 'relative', zIndex: 1000 }}>
            <SketchPicker
              color={
                colorPickerTarget === 'seat' ? seatColor :
                colorPickerTarget === 'border' ? seatBorderColor :
                colorPickerTarget === 'label' ? seatLabelColor :
                colorPickerTarget === 'section' ? sectionColor :
                colorPickerTarget === 'text' ? textColor :
                colorPickerTarget === 'canvas' ? canvasBackground :
                '#000000'
              }
              onChange={handleColorChange}
            />
          </Box>
        </Box>
      )}
      
      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplateEditor;