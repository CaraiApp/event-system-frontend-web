#\!/bin/bash

# Lista de archivos JSX en el proyecto
files=$(find src -name "*.jsx")

# Recorrer cada archivo y realizar la conversión
for file in $files; do
  echo "Procesando $file..."
  
  # Crear un archivo temporal
  temp_file=$(mktemp)
  
  # Convertir caracteres específicos
  cat "$file" | sed 's/�a/á/g; s/�e/é/g; s/�i/í/g; s/�o/ó/g; s/�u/ú/g; s/�A/Á/g; s/�E/É/g; s/�I/Í/g; s/�O/Ó/g; s/�U/Ú/g; s/�/ñ/g; s/�/Ñ/g; s/�/ü/g; s/�/Ü/g; s/�/¿/g; s/�/¡/g' > "$temp_file"
  
  # Determinar si hubo cambios
  if cmp -s "$file" "$temp_file"; then
    echo "No se encontraron problemas de codificación en $file"
  else
    # Reemplazar el archivo original con el archivo corregido
    cp "$temp_file" "$file"
    echo "Archivo $file corregido"
  fi
  
  # Eliminar el archivo temporal
  rm "$temp_file"
done

echo "Proceso completado"
