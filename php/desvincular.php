<?php
include 'conexion.php';

$id_palabra = $_POST['id_palabra'] ?? '';
$id_categoria = $_POST['id_categoria'] ?? '';

if ($id_palabra && $id_categoria) {
    $stmt = $conn->prepare("DELETE FROM palabras_por_categoria WHERE id_palabra = ? AND id_categoria = ?");
    $stmt->bind_param("ii", $id_palabra, $id_categoria);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Desvinculación exitosa"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al desvincular"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
$conn->close();
?>