<?php
include 'conexion.php';

$id_palabra = $_POST['id_palabra'] ?? '';

if ($stmt = $conn->prepare("DELETE FROM palabra WHERE id_palabra = ?")) {
    $stmt->bind_param("i", $id_palabra);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Palabra eliminada con éxito"]);
    } else {
        echo json_encode(["success" => false, "message" => "No se pudo eliminar la palabra"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Error al preparar la consulta"]);
}
$conn->close();
?>