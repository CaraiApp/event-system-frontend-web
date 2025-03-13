import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Slider
} from '@mui/material';
import {
  ArrowBack,
  Save,
  EventSeat,
  DeleteForever,
  Add,
  Replay,
  Close,
  Edit,
  GridOn,
  KeyboardArrowUp,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  DragIndicator
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TemplateEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { template } = location.state || {}; 
  const editorRef = useRef(null);
  
  // Estado para los asientos y la configuración
  const [seats, setSeats] = useState([]);
  const [selectedSeatType, setSelectedSeatType] = useState('VIP');
  const [editMode, setEditMode] = useState('draw'); // 'draw', 'move', 'select', 'delete'
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [stageDimensions, setStageDimensions] = useState({ width: 30, height: 10 });
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [draggingSeat, setDraggingSeat] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const [nextSeatId, setNextSeatId] = useState(1);
  const [editorSize, setEditorSize] = useState({ width: 0, height: 0 });
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [movingMultipleSeats, setMovingMultipleSeats] = useState(false);
  
  // Estado para secciones personalizables
  const [sections, setSections] = useState([
    { id: 'SECTION_1', name: 'Sección 1 (Central)', x: 400, y: 110, width: 400, height: 200 },
    { id: 'SECTION_2', name: 'Sección 2 (Izquierda)', x: 150, y: 250, width: 200, height: 200 },
    { id: 'SECTION_3', name: 'Sección 3 (Derecha)', x: 650, y: 250, width: 200, height: 200 }
  ]);
  const [editingSection, setEditingSection] = useState(null);
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [draggingSection, setDraggingSectionId] = useState(null);
  const [sectionDragOffset, setSectionDragOffset] = useState({ x: 0, y: 0 });
  
  // Estado para textos informativos en el mapa
  const [texts, setTexts] = useState([
    { id: 'text-1', content: 'Salida de emergencia', x: 100, y: 450, fontSize: 14, color: 'white' }
  ]);
  const [selectedText, setSelectedText] = useState(null);
  const [openTextDialog, setOpenTextDialog] = useState(false);
  const [draggingText, setDraggingText] = useState(null);
  const [textDragOffset, setTextDragOffset] = useState({ x: 0, y: 0 });
  
  // Diálogos y notificaciones
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openBulkAddDialog, setOpenBulkAddDialog] = useState(false);
  const [openLabelFormatDialog, setOpenLabelFormatDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Datos del formulario para guardar y crear asientos en masa
  const [templateName, setTemplateName] = useState(template?.name || 'Nueva Plantilla');
  const [bulkAddConfig, setBulkAddConfig] = useState({
    section: 'SECTION_1',
    startRow: 'A',
    rows: 5,
    seatsPerRow: 10,
    type: 'ECONOMY',
    curvature: 0,
    startingNumber: 1,
    prefix: '', // Prefijo para los asientos (ej: "Fila ")
    useNumberPadding: true, // Si se usa padding con ceros (01, 02...)
    customRowLabels: false, // Usar letras (A,B,C) o etiquetas personalizadas (Fila 1, Fila 2...)
    startFromRight: false, // Si comienza la numeración desde la derecha
    useOnlyEven: false, // Usar solo números pares (2,4,6...)
    useOnlyOdd: false, // Usar solo números impares (1,3,5...)
    rowSuffix: ' - ', // Sufijo después del número de fila (ej: "Fila 1 - ")
    seatPrefix: 'Asiento ' // Prefijo antes del número de asiento (ej: "Asiento 12")
  });
  
  // Configuración global de formato de etiquetas
  const [labelFormat, setLabelFormat] = useState({
    rowPrefix: 'Fila ',
    useRowNumbers: true, // true = "Fila 1", false = "Fila A"
    seatPrefix: '',
    usePadding: true, // true = "01", false = "1"
    paddingDigits: 2 // Número de dígitos para el padding (01, 001, etc.)
  });
  
  // Inicializar el editor cuando el componente se monta
  useEffect(() => {
    if (editorRef.current) {
      const { width, height } = editorRef.current.getBoundingClientRect();
      setEditorSize({ width, height });
    }
    
    // Cargar datos de plantilla existente o inicializar nueva
    if (template) {
      // Si tenemos un ID de plantilla, intentamos cargarla desde el backend primero
      if (template.id) {
        // Usar la URL base del API desde variables de entorno o una URL por defecto
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const backendURL = `${API_BASE_URL}/api/templates/${template.id}`;
        
        // Intentar cargar desde el backend
        axios.get(backendURL, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log('Plantilla cargada desde el backend:', response.data);
          const templateData = response.data;
          
          // Cargar datos
          if (templateData.seats) {
            setSeats(templateData.seats);
            setNextSeatId(Math.max(...templateData.seats.map(seat => parseInt(seat.id.split('-')[1] || '0'))) + 1);
          }
          
          if (templateData.sections && Array.isArray(templateData.sections)) {
            setSections(templateData.sections);
          }
          
          if (templateData.texts && Array.isArray(templateData.texts)) {
            setTexts(templateData.texts);
          }
          
          if (templateData.stageDimensions) {
            setStageDimensions(templateData.stageDimensions);
          }
          
          setTemplateName(templateData.name);
          
          setSnackbar({
            open: true,
            message: 'Plantilla cargada correctamente desde el servidor',
            severity: 'success'
          });
        })
        .catch(error => {
          console.error('Error al cargar desde el backend, usando datos locales:', error);
          
          // Si falla, usamos los datos de localStorage que nos pasaron (template)
          loadTemplateFromLocalData(template);
          
          // Solo mostramos un mensaje si es un error de conexión real, no en desarrollo local
          if (import.meta.env.MODE === 'production') {
            setSnackbar({
              open: true,
              message: 'Usando datos locales. No se pudo conectar con el servidor.',
              severity: 'warning'
            });
          } else {
            console.log('Desarrollo local: usando datos de localStorage');
          }
        });
      } else {
        // No tenemos ID, usamos los datos que nos pasaron
        loadTemplateFromLocalData(template);
      }
    } else {
      // Inicializar con ejemplos para facilitar el diseño
      initializeDefaultLayout();
    }
  }, []);
  
  // Función para cargar datos de template desde localStorage
  const loadTemplateFromLocalData = (template) => {
    if (template.seats) {
      setSeats(template.seats);
      setNextSeatId(Math.max(...template.seats.map(seat => parseInt(seat.id.split('-')[1] || '0'))) + 1);
    }
    
    // Cargar secciones personalizadas si existen
    if (template.sections && Array.isArray(template.sections)) {
      setSections(template.sections);
    }
    
    // Cargar textos informativos si existen
    if (template.texts && Array.isArray(template.texts)) {
      setTexts(template.texts);
    }
    
    // Actualizar dimensiones del escenario
    if (template.stageDimensions) {
      setStageDimensions(template.stageDimensions);
    }
  };
  
  // Inicializar un diseño por defecto para empezar
  const initializeDefaultLayout = () => {
    const defaultSeats = [];
    
    // Crear una sección VIP centrada cerca del escenario
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        const rowLabel = String.fromCharCode(65 + row);
        defaultSeats.push({
          id: `vip-${defaultSeats.length + 1}`,
          label: `${rowLabel}${col + 1}`,
          x: 30 + col * 50,
          y: 150 + row * 50,
          type: 'VIP',
          section: 'SECTION_1',
          available: true
        });
      }
    }
    
    // Crear dos secciones económicas a los lados
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const rowLabel = String.fromCharCode(68 + row);
        // Sección izquierda
        defaultSeats.push({
          id: `econ-${defaultSeats.length + 1}`,
          label: `${rowLabel}${col + 1}`,
          x: 20 + col * 45,
          y: 300 + row * 45,
          type: 'ECONOMY',
          section: 'SECTION_2',
          available: true
        });
        
        // Sección derecha
        defaultSeats.push({
          id: `econ-${defaultSeats.length + 1}`,
          label: `${rowLabel}${col + 6}`,
          x: 430 - col * 45,
          y: 300 + row * 45,
          type: 'ECONOMY',
          section: 'SECTION_3',
          available: true
        });
      }
    }
    
    setSeats(defaultSeats);
    setNextSeatId(defaultSeats.length + 1);
    
    // Reiniciar secciones predeterminadas
    setSections([
      { id: 'SECTION_1', name: 'Sección 1 (Central)', x: 400, y: 110, width: 400, height: 200 },
      { id: 'SECTION_2', name: 'Sección 2 (Izquierda)', x: 150, y: 250, width: 200, height: 200 },
      { id: 'SECTION_3', name: 'Sección 3 (Derecha)', x: 650, y: 250, width: 200, height: 200 }
    ]);
    
    // Reiniciar textos informativos
    setTexts([
      { id: 'text-1', content: 'Salida de emergencia', x: 100, y: 450, fontSize: 14, color: 'white' }
    ]);
  };
  
  // Funciones para manejar el arrastre de secciones
  const handleSectionDragStart = (e, section) => {
    e.stopPropagation();
    
    if (editMode !== 'move') return;
    
    setDraggingSectionId(section.id);
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      setSectionDragOffset({
        x: e.clientX - rect.left - section.x,
        y: e.clientY - rect.top - section.y
      });
    }
  };
  
  // Funciones para manejar el arrastre de textos
  const handleTextDragStart = (e, text) => {
    e.stopPropagation();
    
    if (editMode !== 'move') return;
    
    setDraggingText(text.id);
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      setTextDragOffset({
        x: e.clientX - rect.left - text.x,
        y: e.clientY - rect.top - text.y
      });
    }
  };
  
  // Funciones para gestionar secciones
  const handleAddSection = () => {
    const newSectionId = `SECTION_${sections.length + 1}`;
    const newSection = {
      id: newSectionId,
      name: `Nueva Sección ${sections.length + 1}`,
      x: 300,
      y: 300,
      width: 200,
      height: 150
    };
    
    setSections([...sections, newSection]);
    
    // Abrir el diálogo de edición para la nueva sección
    setEditingSection(newSection);
    setOpenSectionDialog(true);
  };
  
  // Funciones para gestionar textos informativos
  const handleAddText = () => {
    const newTextId = `text-${texts.length + 1}`;
    const newText = {
      id: newTextId,
      content: 'Nuevo texto informativo',
      x: 300,
      y: 500,
      fontSize: 14,
      color: 'white'
    };
    
    setTexts([...texts, newText]);
    
    // Abrir el diálogo de edición para el nuevo texto
    setSelectedText(newText);
    setOpenTextDialog(true);
  };
  
  const handleEditText = (text) => {
    setSelectedText({...text});
    setOpenTextDialog(true);
  };
  
  const handleSaveText = () => {
    if (!selectedText) return;
    
    // Actualizar el texto
    setTexts(texts.map(text => 
      text.id === selectedText.id ? selectedText : text
    ));
    
    setOpenTextDialog(false);
    
    setSnackbar({
      open: true,
      message: 'Texto actualizado correctamente',
      severity: 'success'
    });
  };
  
  const handleDeleteText = (textId) => {
    setTexts(texts.filter(text => text.id !== textId));
    
    setSnackbar({
      open: true,
      message: 'Texto eliminado correctamente',
      severity: 'success'
    });
  };
  
  const handleEditSection = (section) => {
    setEditingSection({...section});
    setOpenSectionDialog(true);
  };
  
  const handleSaveSection = () => {
    if (!editingSection) return;
    
    // Actualizar la sección
    const updatedSections = sections.map(section => 
      section.id === editingSection.id ? editingSection : section
    );
    
    setSections(updatedSections);
    setOpenSectionDialog(false);
    
    setSnackbar({
      open: true,
      message: 'Sección actualizada correctamente',
      severity: 'success'
    });
  };
  
  const handleDeleteSection = (sectionId) => {
    // No permitir eliminar si hay asientos en la sección
    const seatsInSection = seats.filter(seat => seat.section === sectionId);
    
    if (seatsInSection.length > 0) {
      setSnackbar({
        open: true,
        message: `No se puede eliminar: hay ${seatsInSection.length} asientos en esta sección`,
        severity: 'error'
      });
      return;
    }
    
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);
    
    // Si la sección eliminada era la seleccionada, cambiar a 'all'
    if (selectedSection === sectionId) {
      setSelectedSection('all');
    }
    
    setSnackbar({
      open: true,
      message: 'Sección eliminada correctamente',
      severity: 'success'
    });
  };
  
  // Utilidades para el editor
  const roundToGrid = (value) => {
    return Math.round(value / gridSize) * gridSize;
  };
  
  // Manejar clic en el editor para añadir asientos o iniciar selección múltiple
  const handleEditorClick = (e) => {
    if (!editorRef.current) return;

    // Si estamos en modo selección, simplemente limpiar la selección si no se presiona Shift
    if (editMode === 'select') {
      // Verificar si se está manteniendo presionada la tecla Shift
      if (!e.shiftKey) {
        setSelectedSeats([]);
      }
      return;
    }
    
    // Si no estamos en modo dibujo, no hacer nada más
    if (editMode !== 'draw') return;
    
    const rect = editorRef.current.getBoundingClientRect();
    const x = roundToGrid(e.clientX - rect.left);
    const y = roundToGrid(e.clientY - rect.top);
    
    // No añadir asientos sobre el escenario
    const stageTop = 0;
    const stageHeight = 100;
    if (y >= stageTop && y <= stageTop + stageHeight) {
      return;
    }
    
    // Generar etiqueta automaticamente
    const lastSeatOfType = [...seats]
      .filter(s => s.type === selectedSeatType && s.section === selectedSection)
      .sort((a, b) => {
        const aMatch = a.label.match(/([A-Z]+)(\d+)/);
        const bMatch = b.label.match(/([A-Z]+)(\d+)/);
        if (!aMatch || !bMatch) return 0;
        
        if (aMatch[1] !== bMatch[1]) {
          return aMatch[1].localeCompare(bMatch[1]);
        }
        return parseInt(aMatch[2]) - parseInt(bMatch[2]);
      })
      .pop();
    
    let newLabel = '';
    if (lastSeatOfType) {
      const match = lastSeatOfType.label.match(/([A-Z]+)(\d+)/);
      if (match) {
        const row = match[1];
        const num = parseInt(match[2]) + 1;
        newLabel = `${row}${num}`;
      } else {
        newLabel = `A${nextSeatId}`;
      }
    } else {
      newLabel = `A${nextSeatId}`;
    }
    
    const newSeat = {
      id: `seat-${nextSeatId}`,
      label: newLabel,
      x,
      y,
      type: selectedSeatType,
      section: selectedSection,
      available: true
    };
    
    setSeats([...seats, newSeat]);
    setNextSeatId(nextSeatId + 1);
  };
  
  // Manejar comienzo de arrastre de asiento
  const handleDragStart = (e, seat) => {
    if (editMode !== 'move') return;
    
    // Comprobar si el asiento está en la selección actual
    const isInSelection = selectedSeats.some(s => s.id === seat.id);
    
    // Si el asiento está seleccionado y hay más asientos seleccionados, 
    // preparamos para mover todos los asientos seleccionados
    if (isInSelection && selectedSeats.length > 1) {
      setMovingMultipleSeats(true);
      setDraggingSeat(seat);
    } else {
      // Si no está en la selección o es el único, solo movemos ese asiento
      setMovingMultipleSeats(false);
      setDraggingSeat(seat);
      
      // Y limpiamos la selección anterior
      if (!e.shiftKey) {
        setSelectedSeats([]);
      }
    }
    
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - seat.x,
        y: e.clientY - rect.top - seat.y
      });
    }
    
    // Evitar comportamiento de arrastre por defecto del navegador
    e.preventDefault();
  };
  
  // Manejar movimiento durante el arrastre
  const handleDragOver = (e) => {
    if (!editorRef.current) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    
    // Si estamos seleccionando (dibujando un rectángulo de selección)
    if (isMultiSelectActive && editMode === 'select') {
      // Actualizar el punto final de la selección
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      setSelectionEnd({ x: currentX, y: currentY });
      
      // Determinar qué asientos están dentro del rectángulo de selección
      const selBox = {
        left: Math.min(selectionStart.x, currentX),
        top: Math.min(selectionStart.y, currentY),
        right: Math.max(selectionStart.x, currentX),
        bottom: Math.max(selectionStart.y, currentY)
      };
      
      // Seleccionar asientos que estén dentro del rectángulo
      const selectedSeats = seats.filter(seat => 
        seat.x >= selBox.left && 
        seat.x <= selBox.right && 
        seat.y >= selBox.top && 
        seat.y <= selBox.bottom
      );
      
      setSelectedSeats(selectedSeats);
      return;
    }
    
    if (editMode !== 'move') return;
    
    // Manejar arrastre de sección
    if (draggingSection) {
      const x = roundToGrid(e.clientX - rect.left - sectionDragOffset.x);
      const y = roundToGrid(e.clientY - rect.top - sectionDragOffset.y);
      
      // Actualizar la posición de la sección
      setSections(sections.map(section => 
        section.id === draggingSection 
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
      startingNumber,
      prefix,
      useNumberPadding,
      customRowLabels,
      startFromRight,
      useOnlyEven,
      useOnlyOdd,
      rowSuffix,
      seatPrefix
    } = bulkAddConfig;
    
    const newSeats = [];
    const rowCharCode = startRow.charCodeAt(0);
    
    // Calcular posición inicial
    let startX = 100;
    let startY = 200;
    
    // Ajustar según sección para distribuir en el espacio
    if (section === 'SECTION_2') { // Lado izquierdo
      startX = 50;
    } else if (section === 'SECTION_3') { // Lado derecho
      startX = editorSize.width - 50 - (seatsPerRow * 40);
    }
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < seatsPerRow; c++) {
        // Determinar el índice del asiento según la dirección (izquierda a derecha o viceversa)
        const seatIndex = startFromRight ? (seatsPerRow - 1 - c) : c;
        
        // Aplicar curvatura para crear filas arqueadas
        const curveOffset = curvature * Math.sin(Math.PI * (c / (seatsPerRow - 1)));
        
        // Generar etiqueta personalizada
        const seatLabel = generateSeatLabel(r, seatIndex, {
          customRowLabels,
          useNumberPadding,
          prefix,
          startRow,
          startingNumber,
          useOnlyEven,
          useOnlyOdd,
          rowSuffix,
          seatPrefix
        });
        
        const newSeat = {
          id: `seat-${nextSeatId + newSeats.length}`,
          label: seatLabel,
          x: startX + c * 40,
          y: startY + r * 40 - curveOffset,
          type,
          section,
          available: true
        };
        
        newSeats.push(newSeat);
      }
    }
    
    setSeats([...seats, ...newSeats]);
    setNextSeatId(nextSeatId + newSeats.length);
    setOpenBulkAddDialog(false);
    
    setSnackbar({
      open: true,
      message: `${newSeats.length} asientos añadidos correctamente`,
      severity: 'success'
    });
  };
  
  // Guardar plantilla
  const handleSaveTemplate = () => {
    // Verificar si estamos editando una plantilla existente o creando una nueva
    const isEditing = Boolean(template && template.id);
    
    // Usar el ID existente si estamos editando, o crear uno nuevo
    const templateId = isEditing ? template.id : `template-custom-${Date.now()}`;
    
    // Crear un objeto con los datos de la plantilla
    const templateData = {
      id: templateId,
      name: templateName,
      seats,
      sections, // Guardar las secciones personalizadas
      texts, // Guardar los textos informativos
      stageDimensions,
      isDefault: isEditing ? template.isDefault : false,
      image: template?.image || 'https://via.placeholder.com/450x250?text=Custom+Template',
      rows: Math.max(...seats.map(seat => {
        const match = seat.label.match(/([A-Z]+)/);
        return match ? match[1].charCodeAt(0) - 64 : 0; // A=1, B=2, etc.
      }), 1),
      columns: Math.max(...seats.map(seat => {
        const match = seat.label.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      }), 1),
      defaultSeats: seats.length,
      dateModified: new Date().toISOString()
    };
    
    console.log(`${isEditing ? 'Actualizando' : 'Guardando'} plantilla:`, templateData);
    
    // Guardar en el backend y tener localStorage como respaldo
    try {
      // Usar la URL base del API desde variables de entorno o una URL por defecto
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const backendURL = `${API_BASE_URL}/api/templates`;
      const endpoint = isEditing ? `${backendURL}/${templateId}` : backendURL;
      const method = isEditing ? 'PUT' : 'POST';
      
      // Iniciamos el guardado en el backend y en localStorage en paralelo
      setOpenSaveDialog(false);
      setSnackbar({
        open: true,
        message: 'Guardando plantilla...',
        severity: 'info'
      });
      
      // Guardar en localStorage como respaldo
      const existingTemplatesJSON = localStorage.getItem('allTemplates');
      const existingTemplates = existingTemplatesJSON ? JSON.parse(existingTemplatesJSON) : [];
      const existingIndex = existingTemplates.findIndex(t => t.id === templateId);
      
      if (existingIndex >= 0) {
        existingTemplates[existingIndex] = templateData;
      } else {
        existingTemplates.push(templateData);
      }
      localStorage.setItem('allTemplates', JSON.stringify(existingTemplates));
      
      // Enviar al backend
      axios({
        method,
        url: endpoint,
        data: templateData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        console.log('Plantilla guardada en el backend:', response.data);
        
        setSnackbar({
          open: true,
          message: isEditing 
            ? 'Plantilla actualizada correctamente en el servidor.' 
            : 'Plantilla guardada correctamente en el servidor.',
          severity: 'success'
        });
        
        // Redirigir a la lista de plantillas después de guardar
        setTimeout(() => {
          navigate('/template-manager');
        }, 1500);
      })
      .catch(error => {
        console.error('Error al guardar en el backend:', error);
        
        // Solo mostramos error de backend en producción
        if (import.meta.env.MODE === 'production') {
          setSnackbar({
            open: true,
            message: `Guardado en el servidor fallido, pero se ha guardado localmente: ${error.message}`,
            severity: 'warning'
          });
        } else {
          setSnackbar({
            open: true,
            message: `Guardado localmente con éxito en desarrollo`,
            severity: 'success'
          });
        }
        
        // Redirigir a la lista de plantillas después de guardar
        setTimeout(() => {
          navigate('/template-manager');
        }, 2500);
      });
    } catch (error) {
      console.error('Error al guardar la plantilla:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar la plantilla',
        severity: 'error'
      });
    }
  };
  
  // Restablecer configuración
  const handleResetTemplate = () => {
    initializeDefaultLayout();
    setOpenResetDialog(false);
    
    setSnackbar({
      open: true,
      message: 'Plantilla restablecida',
      severity: 'info'
    });
  };
  
  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  // Generar colores para tipos de asientos
  const getSeatColor = (type) => {
    switch (type) {
      case 'VIP':
        return { bgcolor: '#ff0e0e', color: 'white' };
      case 'ECONOMY':
        return { bgcolor: '#3960ba', color: 'white' };
      case 'DISABLED':
        return { bgcolor: '#565656', color: 'white' };
      default:
        return { bgcolor: '#3960ba', color: 'white' };
    }
  };
  
  // Filtrar asientos por sección seleccionada
  const filteredSeats = selectedSection === 'all' 
    ? seats 
    : seats.filter(seat => seat.section === selectedSection);
  
  // Renderizar líneas de la cuadrícula si está activada
  const renderGridLines = () => {
    if (!showGrid) return null;
    
    const lines = [];
    const width = editorSize.width;
    const height = editorSize.height;
    
    // Líneas verticales
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <line 
          key={`v-${x}`} 
          x1={x} 
          y1={0} 
          x2={x} 
          y2={height} 
          stroke="#555" 
          strokeWidth="0.5" 
          strokeDasharray="2,2"
        />
      );
    }
    
    // Líneas horizontales
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <line 
          key={`h-${y}`} 
          x1={0} 
          y1={y} 
          x2={width} 
          y2={y} 
          stroke="#555" 
          strokeWidth="0.5" 
          strokeDasharray="2,2"
        />
      );
    }
    
    return lines;
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/template-manager')} 
          sx={{ mr: 2 }}
          aria-label="volver"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Editor Avanzado de Plantillas
        </Typography>
      </Box>
      
      {/* Panel de control */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {template ? `Editar: ${templateName}` : 'Nueva Plantilla'}
            </Typography>
            
            <TextField
              fullWidth
              label="Nombre de la Plantilla"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Sección Activa</InputLabel>
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                label="Sección Activa"
              >
                <MenuItem value="all">Todas las secciones</MenuItem>
                {sections.map(section => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button 
                size="small" 
                variant="outlined" 
                startIcon={<Add />}
                onClick={handleAddSection}
              >
                Añadir Sección
              </Button>
              {selectedSection !== 'all' && (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      const section = sections.find(s => s.id === selectedSection);
                      if (section) {
                        handleEditSection(section);
                      }
                    }}
                  >
                    Editar Sección
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteSection(selectedSection)}
                  >
                    Eliminar Sección
                  </Button>
                </>
              )}
            </Box>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de Asiento</InputLabel>
              <Select
                value={selectedSeatType}
                onChange={(e) => setSelectedSeatType(e.target.value)}
                label="Tipo de Asiento"
              >
                <MenuItem value="VIP">VIP</MenuItem>
                <MenuItem value="ECONOMY">Económico</MenuItem>
                <MenuItem value="DISABLED">No Disponible</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>Tamaño de cuadrícula: {gridSize}px</Typography>
              <Slider
                value={gridSize}
                onChange={(e, newValue) => setGridSize(newValue)}
                min={5}
                max={20}
                step={5}
                sx={{ width: '50%' }}
              />
              <IconButton 
                color={showGrid ? "primary" : "default"}
                onClick={() => setShowGrid(!showGrid)}
                sx={{ ml: 2 }}
              >
                <GridOn />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>Zoom: {zoom}%</Typography>
              <Slider
                value={zoom}
                onChange={(e, newValue) => setZoom(newValue)}
                min={50}
                max={150}
                step={10}
                sx={{ width: '50%' }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Modo de Edición
              </Typography>
              <ToggleButtonGroup
                value={editMode}
                exclusive
                onChange={(e, newMode) => {
                  if (newMode) {
                    setEditMode(newMode);
                    // Limpiar selección al cambiar de modo
                    if (newMode !== 'select') {
                      setSelectedSeats([]);
                    }
                  }
                }}
                aria-label="modo de edición"
                sx={{ mb: 2 }}
              >
                <ToggleButton value="draw" aria-label="dibujar">
                  <Tooltip title="Dibujar Asientos">
                    <Add />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="select" aria-label="seleccionar">
                  <Tooltip title="Seleccionar Asientos (Shift para selección múltiple)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2z"/>
                    </svg>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="move" aria-label="mover">
                  <Tooltip title="Mover Asientos (Selecciona múltiples y muévelos a la vez)">
                    <DragIndicator />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="edit" aria-label="editar">
                  <Tooltip title="Editar Asientos">
                    <Edit />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="delete" aria-label="eliminar">
                  <Tooltip title="Eliminar Asientos">
                    <DeleteForever />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
              
              {selectedSeats.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {selectedSeats.length} asientos seleccionados
                  </Typography>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error" 
                    startIcon={<DeleteForever />}
                    onClick={() => {
                      const idsToRemove = new Set(selectedSeats.map(s => s.id));
                      setSeats(seats.filter(s => !idsToRemove.has(s.id)));
                      setSelectedSeats([]);
                    }}
                  >
                    Eliminar seleccionados
                  </Button>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 2 }}>
                Leyenda:
              </Typography>
              <Chip 
                icon={<EventSeat />} 
                label="VIP" 
                sx={{ ...getSeatColor('VIP'), mr: 1 }}
              />
              <Chip 
                icon={<EventSeat />} 
                label="Económico" 
                sx={{ ...getSeatColor('ECONOMY'), mr: 1 }}
              />
              <Chip 
                icon={<EventSeat />} 
                label="No Disponible" 
                sx={{ ...getSeatColor('DISABLED') }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 4, gap: 1 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<Save />}
                onClick={() => setOpenSaveDialog(true)}
              >
                Guardar Plantilla
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<Add />}
                onClick={() => setOpenBulkAddDialog(true)}
              >
                Añadir Filas de Asientos
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<Replay />}
                onClick={() => setOpenResetDialog(true)}
              >
                Restablecer
              </Button>
            </Box>
            
            {selectedSeats.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    // Recorremos y alineamos los asientos seleccionados en una fila perfecta
                    if (selectedSeats.length < 2) return;
                    
                    // Calculamos la dirección predominante (horizontal o vertical)
                    const xCoords = selectedSeats.map(s => s.x);
                    const yCoords = selectedSeats.map(s => s.y);
                    const xRange = Math.max(...xCoords) - Math.min(...xCoords);
                    const yRange = Math.max(...yCoords) - Math.min(...yCoords);
                    
                    // Si el rango en X es mayor que en Y, alineamos horizontalmente
                    const isHorizontal = xRange > yRange;
                    
                    if (isHorizontal) {
                      // Ordenamos por X para alinear horizontalmente
                      const sortedSeats = [...selectedSeats].sort((a, b) => a.x - b.x);
                      const avgY = sortedSeats.reduce((sum, s) => sum + s.y, 0) / sortedSeats.length;
                      const roundedY = roundToGrid(avgY);
                      
                      // Actualizar posiciones manteniendo X pero alineando Y
                      setSeats(seats.map(seat => {
                        if (selectedSeats.some(s => s.id === seat.id)) {
                          return { ...seat, y: roundedY };
                        }
                        return seat;
                      }));
                      
                      // Actualizar selección
                      setSelectedSeats(selectedSeats.map(seat => ({ ...seat, y: roundedY })));
                    } else {
                      // Ordenamos por Y para alinear verticalmente
                      const sortedSeats = [...selectedSeats].sort((a, b) => a.y - b.y);
                      const avgX = sortedSeats.reduce((sum, s) => sum + s.x, 0) / sortedSeats.length;
                      const roundedX = roundToGrid(avgX);
                      
                      // Actualizar posiciones manteniendo Y pero alineando X
                      setSeats(seats.map(seat => {
                        if (selectedSeats.some(s => s.id === seat.id)) {
                          return { ...seat, x: roundedX };
                        }
                        return seat;
                      }));
                      
                      // Actualizar selección
                      setSelectedSeats(selectedSeats.map(seat => ({ ...seat, x: roundedX })));
                    }
                    
                    setSnackbar({
                      open: true,
                      message: `Asientos alineados ${isHorizontal ? 'horizontalmente' : 'verticalmente'}`,
                      severity: 'success'
                    });
                  }}
                >
                  Alinear Seleccionados
                </Button>
                
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    // Distribuir uniformemente los asientos seleccionados
                    if (selectedSeats.length < 2) return;
                    
                    // Calculamos la dirección predominante
                    const xCoords = selectedSeats.map(s => s.x);
                    const yCoords = selectedSeats.map(s => s.y);
                    const xRange = Math.max(...xCoords) - Math.min(...xCoords);
                    const yRange = Math.max(...yCoords) - Math.min(...yCoords);
                    
                    // Si el rango en X es mayor que en Y, distribuimos horizontalmente
                    const isHorizontal = xRange > yRange;
                    
                    if (isHorizontal) {
                      // Ordenamos por X para distribuir horizontalmente
                      const sortedSeats = [...selectedSeats].sort((a, b) => a.x - b.x);
                      const minX = sortedSeats[0].x;
                      const maxX = sortedSeats[sortedSeats.length - 1].x;
                      const step = (maxX - minX) / (sortedSeats.length - 1);
                      
                      // Actualizar posiciones distribuyendo uniformemente en X
                      const updatedSeats = seats.map(seat => {
                        const index = sortedSeats.findIndex(s => s.id === seat.id);
                        if (index >= 0) {
                          return { ...seat, x: minX + index * step };
                        }
                        return seat;
                      });
                      
                      setSeats(updatedSeats);
                      
                      // Actualizar selección
                      setSelectedSeats(sortedSeats.map((seat, index) => ({ 
                        ...seat, 
                        x: minX + index * step 
                      })));
                    } else {
                      // Ordenamos por Y para distribuir verticalmente
                      const sortedSeats = [...selectedSeats].sort((a, b) => a.y - b.y);
                      const minY = sortedSeats[0].y;
                      const maxY = sortedSeats[sortedSeats.length - 1].y;
                      const step = (maxY - minY) / (sortedSeats.length - 1);
                      
                      // Actualizar posiciones distribuyendo uniformemente en Y
                      const updatedSeats = seats.map(seat => {
                        const index = sortedSeats.findIndex(s => s.id === seat.id);
                        if (index >= 0) {
                          return { ...seat, y: minY + index * step };
                        }
                        return seat;
                      });
                      
                      setSeats(updatedSeats);
                      
                      // Actualizar selección
                      setSelectedSeats(sortedSeats.map((seat, index) => ({ 
                        ...seat, 
                        y: minY + index * step 
                      })));
                    }
                    
                    setSnackbar({
                      open: true,
                      message: `Asientos distribuidos uniformemente ${isHorizontal ? 'horizontalmente' : 'verticalmente'}`,
                      severity: 'success'
                    });
                  }}
                >
                  Distribuir Uniformemente
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="text.secondary">
          {editMode === 'draw' && "Haz clic en el editor para añadir nuevos asientos."}
          {editMode === 'select' && "Dibuja un rectángulo para seleccionar múltiples asientos. Usa la tecla Shift para añadir a la selección."}
          {editMode === 'move' && "Arrastra los asientos para cambiar su posición. Selecciona múltiples asientos previamente para moverlos en grupo."}
          {editMode === 'edit' && "Haz clic en un asiento para editar sus propiedades."}
          {editMode === 'delete' && "Haz clic en un asiento para eliminarlo. Si hay asientos seleccionados, se eliminarán todos a la vez."}
        </Typography>
      </Paper>
      
      {/* Barra de herramientas flotante */}
      <Paper 
        elevation={8}
        sx={{
          position: 'sticky', 
          top: '70px',
          zIndex: 10,
          mb: 2,
          p: 2,
          borderRadius: '8px',
          backgroundColor: 'rgba(25, 25, 112, 0.9)', // Azul oscuro más visible
          backdropFilter: 'blur(10px)',
          border: '2px solid #6495ED', // Borde azul claro para destacar
          boxShadow: '0 0 15px rgba(100, 149, 237, 0.7)', // Brillo azul alrededor
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          justifyContent: 'center'
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ mr: 1, color: 'white' }}>
            Modo:
          </Typography>
          <ToggleButtonGroup
            value={editMode}
            exclusive
            size="medium" // Botones más grandes
            onChange={(e, newMode) => {
              if (newMode) {
                setEditMode(newMode);
                if (newMode !== 'select') {
                  setSelectedSeats([]);
                }
              }
            }}
            aria-label="modo de edición"
            sx={{ 
              background: 'rgba(30,30,30,0.8)',
              '& .MuiToggleButton-root': {
                color: 'white',
                padding: '8px 12px',
                '&.Mui-selected': {
                  backgroundColor: '#4caf50', // Verde para el botón seleccionado
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#3d8b40', // Verde más oscuro al hover
                  }
                }
              }
            }}
          >
            <ToggleButton value="draw" aria-label="dibujar">
              <Tooltip title="Dibujar Asientos">
                <Add />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="select" aria-label="seleccionar">
              <Tooltip title="Seleccionar Asientos (Shift para selección múltiple)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2z"/>
                </svg>
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="move" aria-label="mover">
              <Tooltip title="Mover Asientos (Selecciona múltiples y muévelos a la vez)">
                <DragIndicator />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="edit" aria-label="editar">
              <Tooltip title="Editar Asientos">
                <Edit />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="delete" aria-label="eliminar">
              <Tooltip title="Eliminar Asientos">
                <DeleteForever />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Button
            variant="contained"
            size="medium"
            color="secondary"
            startIcon={<Add />}
            onClick={() => setOpenBulkAddDialog(true)}
            sx={{ 
              ml: 2,
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
              }
            }}
          >
            AÑADIR FILA
          </Button>
          
          <Button
            variant="contained"
            size="medium"
            color="info"
            startIcon={<Add />}
            onClick={handleAddText}
            sx={{ 
              ml: 1,
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
              }
            }}
          >
            AÑADIR TEXTO
          </Button>
        </Box>
        
        {selectedSeats.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${selectedSeats.length} seleccionados`} 
              variant="outlined" 
              color="primary"
              size="small"
            />
            
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                // Alinear asientos seleccionados
                if (selectedSeats.length < 2) return;
                
                // Calculamos la dirección predominante
                const xCoords = selectedSeats.map(s => s.x);
                const yCoords = selectedSeats.map(s => s.y);
                const xRange = Math.max(...xCoords) - Math.min(...xCoords);
                const yRange = Math.max(...yCoords) - Math.min(...yCoords);
                
                // Si el rango en X es mayor que en Y, alineamos horizontalmente
                const isHorizontal = xRange > yRange;
                
                if (isHorizontal) {
                  // Ordenamos por X para alinear horizontalmente
                  const sortedSeats = [...selectedSeats].sort((a, b) => a.x - b.x);
                  const avgY = sortedSeats.reduce((sum, s) => sum + s.y, 0) / sortedSeats.length;
                  const roundedY = roundToGrid(avgY);
                  
                  // Actualizar posiciones manteniendo X pero alineando Y
                  setSeats(seats.map(seat => {
                    if (selectedSeats.some(s => s.id === seat.id)) {
                      return { ...seat, y: roundedY };
                    }
                    return seat;
                  }));
                  
                  // Actualizar selección
                  setSelectedSeats(selectedSeats.map(seat => ({ ...seat, y: roundedY })));
                } else {
                  // Ordenamos por Y para alinear verticalmente
                  const sortedSeats = [...selectedSeats].sort((a, b) => a.y - b.y);
                  const avgX = sortedSeats.reduce((sum, s) => sum + s.x, 0) / sortedSeats.length;
                  const roundedX = roundToGrid(avgX);
                  
                  // Actualizar posiciones manteniendo Y pero alineando X
                  setSeats(seats.map(seat => {
                    if (selectedSeats.some(s => s.id === seat.id)) {
                      return { ...seat, x: roundedX };
                    }
                    return seat;
                  }));
                  
                  // Actualizar selección
                  setSelectedSeats(selectedSeats.map(seat => ({ ...seat, x: roundedX })));
                }
                
                setSnackbar({
                  open: true,
                  message: `Asientos alineados ${isHorizontal ? 'horizontalmente' : 'verticalmente'}`,
                  severity: 'success'
                });
              }}
            >
              Alinear
            </Button>
            
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => {
                // Distribuir uniformemente los asientos seleccionados
                if (selectedSeats.length < 2) return;
                
                // Calculamos la dirección predominante
                const xCoords = selectedSeats.map(s => s.x);
                const yCoords = selectedSeats.map(s => s.y);
                const xRange = Math.max(...xCoords) - Math.min(...xCoords);
                const yRange = Math.max(...yCoords) - Math.min(...yCoords);
                
                // Si el rango en X es mayor que en Y, distribuimos horizontalmente
                const isHorizontal = xRange > yRange;
                
                if (isHorizontal) {
                  // Ordenamos por X para distribuir horizontalmente
                  const sortedSeats = [...selectedSeats].sort((a, b) => a.x - b.x);
                  const minX = sortedSeats[0].x;
                  const maxX = sortedSeats[sortedSeats.length - 1].x;
                  const step = (maxX - minX) / (sortedSeats.length - 1);
                  
                  // Actualizar posiciones distribuyendo uniformemente en X
                  const updatedSeats = seats.map(seat => {
                    const index = sortedSeats.findIndex(s => s.id === seat.id);
                    if (index >= 0) {
                      return { ...seat, x: minX + index * step };
                    }
                    return seat;
                  });
                  
                  setSeats(updatedSeats);
                  
                  // Actualizar selección
                  setSelectedSeats(sortedSeats.map((seat, index) => ({ 
                    ...seat, 
                    x: minX + index * step 
                  })));
                } else {
                  // Ordenamos por Y para distribuir verticalmente
                  const sortedSeats = [...selectedSeats].sort((a, b) => a.y - b.y);
                  const minY = sortedSeats[0].y;
                  const maxY = sortedSeats[sortedSeats.length - 1].y;
                  const step = (maxY - minY) / (sortedSeats.length - 1);
                  
                  // Actualizar posiciones distribuyendo uniformemente en Y
                  const updatedSeats = seats.map(seat => {
                    const index = sortedSeats.findIndex(s => s.id === seat.id);
                    if (index >= 0) {
                      return { ...seat, y: minY + index * step };
                    }
                    return seat;
                  });
                  
                  setSeats(updatedSeats);
                  
                  // Actualizar selección
                  setSelectedSeats(sortedSeats.map((seat, index) => ({ 
                    ...seat, 
                    y: minY + index * step 
                  })));
                }
                
                setSnackbar({
                  open: true,
                  message: `Asientos distribuidos ${isHorizontal ? 'horizontalmente' : 'verticalmente'}`,
                  severity: 'success'
                });
              }}
            >
              Distribuir
            </Button>
            
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => {
                const idsToRemove = new Set(selectedSeats.map(s => s.id));
                setSeats(seats.filter(s => !idsToRemove.has(s.id)));
                setSelectedSeats([]);
              }}
            >
              Eliminar
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Editor de mapas de asientos */}
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          overflow: 'hidden',
          position: 'relative',
          height: '70vh',
          backgroundColor: '#1c1c1c',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box 
          ref={editorRef}
          onClick={handleEditorClick}
          onMouseMove={handleDragOver}
          onMouseUp={handleDragEnd}
          sx={{ 
            position: 'relative',
            width: '100%',
            height: '100%',
            transform: `scale(${zoom/100})`,
            transformOrigin: 'center top',
            transition: 'transform 0.2s ease',
          }}
        >
          {/* Escenario */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${stageDimensions.width}%`,
              height: `${stageDimensions.height}%`,
              maxHeight: '100px',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa9a29gnDVHA3V9PfL9-ciX4M69VSknuiP6w&s')`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
              boxShadow: "0px 4px 20px rgba(255, 255, 0, 0.4)",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "24px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Escenario
            </Typography>
          </Box>
          
          {/* Cuadrícula y elementos SVG */}
          <svg 
            width="100%" 
            height="100%" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              pointerEvents: 'none'
            }}
          >
            {/* Líneas de cuadrícula */}
            {renderGridLines()}
          </svg>
          
          {/* Control flotante de secciones */}
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 100,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '8px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxWidth: '200px',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
              Secciones
            </Typography>
            
            <FormControl size="small" fullWidth>
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                size="small"
                sx={{ 
                  color: 'white', 
                  '.MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(255, 255, 255, 0.3)' 
                  } 
                }}
              >
                <MenuItem value="all">Todas las secciones</MenuItem>
                {sections.map(section => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button 
                size="small" 
                variant="contained" 
                color="primary"
                fullWidth
                onClick={handleAddSection}
              >
                Añadir
              </Button>
              {selectedSection !== 'all' && (
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    const section = sections.find(s => s.id === selectedSection);
                    if (section) {
                      handleEditSection(section);
                    }
                  }}
                >
                  Editar
                </Button>
              )}
            </Box>
          </Box>
          
          {/* Secciones */}
          {sections.map(section => {
            // Mostrar solo si todas las secciones están seleccionadas o esta sección específica
            if (selectedSection !== 'all' && selectedSection !== section.id) return null;
            
            let sectionStyle = {
              position: 'absolute',
              left: section.x,
              top: section.y,
              width: section.width,
              height: section.height,
              border: '1px dashed rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              pt: 1,
              cursor: editMode === 'move' ? 'move' : 'pointer',
              pointerEvents: 'auto', // Permitir interacción
            };
            
            // Destacar sección seleccionada
            if (selectedSection === section.id) {
              sectionStyle.border = '2px dashed rgba(255, 255, 255, 0.8)';
              sectionStyle.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
            }
            
            return (
              <Box
                key={section.id}
                sx={sectionStyle}
                onClick={() => setSelectedSection(section.id)}
                onMouseDown={(e) => editMode === 'move' && handleSectionDragStart(e, section)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleEditSection(section);
                }}
              >
                <Typography
                  sx={{
                    color: selectedSection === section.id ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    fontSize: '14px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    px: 1,
                    py: 0.5,
                    borderRadius: '3px',
                    fontWeight: selectedSection === section.id ? 'bold' : 'normal',
                    userSelect: 'none',
                  }}
                >
                  {section.name}
                </Typography>
              </Box>
            );
          })}
          
          {/* Textos informativos */}
          {texts.map(text => (
            <Box
              key={text.id}
              sx={{
                position: 'absolute',
                left: text.x,
                top: text.y,
                cursor: editMode === 'move' ? 'move' : 'pointer',
                pointerEvents: 'auto',
                userSelect: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '1px dashed rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  border: '1px dashed rgba(255, 255, 255, 0.8)',
                }
              }}
              onClick={() => handleEditText(text)}
              onMouseDown={(e) => editMode === 'move' && handleTextDragStart(e, text)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleDeleteText(text.id);
              }}
            >
              <Typography
                sx={{
                  color: text.color || 'white',
                  fontSize: `${text.fontSize || 14}px`,
                  fontWeight: 'normal',
                }}
              >
                {text.content}
              </Typography>
            </Box>
          ))}
          
          {/* Asientos */}
          {filteredSeats.map((seat) => (
            <Box
              key={seat.id}
              onMouseDown={(e) => handleDragStart(e, seat)}
              onClick={(e) => handleSeatClick(e, seat)}
              sx={{
                position: 'absolute',
                left: `${seat.x}px`,
                top: `${seat.y}px`,
                width: '30px',
                height: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                ...getSeatColor(seat.type),
                borderRadius: '5px',
                cursor: editMode === 'move' ? 'move' : 'pointer',
                opacity: seat.available ? 1 : 0.5,
                transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                border: selectedSeats.some(s => s.id === seat.id) ? '2px solid white' : 'none',
                boxShadow: selectedSeats.some(s => s.id === seat.id) ? '0 0 8px 3px rgba(255, 255, 255, 0.7)' : 'none',
                transform: selectedSeats.some(s => s.id === seat.id) ? 'scale(1.1)' : 'scale(1)',
                zIndex: selectedSeats.some(s => s.id === seat.id) ? 20 : 1,
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 5px 2px rgba(255, 255, 255, 0.3)',
                  zIndex: 10
                }
              }}
            >
              <EventSeat fontSize="small" />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '8px', 
                  lineHeight: 1, 
                  fontWeight: 'bold',
                  userSelect: 'none'
                }}
              >
                {seat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
      
      {/* Diálogo de guardado */}
      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Guardar Plantilla</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas guardar esta plantilla? Estará disponible para todos los organizadores.
          </DialogContentText>
          {import.meta.env.MODE === 'production' ? (
            <DialogContentText sx={{ mt: 2, color: 'green' }}>
              La plantilla se guardará en el servidor. También se mantendrá una copia local como respaldo.
            </DialogContentText>
          ) : (
            <DialogContentText sx={{ mt: 2, color: 'blue' }}>
              Modo desarrollo: La plantilla se guardará localmente en tu navegador (localStorage).
            </DialogContentText>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Plantilla"
            type="text"
            fullWidth
            variant="outlined"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveTemplate} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de restablecer */}
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>Restablecer Plantilla</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas restablecer esta plantilla? Se perderán todos los cambios no guardados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>Cancelar</Button>
          <Button onClick={handleResetTemplate} color="error" variant="contained">
            Restablecer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de edición de asiento */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Asiento</DialogTitle>
        <DialogContent>
          {selectedSeat && (
            <Box sx={{ pt: 1 }}>
              <TextField
                margin="dense"
                label="Etiqueta del Asiento"
                type="text"
                fullWidth
                variant="outlined"
                value={selectedSeat.label}
                onChange={(e) => setSelectedSeat({...selectedSeat, label: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tipo de Asiento</InputLabel>
                <Select
                  value={selectedSeat.type}
                  onChange={(e) => setSelectedSeat({...selectedSeat, type: e.target.value})}
                  label="Tipo de Asiento"
                >
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="ECONOMY">Económico</MenuItem>
                  <MenuItem value="DISABLED">No Disponible</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sección</InputLabel>
                <Select
                  value={selectedSeat.section}
                  onChange={(e) => setSelectedSeat({...selectedSeat, section: e.target.value})}
                  label="Sección"
                >
                  <MenuItem value="SECTION_1">Sección 1 (Central)</MenuItem>
                  <MenuItem value="SECTION_2">Sección 2 (Izquierda)</MenuItem>
                  <MenuItem value="SECTION_3">Sección 3 (Derecha)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Disponibilidad</InputLabel>
                <Select
                  value={selectedSeat.available}
                  onChange={(e) => setSelectedSeat({...selectedSeat, available: e.target.value})}
                  label="Disponibilidad"
                >
                  <MenuItem value={true}>Disponible</MenuItem>
                  <MenuItem value={false}>No Disponible</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleUpdateSeat} 
            variant="contained"
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para editar secciones */}
      <Dialog 
        open={openSectionDialog} 
        onClose={() => setOpenSectionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSection?.id.includes('SECTION_') ? 'Editar Sección' : 'Añadir Sección'}
        </DialogTitle>
        <DialogContent>
          {editingSection && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre de la Sección"
                  value={editingSection.name}
                  onChange={(e) => setEditingSection({...editingSection, name: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Posición X"
                  value={editingSection.x}
                  onChange={(e) => setEditingSection({...editingSection, x: e.target.value})}
                  helperText="Ejemplo: '20%', '150px', 'right:20%'"
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Posición Y"
                  value={editingSection.y}
                  onChange={(e) => setEditingSection({...editingSection, y: e.target.value})}
                  helperText="Ejemplo: '100px', '30%'"
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Ancho"
                  value={editingSection.width}
                  onChange={(e) => setEditingSection({...editingSection, width: e.target.value})}
                  helperText="Ejemplo: '40%', '300px'"
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Alto"
                  value={editingSection.height}
                  onChange={(e) => setEditingSection({...editingSection, height: e.target.value})}
                  helperText="Ejemplo: '30%', '200px'"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Nota: Al editar una sección, los asientos asociados a ella seguirán perteneciendo a la misma.
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSectionDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleSaveSection} 
            variant="contained"
            disabled={!editingSection?.name}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para añadir asientos en masa */}
      <Dialog 
        open={openBulkAddDialog} 
        onClose={() => setOpenBulkAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Añadir Fila de Asientos</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Crea múltiples asientos en una disposición ordenada. Puedes crear filas rectas o con curvatura.
          </DialogContentText>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Ubicación y tamaño</Typography>
            </Grid>
          
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sección</InputLabel>
                <Select
                  value={bulkAddConfig.section}
                  onChange={(e) => setBulkAddConfig({...bulkAddConfig, section: e.target.value})}
                  label="Sección"
                >
                  {sections.map(section => (
                    <MenuItem key={section.id} value={section.id}>
                      {section.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Número de filas"
                type="number"
                fullWidth
                value={bulkAddConfig.rows}
                onChange={(e) => setBulkAddConfig({...bulkAddConfig, rows: Math.max(1, parseInt(e.target.value) || 1)})}
                inputProps={{ min: 1, max: 20 }}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Asientos por fila"
                type="number"
                fullWidth
                value={bulkAddConfig.seatsPerRow}
                onChange={(e) => setBulkAddConfig({...bulkAddConfig, seatsPerRow: Math.max(1, parseInt(e.target.value) || 1)})}
                inputProps={{ min: 1, max: 30 }}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tipo de Asiento</InputLabel>
                <Select
                  value={bulkAddConfig.type}
                  onChange={(e) => setBulkAddConfig({...bulkAddConfig, type: e.target.value})}
                  label="Tipo de Asiento"
                >
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="ECONOMY">Económico</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={8}>
              <Typography gutterBottom>Curvatura de la fila</Typography>
              <Slider
                value={bulkAddConfig.curvature}
                onChange={(e, newValue) => setBulkAddConfig({...bulkAddConfig, curvature: newValue})}
                min={0}
                max={30}
                step={5}
                marks={[
                  { value: 0, label: 'Recto' },
                  { value: 15, label: 'Medio' },
                  { value: 30, label: 'Curvo' }
                ]}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Formato de etiquetas</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estilo de etiquetas</InputLabel>
                <Select
                  value={bulkAddConfig.customRowLabels}
                  onChange={(e) => setBulkAddConfig({...bulkAddConfig, customRowLabels: e.target.value})}
                  label="Estilo de etiquetas"
                >
                  <MenuItem value={false}>Letras (A, B, C...)</MenuItem>
                  <MenuItem value={true}>Números (1, 2, 3...)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label={bulkAddConfig.customRowLabels ? "Fila inicial (número)" : "Fila inicial (letra)"}
                type={bulkAddConfig.customRowLabels ? "number" : "text"}
                fullWidth
                value={bulkAddConfig.customRowLabels ? 1 : bulkAddConfig.startRow}
                onChange={(e) => {
                  if (bulkAddConfig.customRowLabels) {
                    setBulkAddConfig({...bulkAddConfig, startingRow: Math.max(1, parseInt(e.target.value) || 1)});
                  } else {
                    setBulkAddConfig({...bulkAddConfig, startRow: e.target.value.toUpperCase()});
                  }
                }}
                inputProps={bulkAddConfig.customRowLabels ? { min: 1 } : { maxLength: 1 }}
                disabled={bulkAddConfig.customRowLabels}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Prefijo de fila"
                type="text"
                fullWidth
                value={bulkAddConfig.prefix}
                onChange={(e) => setBulkAddConfig({...bulkAddConfig, prefix: e.target.value})}
                placeholder="Ej: Fila "
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Número inicial de asiento"
                type="number"
                fullWidth
                value={bulkAddConfig.startingNumber}
                onChange={(e) => setBulkAddConfig({...bulkAddConfig, startingNumber: Math.max(1, parseInt(e.target.value) || 1)})}
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Formato de números</InputLabel>
                <Select
                  value={bulkAddConfig.useNumberPadding}
                  onChange={(e) => setBulkAddConfig({...bulkAddConfig, useNumberPadding: e.target.value})}
                  label="Formato de números"
                >
                  <MenuItem value={true}>Con ceros (01, 02, 03...)</MenuItem>
                  <MenuItem value={false}>Sin ceros (1, 2, 3...)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Opciones avanzadas</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Dirección de numeración</InputLabel>
                <Select
                  value={bulkAddConfig.startFromRight}
                  onChange={(e) => setBulkAddConfig({...bulkAddConfig, startFromRight: e.target.value})}
                  label="Dirección de numeración"
                >
                  <MenuItem value={false}>De izquierda a derecha</MenuItem>
                  <MenuItem value={true}>De derecha a izquierda</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo de numeración</InputLabel>
                <Select
                  value={bulkAddConfig.useOnlyEven ? "even" : (bulkAddConfig.useOnlyOdd ? "odd" : "normal")}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBulkAddConfig({
                      ...bulkAddConfig, 
                      useOnlyEven: value === "even",
                      useOnlyOdd: value === "odd"
                    });
                  }}
                  label="Tipo de numeración"
                >
                  <MenuItem value="normal">Normal (1,2,3,4...)</MenuItem>
                  <MenuItem value="even">Solo pares (2,4,6,8...)</MenuItem>
                  <MenuItem value="odd">Solo impares (1,3,5,7...)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Sufijo de fila"
                type="text"
                fullWidth
                value={bulkAddConfig.rowSuffix}
                onChange={(e) => setBulkAddConfig({...bulkAddConfig, rowSuffix: e.target.value})}
                placeholder="Ej: - "
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Prefijo de asiento"
                type="text"
                fullWidth
                value={bulkAddConfig.seatPrefix}
                onChange={(e) => setBulkAddConfig({...bulkAddConfig, seatPrefix: e.target.value})}
                placeholder="Ej: Asiento "
              />
            </Grid>
          </Grid>
          
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Vista previa:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {generateSeatLabel(0, 0, bulkAddConfig)} ··· {generateSeatLabel(0, bulkAddConfig.seatsPerRow-1, bulkAddConfig)}
            </Typography>
            <Typography variant="body1">
              ⋮
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {generateSeatLabel(bulkAddConfig.rows-1, 0, bulkAddConfig)} ··· {generateSeatLabel(bulkAddConfig.rows-1, bulkAddConfig.seatsPerRow-1, bulkAddConfig)}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.05)', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Se crearán {bulkAddConfig.rows * bulkAddConfig.seatsPerRow} asientos con etiquetas desde {bulkAddConfig.startRow}{bulkAddConfig.startingNumber} hasta {String.fromCharCode(bulkAddConfig.startRow.charCodeAt(0) + bulkAddConfig.rows - 1)}{bulkAddConfig.startingNumber + bulkAddConfig.seatsPerRow - 1}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkAddDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleBulkAdd} 
            variant="contained"
          >
            Añadir Asientos
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para editar textos informativos */}
      <Dialog 
        open={openTextDialog} 
        onClose={() => setOpenTextDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedText ? 'Editar Texto Informativo' : 'Añadir Texto Informativo'}
        </DialogTitle>
        <DialogContent>
          {selectedText && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contenido del texto"
                  value={selectedText.content}
                  onChange={(e) => setSelectedText({...selectedText, content: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Posición X"
                  type="number"
                  value={selectedText.x}
                  onChange={(e) => setSelectedText({...selectedText, x: parseInt(e.target.value)})}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Posición Y"
                  type="number"
                  value={selectedText.y}
                  onChange={(e) => setSelectedText({...selectedText, y: parseInt(e.target.value)})}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tamaño de letra"
                  type="number"
                  value={selectedText.fontSize}
                  onChange={(e) => setSelectedText({...selectedText, fontSize: parseInt(e.target.value)})}
                  inputProps={{ min: 8, max: 36 }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Color"
                  value={selectedText.color}
                  onChange={(e) => setSelectedText({...selectedText, color: e.target.value})}
                  placeholder="white, black, #ff0000, etc."
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTextDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleSaveText} 
            variant="contained"
            disabled={!selectedText?.content}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TemplateEditor;