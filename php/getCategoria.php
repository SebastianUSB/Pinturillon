<?php
include 'conexion.php';

$query = "SELECT id_categoria, nombre FROM categoria ORDER BY nombre";
$result = $conn->query($query);

$categorias = [];
while ($row = $result->fetch_assoc()) {
    $categorias[] = $row;
}

echo json_encode($categorias);
$conn->close();
?>