<?php
header('Content-Type: application/json');
include 'conexion.php';

$query = "SELECT id_palabra, texto FROM palabra ORDER BY texto";
$result = $conn->query($query);

$palabras = [];
while ($row = $result->fetch_assoc()) {
    $palabras[] = $row;
}

echo json_encode($palabras);
$conn->close();
?>