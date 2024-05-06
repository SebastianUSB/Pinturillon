<?php
include 'conexion.php';

$query = "SELECT id_sala, nombre FROM sala_de_juego ORDER BY nombre";
$result = $conn->query($query);

$salas = [];
while ($row = $result->fetch_assoc()) {
    $salas[] = $row;
}

echo json_encode($salas);
$conn->close();
?>
