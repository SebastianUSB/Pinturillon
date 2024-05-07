<?php
include 'conexion.php';

$filtroCategoria = $_POST['filtroCategoria'] ?? '';
$filtroEstado = $_POST['filtroEstado'] ?? '';

$sql = "SELECT s.id_sala, s.nombre, c.nombre as categoria, s.estado FROM sala_de_juego s JOIN categoria c ON s.id_categoria = c.id_categoria";

$conditions = [];
if ($filtroCategoria) {
    $conditions[] = "s.id_categoria = " . $filtroCategoria;
}
if ($filtroEstado) {
    $conditions[] = "s.estado = '" . $filtroEstado . "'";
}

if (count($conditions) > 0) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

$result = $conn->query($sql);
$salas = [];
while ($row = $result->fetch_assoc()) {
    $salas[] = $row;
}

echo json_encode($salas);
$conn->close();
?>
