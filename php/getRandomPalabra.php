<?php
include 'conexion.php';

// Numero de palabras aleatorias
$limit = 3; 

$query = "SELECT texto FROM palabra ORDER BY RAND() LIMIT ?";
if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    $palabras = [];
    while ($row = $result->fetch_assoc()) {
        $palabras[] = $row['texto'];
    }
    echo json_encode($palabras);
    $stmt->close();
} else {
    echo json_encode(["error" => "Error al preparar la consulta: " . $conn->error]);
}
$conn->close();
?>